import ChatList from '@/components/chat/ChatList';
import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Chat</h1>
          <p className="text-muted-foreground">Your conversations with AI</p>
        </div>
        <ChatList />
      </div>
    </div>
  );
}
