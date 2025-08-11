import MobileNav from "../components/MobileNav";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="hidden md:flex bg-white shadow p-4">
        <h1 className="text-lg font-bold">FermePocket</h1>
      </header>

      <main className="flex-1 p-4">{children}</main>

      {/* Navigation mobile */}
      <MobileNav />
    </div>
  );
}
