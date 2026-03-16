import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8 space-y-6">
        <Topbar title={title} subtitle={subtitle} />
        {children}
      </main>
    </div>
  );
}
