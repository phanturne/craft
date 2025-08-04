-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    visibility VARCHAR(20) DEFAULT 'private' NOT NULL CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for chats table
CREATE INDEX IF NOT EXISTS chats_user_id_idx ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS chats_visibility_idx ON public.chats(visibility);
CREATE INDEX IF NOT EXISTS chats_created_at_idx ON public.chats(created_at);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(50) NOT NULL,
    parts JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS messages_role_idx ON public.messages(role);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    is_upvoted BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (chat_id, message_id, user_id)
);

-- Create indexes for votes table
CREATE INDEX IF NOT EXISTS votes_chat_id_idx ON public.votes(chat_id);
CREATE INDEX IF NOT EXISTS votes_message_id_idx ON public.votes(message_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS votes_is_upvoted_idx ON public.votes(is_upvoted);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public chats" ON public.chats
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can create their own chats" ON public.chats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" ON public.chats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats" ON public.chats
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.user_id = auth.uid() OR chats.visibility = 'public')
        )
    );

CREATE POLICY "Users can create messages in their chats" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in their chats" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages in their chats" ON public.messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

-- RLS Policies for votes
CREATE POLICY "Users can view votes in accessible chats" ON public.votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = votes.chat_id 
            AND (chats.user_id = auth.uid() OR chats.visibility = 'public')
        )
    );

CREATE POLICY "Users can create votes in accessible chats" ON public.votes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = votes.chat_id 
            AND (chats.user_id = auth.uid() OR chats.visibility = 'public')
        )
        AND votes.user_id = auth.uid()
    );

CREATE POLICY "Users can update their own votes" ON public.votes
    FOR UPDATE USING (votes.user_id = auth.uid());

CREATE POLICY "Users can delete their own votes" ON public.votes
    FOR DELETE USING (votes.user_id = auth.uid());

-- Function to update updated_at timestamp for chats
CREATE OR REPLACE FUNCTION public.handle_chats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for chats
DROP TRIGGER IF EXISTS handle_chats_updated_at ON public.chats;
CREATE TRIGGER handle_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW EXECUTE FUNCTION public.handle_chats_updated_at();

-- Function to create default chat title if not provided
CREATE OR REPLACE FUNCTION public.handle_chat_title()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.title IS NULL OR NEW.title = '' THEN
        NEW.title := 'New Chat ' || to_char(NOW(), 'YYYY-MM-DD HH24:MI');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set default chat title
DROP TRIGGER IF EXISTS handle_chat_title ON public.chats;
CREATE TRIGGER handle_chat_title
    BEFORE INSERT ON public.chats
    FOR EACH ROW EXECUTE FUNCTION public.handle_chat_title();