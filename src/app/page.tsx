import { loadAllData } from '@/lib/data-loader';
import { PortfolioTabs } from '@/components/portfolio-tabs';
import { Sidebar } from '@/components/sidebar';
import { ChatbotModal } from '@/components/ChatbotModal';
import { TerminalHeader } from '@/components/TerminalHeader';

export default async function Home() {
  const data = await loadAllData();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background dot-grid">
      <aside className="lg:w-[380px] lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:overflow-y-auto z-10">
        <Sidebar data={data.intro} />
      </aside>

      <main className="flex-1 lg:ml-[380px] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
          <TerminalHeader />

          <div className="fade-up" style={{ animationDelay: '1.4s' }}>
            <PortfolioTabs data={data} />
          </div>
        </div>
      </main>

      <ChatbotModal />
    </div>
  );
}
