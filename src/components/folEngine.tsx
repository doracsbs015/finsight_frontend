import type {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "../state/types";

// --- Utility helpers ---
const formatCurrency = (num: number | undefined) =>
  num !== undefined && !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";

const average = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);


// --- Core reasoning engine ---
export const folEngine = async (
  query: string,
  kpis?: GetKpisResponse[],
  products?: GetProductsResponse[],
  transactions?: GetTransactionsResponse[]
): Promise<string> => {
  if (!query.trim()) return "Please type something meaningful 🧐";

  const input = query.toLowerCase().trim();



  // 2️⃣ Data-dependent logic
  if (!kpis || !products || !transactions)
    return "Loading data from backend... ⏳";

  const kpi = kpis[0];
  if (!kpi) return "No KPI data found.";

  const monthlyData = kpi.monthlyData || [];
  const dailyData = kpi.dailyData || [];

  // --- Rule set (20+ FOL queries) ---
  if (input.includes("total revenue"))
    return `Total revenue is ${formatCurrency(kpi.totalRevenue)}.`;

  if (input.includes("total expenses"))
    return `Total expenses amount to ${formatCurrency(kpi.totalExpenses)}.`;

  if (input.includes("total profit"))
    return `Total profit is ${formatCurrency(kpi.totalProfit)}.`;

  if (input.includes("monthly revenue"))
    return monthlyData.length
      ? monthlyData.map((m) => `${m.month}: ${formatCurrency(m.revenue)}`).join("\n")
      : "No monthly revenue data found.";

  if (input.includes("monthly profit"))
    return monthlyData.length
      ? monthlyData
          .map(
            (m) =>
              `${m.month}: ${formatCurrency((m.revenue ?? 0) - (m.expenses ?? 0))}`
          )
          .join("\n")
      : "No monthly profit data found.";

  if (input.includes("operational") && input.includes("non-operational"))
    return monthlyData.length
      ? monthlyData
          .map(
            (m) =>
              `${m.month}: Operational ${formatCurrency(
                m.operationalExpenses
              )}, Non-operational ${formatCurrency(m.nonOperationalExpenses)}`
          )
          .join("\n")
      : "No expense comparison data found.";

  if (input.includes("highest earning month")) {
    const max = monthlyData.reduce(
      (a, b) => ((b.revenue ?? 0) > (a.revenue ?? 0) ? b : a),
      monthlyData[0]
    );
    return `Highest earning month is ${max.month} with revenue ${formatCurrency(
      max.revenue
    )}.`;
  }

  if (input.includes("lowest performing month")) {
    const min = monthlyData.reduce(
      (a, b) => ((b.revenue ?? 0) < (a.revenue ?? 0) ? b : a),
      monthlyData[0]
    );
    return `Lowest performing month is ${min.month} with revenue ${formatCurrency(
      min.revenue
    )}.`;
  }

  if (input.includes("daily revenue"))
    return dailyData.length
      ? dailyData
          .map((d) => `${d.date}: ${formatCurrency(d.revenue)}`)
          .slice(-10)
          .join("\n")
      : "No daily data available.";

  if (input.includes("expenses by category")) {
    const catMap = kpi.expensesByCategory || {};
    const res = Object.entries(catMap).map(
      ([key, val]) => `${key}: ${formatCurrency(Number(val))}`
    );
    return res.length ? res.join("\n") : "No category expense data.";
  }

  if (input.includes("products above")) {
    const match = input.match(/above\s*\$?(\d+)/);
    const priceLimit = match ? Number(match[1]) : 0;
    const filtered = products.filter((p) => (p.price ?? 0) > priceLimit);
    return filtered.length
      ? `Products priced above $${priceLimit}:\n${filtered
          .map((p) => `${p._id}: ${formatCurrency(p.price)}`)
          .join("\n")}`
      : `No products found above $${priceLimit}.`;
  }

  if (input.includes("average expense per product")) {
    const avg = average(products.map((p) => p.expense ?? 0));
    return `Average expense per product: ${formatCurrency(avg)}.`;
  }

  if (input.includes("top buyers")) {
    const buyers: Record<string, number> = {};
    transactions.forEach((t) => {
      buyers[t.buyer] = (buyers[t.buyer] ?? 0) + (t.amount ?? 0);
    });
    const top = Object.entries(buyers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([buyer, amt], i) => `${i + 1}. ${buyer} - ${formatCurrency(amt)}`);
    return `Top 5 buyers:\n${top.join("\n")}`;
  }

  if (input.includes("total number of transactions"))
    return `Total transactions recorded: ${transactions.length}.`;

  if (input.includes("profit per product")) {
    const res = products.map(
      (p) =>
        `Product ${p._id}: ${formatCurrency(
          (p.price ?? 0) - (p.expense ?? 0)
        )}`
    );
    return res.join("\n");
  }

  if (input.includes("revenue trend"))
    return monthlyData.length
      ? `Revenue trend:\n${monthlyData
          .map((m) => `${m.month}: ${formatCurrency(m.revenue)}`)
          .join("\n")}`
      : "No revenue trend data found.";

  if (input.includes("is company profitable") || input.includes("profitable"))
    return kpi.totalRevenue > kpi.totalExpenses
      ? "Yes, the company is profitable! 🎉"
      : "No, expenses exceed revenue. 📉";

  if (input.includes("predict next month")) {
    const lastTwo = monthlyData.slice(-2);
    if (lastTwo.length < 2) return "Not enough data for prediction.";
    const growth =
      ((lastTwo[1].revenue ?? 0) - (lastTwo[0].revenue ?? 0)) /
      (lastTwo[0].revenue ?? 1);
    const predicted = (lastTwo[1].revenue ?? 0) * (1 + growth);
    return `Predicted next month revenue: ${formatCurrency(predicted)} (based on ${(
      growth * 100
    ).toFixed(2)}% growth).`;
  }

  if (input.includes("net margin")) {
    const margin = (kpi.totalProfit / kpi.totalRevenue) * 100;
    return `Net profit margin: ${margin.toFixed(2)}%.`;
  }

  if (input.includes("operational expense ratio")) {
    const totalOp = sum(monthlyData.map((m) => m.operationalExpenses ?? 0));
    const totalNonOp = sum(monthlyData.map((m) => m.nonOperationalExpenses ?? 0));
    const ratio = totalOp / (totalNonOp || 1);
    return `Operational to Non-Operational expense ratio: ${ratio.toFixed(2)}:1.`;
  }

  if (input.includes("revenue vs expenses"))
    return monthlyData.length
      ? monthlyData
          .map(
            (m) =>
              `${m.month}: Revenue ${formatCurrency(
                m.revenue
              )}, Expenses ${formatCurrency(m.expenses)}`
          )
          .join("\n")
      : "No data for revenue vs expenses.";

  // --- Fallback ---
  return "Not defined. Try another way. 🤔";
};
