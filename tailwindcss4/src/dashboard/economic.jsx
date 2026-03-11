import {
  ChartLine,
  CircleDollarSign,
  Coffee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function EconomicData() {
  const metrics = [
    {
      title: "National Agricultural Growth",
      icon: TrendingUp,
      value: "8.8%",
      change: "+0.4%",
      positive: true,
      subtitle: "vs last month",
    },
    {
      title: "Average Farmer Income",
      icon: CircleDollarSign,
      value: "₹33,200",
      change: "+12.5%",
      positive: true,
      subtitle: "vs last month",
    },
    {
      title: "Cattle Market Index",
      icon: ChartLine,
      value: "1,247",
      change: "-2.1%",
      positive: false,
      subtitle: "vs last month",
    },
    {
      title: "Milk Production Growth",
      icon: Coffee,
      value: "6.2%",
      change: "+1.8%",
      positive: true,
      subtitle: "vs last month",
    },
  ];

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="!text-xl md:!text-3xl font-bold mb-4">
          Economic Data
        </h1>
        <p className="text-gray-600">
          Comprehensive analysis of economic trends, market data, and farmer
          profitability metrics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;

          return (
            <div
              key={m.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">
                  {m.title}
                </div>

                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <Icon size={18} />
                </div>
              </div>

              {/* Main Value */}
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {m.value}
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                    m.positive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {m.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {m.change}
                </div>

                <span className="text-xs text-gray-500">
                  {m.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}