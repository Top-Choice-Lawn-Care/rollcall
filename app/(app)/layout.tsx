import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import AuthGuard from '@/components/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main
          style={{ flex: 1, overflowY: 'auto', marginLeft: 0 }}
          className="md:ml-[220px] pb-20 md:pb-0"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
