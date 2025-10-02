import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, type GridCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { blue } from "@mui/material/colors";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [blue[800], blue[500]];

  const { data: kpiData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsQuery();

  const pieChartData = useMemo(() => {
    if (kpiData?.[0]?.expensesByCategory) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(([key, value]) => [
        { name: key, value },
        { name: `${key} of Total`, value: totalExpenses - value },
      ]);
    }
    return [];
  }, [kpiData]);

  const productColumns = [
    { field: "_id", headerName: "id", flex: 1 },
    { field: "expense", headerName: "Expense", flex: 0.5, renderCell: (params: GridCellParams) => `$${params.value}` },
    { field: "price", headerName: "Price", flex: 0.5, renderCell: (params: GridCellParams) => `$${params.value}` },
  ];

  const transactionColumns = [
    { field: "_id", headerName: "id", flex: 1 },
    { field: "buyer", headerName: "Buyer", flex: 0.67 },
    { field: "amount", headerName: "Amount", flex: 0.35, renderCell: (params: GridCellParams) => `$${params.value}` },
    { field: "productIds", headerName: "Count", flex: 0.1, renderCell: (params: GridCellParams) => (params.value as Array<string>)?.length || 0 },
  ];

  // Styled DataGrid Box (text fixed to light color)
  const gridBoxSx = {
  "& .MuiDataGrid-root": {
    backgroundColor: palette.background.default, // dashboard background
    border: "none",
    fontSize: 14,
    color: "#fff", // all row text white
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${palette.divider} !important`,
    color: "#fff", // row values text white
  },
  "& .MuiDataGrid-columnHeaders": {
    borderBottom: `1px solid ${palette.divider} !important`,
    backgroundColor: "#fff", // <-- column header background white
    color: "#000", // <-- column header text black
    fontWeight: 600,
  },
  "& .MuiDataGrid-columnSeparator": {
    visibility: "hidden",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#3b3b3b", // subtle hover
  },
};

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader title="List of Products" sideText={`${productData?.length || 0} products`} />
        <Box mt="0.5rem" p="0 0.5rem" height="75%" sx={gridBoxSx}>
          <DataGrid columnHeaderHeight={25} rowHeight={35} hideFooter rows={productData || []} columns={productColumns} />
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="h">
        <BoxHeader title="Recent Orders" sideText={`${transactionData?.length || 0} latest transactions`} />
        <Box mt="1rem" p="0 0.5rem" height="80%" sx={gridBoxSx}>
          <DataGrid columnHeaderHeight={25} rowHeight={35} hideFooter rows={transactionData || []} columns={transactionColumns} />
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="i">
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie stroke="none" data={data} innerRadius={18} outerRadius={35} paddingAngle={2} dataKey="value">
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="j">
        <BoxHeader title="Overall Summary and Explanation Data" sideText="+15%" />
        <Box height="15px" margin="1.25rem 1rem 0.4rem 1rem" bgcolor={blue[800]} borderRadius="1rem">
          <Box height="15px" bgcolor={blue[600]} borderRadius="1rem" width="40%" />
        </Box>
        <Typography margin="0 1rem" variant="h6">
          Orci aliquam enim vel diam. Venenatis euismod id donec mus lorem etiam ullamcorper odio sed. Ipsum non sed gravida etiam urna egestas molestie volutpat et. Malesuada quis pretium aliquet lacinia ornare sed. In volutpat nullam at est id cum pulvinar nunc.
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
