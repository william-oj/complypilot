import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assets", label: "Assets" },
  { href: "/risks", label: "Risks" },
  { href: "/controls", label: "Controls" },
  { href: "/policies", label: "Policies" },
  { href: "/evidence", label: "Evidence" },
  { href: "/audits", label: "Audits" }
];

export function Sidebar() {
  return (
    <aside className="w-full md:w-64 md:min-h-screen md:sticky md:top-0 px-6 py-8 bg-white/80 backdrop-blur border-r border-slate-100">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-ink text-white flex items-center justify-center font-semibold">CP</div>
        <div>
          <div className="text-lg font-semibold">ComplyPilot</div>
          <div className="text-xs text-slate-500">ISO made simple</div>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
