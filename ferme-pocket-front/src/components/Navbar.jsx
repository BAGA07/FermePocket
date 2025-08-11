export default function Navbar({ title }) {
  return (
    <header className="sticky top-0 bg-white shadow z-30 px-4 py-2 flex items-center justify-between md:ml-64">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-600">Bonjour, Aboubacar</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </header>
  );
}
