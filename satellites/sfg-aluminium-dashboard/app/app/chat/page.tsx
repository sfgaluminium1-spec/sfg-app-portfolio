
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Sidebar } from '@/components/sidebar';
import ChatbotIntegration from '@/components/chatbot-integration';

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <ChatbotIntegration />
      </main>
    </div>
  );
}
