import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const MatchStats = () => {
  const [statistics, setStatistics] = useState<(number | null)[]>([])
  const [loading, setLoading] = useState(false);
  
  useEffect(()=>{
    const fetchStatistics = async () => {
      setLoading(true);
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics/`, {
          method:"get",
          credentials:"include"
        })

        if (!response.ok) 
          throw new Error;
        
        const data = await response.json();
        setStatistics([data.data[0].wins, data.data[0].loses,data.data[0].win_forfaits,data.data[0].lose_forfaits]);
      }catch(error:any){
        return []
      }finally{
        setLoading(false);
      }
    }
    fetchStatistics()
  },[])

  const data = {
    labels: ["Wins", "Loses", "Forfeit Wins", "Forfeit Loses"],
    datasets: [
      {
        label: "Match Outcomes",
        data: statistics,
        backgroundColor: [
          "rgb(66, 167, 138, 0.5)",
          "rgb(178, 59, 59, 0.5)", 
          "rgb(17, 95, 72, 0.5)", 
          "rgb(152, 10, 10, 0.5)", 
        ],
        borderColor: "rgba(15, 15, 15, 0)",
        borderWidth: 0,
        hoverOffset: 10,
        borderRadius: 6,
        spacing: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: "white",
          padding: 15,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 30,
        displayColors: true,
      },
      title:{
        display: true,
        color:"#FFFFFF",
        text: "Matches statistics",
        font: {
          size: 20,
          lineHeight: 1.2,
        },
      }
    },
  };

  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] p-2 md:py-10 flex-1 flex h-full flex-col items-center min-h-55 md:min-h-0">
      <div className="w-full flex-1 min-h-0">
        {loading ? <div>Loading....</div>
        :
        <Doughnut data={data} options={options} />
        }
      </div>
    </div>
  );
};

export default MatchStats;
