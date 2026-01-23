import React from "react";
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const WinRate = () => {
  const margin = { right: 40, left: 1};
  const data = {
    win:[10, 20, 2, 6, 12, 14, 9],
    lose:[5, 15, 5, 9, 33, 2, 4],
    days:['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  }
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] flex-1 max-h-[389px]">
      <Box sx={{ width: '100%', height: '100%' }}>
        <LineChart
          series={[
            { data: data.win, label: 'win', /*color: ''*/ },
            { data: data.lose, label: 'lose', /*color: ''*/ },
          ]}
          xAxis={[{ scaleType: 'point', data: data.days, height: 28 }]}
          margin={margin}

          sx={{
              "& .MuiChartsAxis-line": {
                stroke: "#FFFFFF !important",
              },
              "& .MuiChartsAxis-tick": {
                stroke: "#FFFFFF !important",
              },
              "& .MuiChartsAxis-tickLabel": {
                fill: "#FFFFFF !important",
              },
              "& .MuiChartsLegend-series": {
                fill: "#FFFFFF !important",
              }
            }}
        />
      </Box>
    </div>
  );
};

export default WinRate;
