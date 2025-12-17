import { useState } from "react";
import "./index.css";

function App() {
  const [names, setNames] = useState("");
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const submitNames = async () => {
    if (!names.trim()) return;
    setLoading(true);
    const nameList = names.split(",").map((n) => n.trim());
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/batch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ names: nameList }),
        }
      );
      const data = await res.json();
      setLeads(data);
      setNames("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads =
    filter === "All"
      ? leads
      : leads.filter((lead) => lead.status === filter);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
            SMART <span className="text-blue-600">LEAD</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 uppercase tracking-widest">
            Precision Batch Verification
          </p>
        </header>

        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl mb-10">
          <label className="block text-sm sm:text-base md:text-lg font-semibold mb-4 text-center text-gray-400 uppercase tracking-wider">
            Enter Names
          </label>

          <textarea
            rows="3"
            placeholder="Peter, Aditi, Ravi, Satoshi"
            className="w-full p-4 sm:p-5 md:p-6 text-sm sm:text-base md:text-lg rounded-2xl bg-black border border-gray-800 focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-700 text-center uppercase tracking-tight"
            value={names}
            onChange={(e) => setNames(e.target.value)}
          />

          <div className="flex justify-center mt-6">
            <button
              onClick={submitNames}
              disabled={loading}
              className="w-full sm:w-2/3 py-3 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm sm:text-base md:text-lg font-bold transition-all disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "VERIFY BATCH"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight">
            Directory <span className="text-gray-600 ml-2">{filteredLeads.length}</span>
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm sm:text-base font-semibold outline-none focus:border-blue-600"
          >
            <option>All</option>
            <option>Verified</option>
            <option>To Check</option>
          </select>
        </div>

        <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-sm font-bold uppercase text-gray-400 text-left">Name</th>
                <th className="px-6 py-4 text-sm font-bold uppercase text-gray-400 text-center">Country</th>
                <th className="px-6 py-4 text-sm font-bold uppercase text-gray-400 text-center">Confidence</th>
                <th className="px-6 py-4 text-sm font-bold uppercase text-gray-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td className="px-6 py-4 text-base font-semibold">{lead.name}</td>
                  <td className="px-6 py-4 text-center text-gray-400">{lead.country}</td>
                  <td className="px-6 py-4 text-center text-blue-400">
                    {(lead.probability * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-4 py-1 rounded-lg text-xs font-bold uppercase ${
                        lead.status === "Verified"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow"
            >
              <div className="text-lg font-bold mb-1">{lead.name}</div>
              <div className="text-sm text-gray-400 mb-1">
                Country: <span className="text-white">{lead.country}</span>
              </div>
              <div className="text-sm text-blue-400 mb-2">
                Confidence: {(lead.probability * 100).toFixed(1)}%
              </div>
              <span
                className={`inline-block px-4 py-1 rounded-lg text-xs font-bold uppercase ${
                  lead.status === "Verified"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}
              >
                {lead.status}
              </span>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="text-center py-16 text-gray-700 font-bold uppercase">
              Database Empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
