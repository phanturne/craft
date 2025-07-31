-- Table for logging individual point events
CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL CHECK (points != 0), -- Prevent zero-point entries
    points_category VARCHAR(50) NOT NULL CHECK (points_category != ''), 
    reference_id UUID, 
    reference_type VARCHAR(50), 
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes separately (correct PostgreSQL syntax)
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_points_category ON user_points(points_category);
CREATE INDEX idx_user_points_created_at ON user_points(created_at); -- For time-based queries

-- Table for precomputed total_points
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Index for user_stats
CREATE INDEX idx_user_stats_total_points ON user_stats(total_points DESC); -- For leaderboards

-- Function to create user_stats when new user is created
CREATE OR REPLACE FUNCTION create_user_stats() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id, total_points, created_at, updated_at)
    VALUES (NEW.id, 0, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicates if somehow triggered twice
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create user_stats for new users
CREATE TRIGGER user_stats_creation_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_stats();

-- Improved function to update total_points with better concurrency handling
CREATE OR REPLACE FUNCTION update_user_points() 
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        INSERT INTO user_stats (user_id, total_points, updated_at)
        VALUES (NEW.user_id, NEW.points, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET 
            total_points = user_stats.total_points + NEW.points,
            updated_at = NOW();
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

-- Triggers for maintaining point totals
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

-- Enhanced sync function with better error handling
CREATE OR REPLACE FUNCTION sync_user_points() 
RETURNS TABLE(synced_users INTEGER, errors INTEGER) AS $$
DECLARE
    synced_count INTEGER := 0;
    error_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Update all user stats based on actual point totals
    FOR user_record IN 
        SELECT DISTINCT user_id FROM user_points
        UNION 
        SELECT user_id FROM user_stats
    LOOP
        BEGIN
            UPDATE user_stats
            SET total_points = COALESCE((
                SELECT SUM(points)
                FROM user_points
                WHERE user_id = user_record.user_id
            ), 0),
            updated_at = NOW()
            WHERE user_id = user_record.user_id;
            
            synced_count := synced_count + 1;
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Failed to sync points for user %: %', user_record.user_id, SQLERRM;
        END;
    END LOOP;
    
    RETURN QUERY SELECT synced_count, error_count;
END;
$$ LANGUAGE plpgsql;

-- Function to safely award points (prevents duplicate awards)
CREATE OR REPLACE FUNCTION award_points(
    p_user_id UUID,
    p_points INTEGER,
    p_category VARCHAR(50),
    p_reference_id UUID DEFAULT NULL,
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_unique_key VARCHAR(255) DEFAULT NULL -- Optional unique constraint for preventing duplicates
) 
RETURNS UUID AS $$
DECLARE
    point_id UUID;
BEGIN
    -- Optional uniqueness check
    IF p_unique_key IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM user_points 
            WHERE user_id = p_user_id 
            AND points_category = p_category 
            AND description = p_unique_key
        ) THEN
            RAISE EXCEPTION 'Points already awarded for this action: %', p_unique_key;
        END IF;
    END IF;
    
    INSERT INTO user_points (
        user_id, 
        points, 
        points_category, 
        reference_id, 
        reference_type, 
        description
    ) VALUES (
        p_user_id, 
        p_points, 
        p_category, 
        p_reference_id, 
        p_reference_type, 
        COALESCE(p_description, p_unique_key)
    ) RETURNING id INTO point_id;
    
    RETURN point_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Users can only see their own point details
CREATE POLICY "Users see own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own stats
CREATE POLICY "Users see own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);