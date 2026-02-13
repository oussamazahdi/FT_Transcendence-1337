"use client"
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MatchesPlayed = () => {
  const [total, setTotal] = useState<any[]>([])
  const [labels, setLabels] = useState<any[]>([])
  const [loading, setLoading] = useState(false);//to use later

  useEffect(()=>{
    const fetchDaysData = async () => {
      setLoading(true);
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics/weekly`, {
          method:"get",
          credentials:"include"
        })

        if (!response.ok) 
          throw new Error;
        const data = await response.json();
        const rawData = data.data || [];
        // const rawData = [{day: '2026-02-7', wins: 10, loses: 11, total: 21},{day: '2026-02-8', wins: 7, loses: 3, total: 10},{day: '2026-02-9', wins: 0, loses: 5, total: 5},{day: '2026-02-10', wins: 6, loses: 8, total: 14},{day: '2026-02-11', wins: 1, loses: 1, total: 2}]
        const formattedLabels = rawData.map((d:{day:string}) => {
          const date = new Date(d.day);
          return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
        });
        while (formattedLabels.length < 7) {
          formattedLabels.push("-");
        }
        const totalData = rawData.map((item: any) => item.total);
        setLabels(formattedLabels);
        setTotal(totalData);
      }catch(error:any){
        console.log("faild to fetch Statistics");
        return []
      }finally{
        setLoading(false);
      }
    }
    fetchDaysData()
  },[])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#FFFFFF",
          font: { size: 12 },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#FFFFFF",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white",
        },
      },
      title:{
        display: true,
        color:"#FFFFFF",
        text: "Match history",
        font: {
          size: 20,
          lineHeight: 1.2,
        },
      }
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Matches Played",
        data:total,
        backgroundColor: "rgb(17, 95, 72, 0.5)",
        borderRadius: 3,
        // hoverBackgroundColor: "#C729AC",
      },
    ],
  };

  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] flex-1 h-full min-h-55 md:min-h-0 p-4">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MatchesPlayed;
