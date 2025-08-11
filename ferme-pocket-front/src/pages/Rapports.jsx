export default function Rapports() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rapports</h1>
      <p className="mb-4">Générez vos rapports d’activité en PDF ou Excel.</p>
      <div className="flex gap-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          📄 Exporter en PDF
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          📊 Exporter en Excel
        </button>
      </div>
    </div>
  );
}
