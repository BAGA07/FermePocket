import { useEffect, useMemo, useState } from 'react';
import financeService from '../services/financeService';

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [ventes, setVentes] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [stats, setStats] = useState(null);

  const [venteForm, setVenteForm] = useState({ produit: '', quantite: 0, prix: 0, date: new Date().toISOString().slice(0,10), client: '' });
  const [depenseForm, setDepenseForm] = useState({ categorie: '', libelle: '', montant: 0, date: new Date().toISOString().slice(0,10), moyen: 'Espèces' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [vts, deps, st] = await Promise.all([
          financeService.getVentes(),
          financeService.getDepenses(),
          financeService.getStatsDashboard(),
        ]);
        if (!mounted) return;
        setVentes(vts);
        setDepenses(deps);
        setStats(st);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const totalVentes = useMemo(() => ventes.reduce((s,v)=> s + v.quantite * v.prix, 0), [ventes]);
  const totalDepenses = useMemo(() => depenses.reduce((s,d)=> s + d.montant, 0), [depenses]);
  const benefice = useMemo(() => totalVentes - totalDepenses, [totalVentes, totalDepenses]);

  const handleAddVente = async (e) => {
    e.preventDefault();
    const created = await financeService.addVente({
      ...venteForm,
      quantite: Number(venteForm.quantite),
      prix: Number(venteForm.prix),
    });
    setVentes(prev => [created, ...prev]);
    setVenteForm({ produit: '', quantite: 0, prix: 0, date: new Date().toISOString().slice(0,10), client: '' });
  };

  const handleAddDepense = async (e) => {
    e.preventDefault();
    const created = await financeService.addDepense({
      ...depenseForm,
      montant: Number(depenseForm.montant),
    });
    setDepenses(prev => [created, ...prev]);
    setDepenseForm({ categorie: '', libelle: '', montant: 0, date: new Date().toISOString().slice(0,10), moyen: 'Espèces' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord Financier</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Chiffre d'affaires (mois)" value={(stats?.chiffreAffaires ?? totalVentes).toLocaleString()} color="text-green-600" />
        <StatCard title="Dépenses (mois)" value={(stats?.totalDepenses ?? totalDepenses).toLocaleString()} color="text-red-600" />
        <StatCard title="Bénéfice (mois)" value={(stats?.benefice ?? benefice).toLocaleString()} color={benefice >= 0 ? 'text-green-700' : 'text-red-700'} />
        <StatCard title="Cash Flow" value={(stats?.cashFlow ?? benefice).toLocaleString()} color="text-indigo-700" />
      </div>

      {/* Ajout rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleAddVente} className="bg-white shadow rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Ajouter une Vente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Produit" value={venteForm.produit} onChange={e=>setVenteForm(v=>({...v, produit:e.target.value}))} required />
            <input className="input" placeholder="Client" value={venteForm.client} onChange={e=>setVenteForm(v=>({...v, client:e.target.value}))} />
            <input className="input" type="number" placeholder="Quantité" value={venteForm.quantite} onChange={e=>setVenteForm(v=>({...v, quantite:e.target.value}))} required />
            <input className="input" type="number" placeholder="Prix unitaire" value={venteForm.prix} onChange={e=>setVenteForm(v=>({...v, prix:e.target.value}))} required />
            <input className="input" type="date" value={venteForm.date} onChange={e=>setVenteForm(v=>({...v, date:e.target.value}))} />
          </div>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </form>

        <form onSubmit={handleAddDepense} className="bg-white shadow rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Ajouter une Dépense</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Catégorie" value={depenseForm.categorie} onChange={e=>setDepenseForm(v=>({...v, categorie:e.target.value}))} required />
            <input className="input" placeholder="Libellé" value={depenseForm.libelle} onChange={e=>setDepenseForm(v=>({...v, libelle:e.target.value}))} required />
            <input className="input" type="number" placeholder="Montant" value={depenseForm.montant} onChange={e=>setDepenseForm(v=>({...v, montant:e.target.value}))} required />
            <select className="input" value={depenseForm.moyen} onChange={e=>setDepenseForm(v=>({...v, moyen:e.target.value}))}>
              <option>Espèces</option>
              <option>Mobile money</option>
              <option>Virement</option>
            </select>
            <input className="input" type="date" value={depenseForm.date} onChange={e=>setDepenseForm(v=>({...v, date:e.target.value}))} />
          </div>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </form>
      </div>

      {/* Listes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <div className="p-4 font-semibold">Ventes récentes</div>
          <table className="w-full">
            <thead className="bg-green-50 text-green-700">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Produit</th>
                <th className="px-4 py-2 text-left">Qté</th>
                <th className="px-4 py-2 text-left">Prix</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventes.map((v,i)=> (
                <tr key={v.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2">{v.date}</td>
                  <td className="px-4 py-2">{v.produit}</td>
                  <td className="px-4 py-2">{v.quantite}</td>
                  <td className="px-4 py-2">{Number(v.prix).toLocaleString()}</td>
                  <td className="px-4 py-2 font-semibold">{(Number(v.quantite)*Number(v.prix)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <div className="p-4 font-semibold">Dépenses récentes</div>
          <table className="w-full">
            <thead className="bg-red-50 text-red-700">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Catégorie</th>
                <th className="px-4 py-2 text-left">Libellé</th>
                <th className="px-4 py-2 text-left">Montant</th>
              </tr>
            </thead>
            <tbody>
              {depenses.map((d,i)=> (
                <tr key={d.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2">{d.date}</td>
                  <td className="px-4 py-2">{d.categorie}</td>
                  <td className="px-4 py-2">{d.libelle}</td>
                  <td className="px-4 py-2 font-semibold">{Number(d.montant).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && <div className="text-gray-500">Chargement...</div>}
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
