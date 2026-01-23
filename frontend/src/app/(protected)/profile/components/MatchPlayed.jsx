import React from "react";
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const MatchPlayed = () => {
  const margin = { right: 40, left: 1};
  const data = {
    matchPlayed:[15, 35, 7, 15, 45, 16, 13],
    days:['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  }
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] basis-1/2">
      <Box sx={{ width: '100%', height: '100%' }}>
        <LineChart
          series={[
            { data: data.matchPlayed, label: 'matchPlayed', area: true, showMark: false/*color: ''*/ },
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

export default MatchPlayed;
