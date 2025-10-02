import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
} from "recharts";
import { grey, blue, green } from "@mui/material/colors"; // import colors

const Row1 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();

  const revenue = useMemo(() => {
    return data?.[0]?.monthlyData?.map(({ month, revenue }) => ({
      name: month.substring(0, 3),
      revenue,
    }));
  }, [data]);

  const revenueExpenses = useMemo(() => {
    return data?.[0]?.monthlyData?.map(({ month, revenue, expenses }) => ({
      name: month.substring(0, 3),
      revenue,
      expenses,
    }));
  }, [data]);

  const revenueProfit = useMemo(() => {
    return data?.[0]?.monthlyData?.map(({ month, revenue, expenses }) => ({
      name: month.substring(0, 3),
      revenue,
      profit: (revenue - expenses).toFixed(2),
    }));
  }, [data]);

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Revenue and Expenses"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueExpenses}
            margin={{ top: 15, right: 25, left: -10, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={blue[300]} stopOpacity={0.5} />
                <stop offset="95%" stopColor={blue[300]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={green[300]} stopOpacity={0.5} />
                <stop offset="95%" stopColor={green[300]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: 10 }} />
            <YAxis
              tickLine={false}
              axisLine={{ strokeWidth: 0 }}
              style={{ fontSize: 10 }}
              domain={[8000, 23000]}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="b">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueProfit}
            margin={{ top: 20, right: 0, left: -10, bottom: 55 }}
          >
            <CartesianGrid vertical={false} stroke={grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: 10 }} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: 10 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: 10 }}
            />
            <Tooltip />
            <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0" }} />
            <Line yAxisId="left" type="monotone" dataKey="profit" stroke={green[500]} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={blue[500]} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="c">
        <BoxHeader
          title="Revenue Month by Month"
          subtitle="graph representing the revenue month by month"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenue}
            margin={{ top: 17, right: 15, left: -5, bottom: 58 }}
          >
            <defs>
              <linearGradient id="colorRevenueBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={blue[300]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={blue[300]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={grey[800]} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} style={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="url(#colorRevenueBar)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row1;
