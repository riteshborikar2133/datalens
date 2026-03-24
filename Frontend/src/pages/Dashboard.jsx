import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ComposedChart,
  Area,
  ErrorBar,
  Scatter,
  AreaChart,
  ScatterChart,
} from "recharts";
import {
  AlertCircle,
  Copy,
  FileText,
  Database,
  ArrowLeft,
  Columns,
  List,
  LayoutDashboard,
  TableIcon,
  Search,
  Activity,
  Grid3X3,
} from "lucide-react";
import { useData } from "../context/DataContext";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file } = useData();

  const apiData = location.state?.analyticsData;
  const csvRows = location.state?.csvRows || [];
  const headers = csvRows.length ? Object.keys(csvRows[0]) : [];

  const [view, setView] = useState("analytics");
  const [distCol, setDistCol] = useState(
    apiData?.statistics ? Object.keys(apiData.statistics)[0] : "",
  );
  // Toggle between Boxplot and Distribution Curve
  const [graphType, setGraphType] = useState("curve");
  const [selectedPair, setSelectedPair] = useState({
    x: "ApplicantIncome",
    y: "LoanAmount",
  });
  // HeatMap
  // Helper to scale colors from -1 (red/negative) to 1 (blue/positive)
  const getHeatmapColor = (value) => {
    if (value === 1) return "bg-blue-600 text-white font-bold";
    if (value > 0.5) return "bg-blue-500/80 text-white";
    if (value > 0.1) return "bg-blue-400/30 text-blue-200";
    if (value < -0.1) return "bg-red-500/30 text-red-200";
    return "bg-slate-800 text-slate-500";
  };

  if (!apiData) return <div className="bg-slate-950 min-h-screen" />;

  const missingValuesChart = Object.keys(apiData.missing_values)
    .map((key) => ({ column: key, count: apiData.missing_values[key] }))
    .filter((item) => item.count > 0);

  // --- LOGIC: Box Plot Data ---
  const boxPlotData = useMemo(() => {
    const s = apiData.statistics[distCol];
    if (!s) return [];
    return [
      {
        name: distCol,
        min: s.min,
        q1: s["25%"],
        median: s["50%"],
        q3: s["75%"],
        max: s.max,
        // The "box" spans from Q1 to Q3
        box: [s["25%"], s["75%"]],
      },
    ];
  }, [distCol, apiData]);

  // --- LOGIC: Curve/Distribution Data ---
  const distributionData = useMemo(() => {
    if (!csvRows.length || !distCol || !apiData.statistics[distCol]) return [];
    const stats = apiData.statistics[distCol];
    const values = csvRows
      .map((r) => parseFloat(r[distCol]))
      .filter((v) => !isNaN(v));

    const binCount = 20;
    const binWidth = (stats.max - stats.min) / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: (stats.min + i * binWidth).toFixed(0),
      count: 0,
    }));

    values.forEach((v) => {
      const idx = Math.min(
        Math.floor((v - stats.min) / binWidth),
        binCount - 1,
      );
      if (idx >= 0) bins[idx].count++;
    });
    return bins;
  }, [csvRows, distCol, apiData]);

  return (
    <div className="h-screen bg-slate-950 text-slate-200 p-4 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analysis Studio
          </h1>
        </div>

        <div className="flex space-x-2">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center mr-4">
            <button
              onClick={() => setGraphType("boxplot")}
              className={`px-3 py-1 rounded-lg text-[10px] transition-all ${graphType === "boxplot" ? "bg-white/10 text-blue-400" : "text-slate-500"}`}
            >
              Box Plot
            </button>
            <button
              onClick={() => setGraphType("curve")}
              className={`px-3 py-1 rounded-lg text-[10px] transition-all ${graphType === "curve" ? "bg-white/10 text-blue-400" : "text-slate-500"}`}
            >
              Curve
            </button>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setView("analytics")}
              className={`px-4 py-1.5 rounded-lg text-xs transition-all ${view === "analytics" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Analytics
            </button>
            <button
              onClick={() => setView("correlation")}
              className={`px-4 py-1.5 rounded-lg text-xs transition-all ${view === "correlation" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Correlation
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-1.5 rounded-lg text-xs transition-all ${view === "table" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Raw Data
            </button>
          </div>
        </div>
      </div>

      {view === "analytics" ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-4 gap-4 mb-4 shrink-0">
            <MiniCard
              title="Rows"
              value={apiData.rows}
              icon={<Database size={16} />}
              color="text-blue-400"
            />
            <MiniCard
              title="Cols"
              value={apiData.columns}
              icon={<Columns size={16} />}
              color="text-purple-400"
            />
            <MiniCard
              title="Dups"
              value={apiData.duplicate_rows}
              icon={<Copy size={16} />}
              color="text-yellow-400"
            />
            <MiniCard
              title="Nulls"
              value={Object.values(apiData.missing_values).reduce(
                (a, b) => a + b,
                0,
              )}
              icon={<AlertCircle size={16} />}
              color="text-red-400"
            />
          </div>

          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 mb-4">
            <div className="col-span-12 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-semibold flex items-center gap-2">
                  <Activity size={14} className="text-blue-400" />
                  {graphType === "boxplot"
                    ? "Statistical Range (Box Plot)"
                    : "Data Density (Curve)"}
                </h3>
                <select
                  value={distCol}
                  onChange={(e) => setDistCol(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-[10px] text-blue-400 focus:outline-none"
                >
                  {Object.keys(apiData.statistics).map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  {graphType === "boxplot" ? (
                    <ComposedChart
                      data={boxPlotData}
                      layout="vertical"
                      margin={{ left: 40, right: 40 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff05"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        stroke="#64748b"
                        fontSize={10}
                        axisLine={false}
                        tickLine={false}
                        domain={["dataMin - 10", "dataMax + 10"]}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={10}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="box"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        barSize={30}
                      >
                        <ErrorBar
                          dataKey="box"
                          direction="x"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </Bar>
                      {/* Median Line Indicator */}
                      <Scatter dataKey="median" fill="#ef4444" shape="line" />
                    </ComposedChart>
                  ) : (
                    <AreaChart data={distributionData}>
                      <defs>
                        <linearGradient
                          id="colorDist"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff05"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="range"
                        stroke="#64748b"
                        fontSize={9}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorDist)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 shrink-0 h-[30%]">
            {/* Missing Values Chart */}
            <div className="col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col min-h-0">
              <h3 className="text-xs font-semibold mb-2 flex items-center gap-2">
                <List size={14} className="text-blue-400" /> Nulls
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={missingValuesChart}>
                  <XAxis dataKey="column" hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Table */}
            <div className="col-span-8 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
              <div className="overflow-auto h-full custom-scrollbar">
                <table className="w-full text-left text-[10px] border-collapse">
                  <thead className="sticky top-0 bg-slate-900">
                    <tr className="text-slate-500 border-b border-white/10">
                      <th className="py-2">Metric</th>
                      {Object.keys(apiData.statistics).map((col) => (
                        <th key={col} className="px-2">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 divide-y divide-white/5">
                    {["mean", "std", "min", "50%", "max"].map((stat) => (
                      <tr key={stat}>
                        <td className="py-2 font-bold uppercase text-slate-500">
                          {stat}
                        </td>
                        {Object.keys(apiData.statistics).map((col) => (
                          <td key={col} className="px-2 font-mono">
                            {apiData.statistics[col][stat]?.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : view === "correlation" ? (
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 animate-in fade-in duration-500">
          {/* LEFT SIDE: Dynamic Insight Panel (5/12) */}
          <div className="col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">
                Relationship Insight
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Viewing:{" "}
                <span className="text-blue-400 font-bold">
                  {selectedPair.x}
                </span>{" "}
                vs{" "}
                <span className="text-blue-400 font-bold">
                  {selectedPair.y}
                </span>
              </p>
            </div>

            {/* Scatter Plot showing the relationship */}
            <div className="flex-1 bg-slate-900/50 rounded-2xl border border-white/5 p-4 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis
                    type="number"
                    dataKey={selectedPair.x}
                    name={selectedPair.x}
                    stroke="#64748b"
                    fontSize={10}
                  />
                  <YAxis
                    type="number"
                    dataKey={selectedPair.y}
                    name={selectedPair.y}
                    stroke="#64748b"
                    fontSize={10}
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Data Points"
                    data={csvRows.slice(0, 200)}
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <p className="text-xs text-blue-200 leading-relaxed">
                <AlertCircle size={14} className="inline mr-2 mb-1" />
                Quick Tip: Click any cell in the matrix on the right to see the
                detailed trend and scatter distribution here.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: The Matrix (7/12) */}
          <div className="col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Pearson Matrix
              </h3>
              <div className="flex gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-blue-400">
                  ● Positive
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  ● Negative
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="min-w-full border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    {Object.keys(apiData.correlation).map((h) => (
                      <th
                        key={h}
                        className="p-2 text-[9px] uppercase text-slate-500 font-bold text-center w-20 truncate"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(apiData.correlation).map(
                    ([rowName, values]) => (
                      <tr key={rowName}>
                        <td className="p-2 text-[9px] font-bold text-slate-400 uppercase text-right pr-4 whitespace-nowrap">
                          {rowName}
                        </td>
                        {Object.entries(values).map(([colName, val]) => (
                          <td
                            key={colName}
                            onClick={() =>
                              setSelectedPair({ x: rowName, y: colName })
                            }
                            className={`p-4 text-center text-xs font-mono rounded-xl border border-white/5 transition-all hover:scale-105 cursor-pointer active:scale-95 ${getHeatmapColor(val)} ${selectedPair.x === rowName && selectedPair.y === colName ? "ring-2 ring-white ring-inset" : ""}`}
                          >
                            {val.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Raw Data View */
        <div className="h-full bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse min-w-max">
              <thead className="sticky top-0 bg-slate-800 shadow-md">
                <tr>
                  <th className="p-3 text-slate-400 border-b border-white/10">
                    #
                  </th>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="p-3 text-slate-400 border-b border-white/10 uppercase tracking-tighter"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {csvRows.slice(0, 100).map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="p-3 text-slate-600 font-mono">{i + 1}</td>
                    {headers.map((h) => (
                      <td key={h} className="p-3 text-slate-300 font-mono">
                        {row[h] || "NaN"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniCard = ({ title, value, icon, color }) => (
  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center space-x-3">
    <div className="p-2 bg-slate-900 rounded-lg border border-white/5">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold leading-none mb-1">
        {title}
      </p>
      <h2 className={`text-lg font-bold leading-none ${color}`}>{value}</h2>
    </div>
  </div>
);

export default Dashboard;
