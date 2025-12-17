import { useState } from "react";
import './index.css';
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: nameList }),
      });

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-7xl flex flex-col items-center">
        
        <header className="text-center mb-16 lg:mb-24">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none mb-6">
            SMART <span className="text-blue-600">LEAD</span>
          </h1>
          <p className="text-xl lg:text-3xl text-gray-500 font-medium uppercase tracking-[0.2em]">
            Precision Batch Verification
          </p>
        </header>

        <div className="w-full bg-gray-900/50 border border-gray-800 rounded-[3rem] p-8 lg:p-20 shadow-2xl mb-16">
          <label className="block text-2xl lg:text-4xl font-bold mb-10 text-center text-gray-400 uppercase tracking-widest">
            Enter Names Below
          </label>

          <textarea
            rows="5"
            placeholder="PETER, ADITI, RAVI, SATOSHI..."
            className="w-full p-10 lg:p-16 text-2xl lg:text-5xl rounded-[2rem] bg-black border-2 border-gray-800 focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-800 text-center uppercase tracking-tighter leading-tight shadow-inner"
            value={names}
            onChange={(e) => setNames(e.target.value)}
          />

          <div className="flex justify-center mt-12 lg:mt-20">
            <button
              onClick={submitNames}
              disabled={loading}
              className="w-full lg:w-2/3 py-8 lg:py-12 rounded-3xl bg-blue-600 hover:bg-blue-500 text-3xl lg:text-5xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
              {loading ? "PROCESSING..." : "VERIFY BATCH"}
            </button>
          </div>
        </div>

  
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-6 px-6">
          <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
            Directory <span className="text-gray-600 ml-4">{filteredLeads.length}</span>
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-auto bg-gray-900 border-2 border-gray-800 rounded-2xl px-10 py-5 text-2xl lg:text-3xl font-bold outline-none focus:border-blue-600 appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Verified</option>
            <option>To Check</option>
          </select>
        </div>

        <div className="w-full bg-gray-900 border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl mb-20">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="px-10 py-8 text-xl lg:text-2xl font-black uppercase text-gray-500 text-left">Name</th>
                <th className="px-10 py-8 text-xl lg:text-2xl font-black uppercase text-gray-500 text-center">Country</th>
                <th className="px-10 py-8 text-xl lg:text-2xl font-black uppercase text-gray-500 text-center">Confidence</th>
                <th className="px-10 py-8 text-xl lg:text-2xl font-black uppercase text-gray-500 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-10 text-3xl lg:text-5xl font-bold tracking-tighter">{lead.name}</td>
                  <td className="px-10 py-10 text-2xl lg:text-3xl text-gray-500 text-center font-medium">{lead.country}</td>
                  <td className="px-10 py-10 text-2xl lg:text-4xl font-mono text-center text-blue-400">
                    {(lead.probability * 100).toFixed(1)}%
                  </td>
                  <td className="px-10 py-10 text-right">
                    <span
                      className={`px-8 py-3 rounded-2xl text-lg lg:text-xl font-black uppercase ${
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

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-40 text-4xl lg:text-6xl font-black text-gray-800 uppercase tracking-widest">
                    Database Empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;