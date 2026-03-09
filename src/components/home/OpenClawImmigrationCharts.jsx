import { useEffect, useMemo, useState } from "react";
import { getImmigrationInsights } from "@/lib/immigrationInsights";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis } from "recharts";
import { Activity, RefreshCw } from "lucide-react";

const barConfig = {
  updates: { label: "So cap nhat", color: "#164e63" },
};

const lineConfig = {
  updates: { label: "So cap nhat", color: "#0f766e" },
};

const pieColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
      Chua co du lieu bieu do tu OpenClaw. Bam "Lam moi" de tao du lieu moi.
    </div>
  );
}

export default function OpenClawImmigrationCharts() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInsights = async (force = false) => {
    setRefreshing(true);

    try {
      const result = await getImmigrationInsights(force);
      setInsights(result.chart_insights || null);
      setLastUpdated(result.timestamp ? new Date(result.timestamp) : null);
    } catch (error) {
      console.error("OpenClaw chart generation failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const confidenceLabel = useMemo(() => {
    if (!insights?.confidence) return "Chua ro";
    if (insights.confidence === "high") return "Do tin cay: Cao";
    if (insights.confidence === "medium") return "Do tin cay: Trung binh";
    return "Do tin cay: Thap";
  }, [insights]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#0f2347]" />
          <h3 className="text-xl font-bold text-[#0a1628]">Bieu do OpenClaw: Phan tich di tru</h3>
          <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">AI Agent + Skill</span>
        </div>
        <button
          onClick={() => fetchInsights(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Dang lam moi..." : "Lam moi"}
        </button>
      </div>

      {lastUpdated && (
        <p className="text-xs text-slate-500">
          Lan cap nhat: {lastUpdated.toLocaleString("vi-VN")} | {confidenceLabel}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white md:col-span-2" />
        </div>
      ) : !insights ? (
        <EmptyState />
      ) : (
        <>
          <p className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
            {insights.summary || "OpenClaw da tong hop nhanh cac thay doi di tru moi nhat."}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">Muc do cap nhat theo visa</p>
              <ChartContainer config={barConfig} className="h-60 w-full">
                <BarChart data={insights.visa_activity || []} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="visa" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="updates" fill="var(--color-updates)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">Ty trong muc do quan trong</p>
              <ChartContainer config={{ value: { label: "Ty trong", color: "#3b82f6" } }} className="h-60 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={insights.importance_breakdown || []}
                    dataKey="value"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    outerRadius={84}
                    label
                  >
                    {(insights.importance_breakdown || []).map((entry, index) => (
                      <Cell key={`${entry.level}-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p className="mb-3 text-sm font-semibold text-slate-700">Xu huong cap nhat theo thoi gian</p>
              <ChartContainer config={lineConfig} className="h-64 w-full">
                <LineChart data={insights.timeline || []} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="updates" stroke="var(--color-updates)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
