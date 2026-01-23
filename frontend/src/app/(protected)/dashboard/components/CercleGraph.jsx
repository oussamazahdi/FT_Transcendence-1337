import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';


const CercleGraph = () => {
  const data= [
    { id: 0, value: 10, },
    { id: 1, value: 15, },
    { id: 2, value: 20, },
    { id: 3, value: 30, },
    { id: 4, value: 5, },
    { id: 5, value: 12, },
    { id: 6, value: 20, },
  ]
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] flex-1 h-full max-h-[360px]">
      <PieChart
      series={[
        {
          data: data,
          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: 0,
          endAngle: 360,
          cx: 160,
          cy: 160,
        }
      ]}
    />
    </div>
  )
}

export default CercleGraph
