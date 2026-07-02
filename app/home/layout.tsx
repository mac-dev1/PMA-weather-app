import SideNav from '@/app/ui/home/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="p-1 md:py-4 md:px-8 overflow-auto">{children}</div>
    </div>
  );
}