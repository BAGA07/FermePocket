import { useState } from "react";
import { Plus, FileText, ArrowUpCircle, ArrowDownCircle, Edit } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([
    { id: 1, nom: "Client A" },
    { id: 2, nom: "Client B" },
  ]);
  const [factures, setFactures] = useState([]);
  const [openFactureModal, setOpenFactureModal] = useState(false);
  const [openListeFacturesModal, setOpenListeFacturesModal] = useState(false);

  const [factureForm, setFactureForm] = useState({
    id: null,
    client_id: "",
    date: "",
    lignes: [{ description: "", quantite: 1, prix_unitaire: 0 }],
  });

  const totalRevenus = transactions.filter(t => t.type === "revenu").reduce((acc, t) => acc + t.montant, 0);
  const totalDepenses = transactions.filter(t => t.type === "depense").reduce((acc, t) => acc + t.montant, 0);
  const solde = totalRevenus - totalDepenses;

  const ajouterTransaction = (type) => {
    const montant = parseInt(prompt("Montant ?"));
    if (!montant) return;
    const description = prompt("Description ?") || "";
    const nouvelleTransaction = {
      id: transactions.length + 1,
      type,
      montant,
      description,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([...transactions, nouvelleTransaction]);
  };

  const addLigne = () => {
    setFactureForm({
      ...factureForm,
      lignes: [...factureForm.lignes, { description: "", quantite: 1, prix_unitaire: 0 }],
    });
  };

  const removeLigne = (index) => {
    const nouvellesLignes = factureForm.lignes.filter((_, i) => i !== index);
    setFactureForm({ ...factureForm, lignes: nouvellesLignes });
  };

  const updateLigne = (index, key, value) => {
    const nouvellesLignes = [...factureForm.lignes];
    nouvellesLignes[index][key] = key === "description" ? value : parseFloat(value);
    setFactureForm({ ...factureForm, lignes: nouvellesLignes });
  };

  const handleAddFacture = () => {
    if (!factureForm.client_id || !factureForm.date) return;

    const client = clients.find(c => c.id === parseInt(factureForm.client_id));
    const montant_total = factureForm.lignes.reduce((sum, l) => sum + l.quantite * l.prix_unitaire, 0);

    if (factureForm.id) {
      // Edition facture
      const facturesUpdated = factures.map(f =>
        f.id === factureForm.id ? { ...factureForm, client, montant_total } : f
      );
      setFactures(facturesUpdated);
    } else {
      // Nouvelle facture
      const nouvelleFacture = {
        id: factures.length + 1,
        client,
        date: factureForm.date,
        lignes: factureForm.lignes,
        montant_total,
        statut: "impayee",
      };
      setFactures([...factures, nouvelleFacture]);
    }

    setFactureForm({ id: null, client_id: "", date: "", lignes: [{ description: "", quantite: 1, prix_unitaire: 0 }] });
    setOpenFactureModal(false);
  };

  const handleEditFacture = (facture) => {
    setFactureForm({
      id: facture.id,
      client_id: facture.client.id,
      date: facture.date,
      lignes: facture.lignes,
    });
    setOpenFactureModal(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Résumé financier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 shadow-md">
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Revenus</p>
              <p className="text-xl font-bold text-green-600">{totalRevenus} FCFA</p>
            </div>
            <ArrowUpCircle className="text-green-600 w-8 h-8" />
          </CardContent>
        </Card>
        <Card className="p-4 shadow-md">
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Dépenses</p>
              <p className="text-xl font-bold text-red-600">{totalDepenses} FCFA</p>
            </div>
            <ArrowDownCircle className="text-red-600 w-8 h-8" />
          </CardContent>
        </Card>
        <Card className="p-4 shadow-md">
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Solde</p>
              <p className={`text-xl font-bold ${solde >= 0 ? "text-green-700" : "text-red-700"}`}>{solde} FCFA</p>
            </div>
            <FileText className="text-gray-600 w-8 h-8" />
          </CardContent>
        </Card>
      </div>

      {/* Boutons action */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => ajouterTransaction("revenu")} className="bg-green-600 hover:bg-green-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Ajouter revenu
        </Button>
        <Button onClick={() => ajouterTransaction("depense")} className="bg-red-600 hover:bg-red-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Ajouter dépense
        </Button>
        <Button onClick={() => setOpenFactureModal(true)} variant="outline" className="flex items-center">
          <FileText className="w-4 h-4 mr-2" /> Nouvelle facture
        </Button>
        <Button onClick={() => setOpenListeFacturesModal(true)} variant="outline" className="flex items-center">
          <FileText className="w-4 h-4 mr-2" /> Liste des factures
        </Button>
      </div>

      {/* Historique transactions */}
      <Card className="shadow-md">
        <CardContent className="p-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-3">Historique des transactions</h2>
          <table className="w-full border min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Montant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-t text-sm">
                  <td className="p-2">{t.date}</td>
                  <td className="p-2 capitalize">{t.type}</td>
                  <td className="p-2">{t.description}</td>
                  <td className={`p-2 font-bold ${t.type === "revenu" ? "text-green-600" : "text-red-600"}`}>{t.montant} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal ajout/edit facture */}
      <Dialog open={openFactureModal} onOpenChange={setOpenFactureModal}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[70vh]">
          <DialogHeader>
            <DialogTitle>{factureForm.id ? "Modifier Facture" : "Nouvelle Facture"}</DialogTitle>
          </DialogHeader>

          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1">Client</label>
              <select
                value={factureForm.client_id}
                onChange={e => setFactureForm({ ...factureForm, client_id: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Choisir client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Date</label>
              <input
                type="date"
                value={factureForm.date}
                onChange={e => setFactureForm({ ...factureForm, date: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <Button onClick={addLigne} className="mb-4 bg-green-600 hover:bg-green-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Ajouter ligne
          </Button>

          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Qté</th>
                <th className="p-2 border">Prix Unitaire</th>
                <th className="p-2 border">Montant</th>
                <th className="p-2 border">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {factureForm.lignes.map((l, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    <input type="text" value={l.description} onChange={e => updateLigne(i, "description", e.target.value)} className="w-full border p-1 rounded" />
                  </td>
                  <td className="p-2">
                    <input type="number" value={l.quantite} onChange={e => updateLigne(i, "quantite", e.target.value)} className="w-16 border p-1 rounded" />
                  </td>
                  <td className="p-2">
                    <input type="number" value={l.prix_unitaire} onChange={e => updateLigne(i, "prix_unitaire", e.target.value)} className="w-24 border p-1 rounded" />
                  </td>
                  <td className="p-2">{l.quantite * l.prix_unitaire}</td>
                  <td className="p-2">
                    <Button onClick={() => removeLigne(i)} variant="destructive">X</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-right font-bold mt-2">
            Total: {factureForm.lignes.reduce((sum, l) => sum + l.quantite * l.prix_unitaire, 0)} FCFA
          </p>

          <DialogFooter>
            <Button onClick={handleAddFacture} className="bg-blue-600 hover:bg-blue-700 mt-4">
              {factureForm.id ? "Modifier facture" : "Enregistrer facture"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Liste factures */}
      <Dialog open={openListeFacturesModal} onOpenChange={setOpenListeFacturesModal}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[70vh]">
          <DialogHeader>
            <DialogTitle>Liste des Factures</DialogTitle>
          </DialogHeader>

          {factures.length === 0 ? (
            <p className="text-gray-500">Aucune facture</p>
          ) : (
            <table className="w-full text-sm border min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">N° Facture</th>
                  <th className="p-2 border">Client</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Montant</th>
                  <th className="p-2 border">Statut</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {factures.map(f => (
                  <tr key={f.id} className="border-t">
                    <td className="p-2 font-bold">FAC-{f.id.toString().padStart(3, "0")}</td>
                    <td className="p-2">{f.client.nom}</td>
                    <td className="p-2">{f.date}</td>
                    <td className="p-2">{f.montant_total} FCFA</td>
                    <td className="p-2 capitalize">{f.statut}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="sm" onClick={() => handleEditFacture(f)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
