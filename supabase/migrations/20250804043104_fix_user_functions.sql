
CREATE OR REPLACE FUNCTION public.generate_unique_username(
    base_name TEXT DEFAULT NULL,
    user_id_param UUID DEFAULT NULL
) 
RETURNS TEXT AS $$
DECLARE
    clean_base TEXT;
    random_suffix TEXT;
    final_username TEXT;
BEGIN
    -- Clean base name
    clean_base := COALESCE(base_name, 'user');
    clean_base := lower(regexp_replace(clean_base, '[^a-zA-Z0-9]', '', 'g'));
    clean_base := left(clean_base, 15);
    
    IF clean_base = '' THEN
        clean_base := 'user';
    END IF;
    
    -- Generate random suffix using a simpler approach
    random_suffix := substr(md5(random()::text || clock_timestamp()::text), 1, 6);
    final_username := clean_base || '_' || random_suffix;
    
    -- Extremely unlikely to collide, but handle just in case
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
        -- Use user_id based name as guaranteed unique
        final_username := 'user_' || replace(substr(user_id_param::text, 1, 13), '-', '');
    END IF;
    
    RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Drop existing conflicting triggers
DROP TRIGGER IF EXISTS user_stats_creation_trigger ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop old functions to recreate them
DROP FUNCTION IF EXISTS create_user_stats();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create consolidated function that handles both profile and user_stats creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (user_id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        public.generate_unique_username(
            COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
            NEW.id
        ),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
        NULLIF(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create user_stats record
    INSERT INTO public.user_stats (user_id, total_points, created_at, updated_at)
    VALUES (NEW.id, 0, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user_points function to be more robust
CREATE OR REPLACE FUNCTION update_user_points() 
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        UPDATE user_stats 
        SET total_points = total_points + NEW.points,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
        
        -- Ensure the update actually affected a row
        IF NOT FOUND THEN
            RAISE EXCEPTION 'user_stats record not found for user_id: %. This indicates a data integrity issue.', NEW.user_id;
        END IF;
        
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        UPDATE user_stats 
        SET total_points = total_points - OLD.points,
            updated_at = NOW()
        WHERE user_id = OLD.user_id;
        RETURN OLD;
    END IF;
    
    -- Handle UPDATE
    IF TG_OP = 'UPDATE' THEN
        UPDATE user_stats 
        SET total_points = total_points - OLD.points + NEW.points,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the single consolidated trigger for user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate user_points triggers
DROP TRIGGER IF EXISTS user_points_insert_trigger ON user_points;
DROP TRIGGER IF EXISTS user_points_delete_trigger ON user_points;
DROP TRIGGER IF EXISTS user_points_update_trigger ON user_points;

CREATE TRIGGER user_points_insert_trigger
    AFTER INSERT ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

CREATE TRIGGER user_points_delete_trigger
    AFTER DELETE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

CREATE TRIGGER user_points_update_trigger
    AFTER UPDATE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();