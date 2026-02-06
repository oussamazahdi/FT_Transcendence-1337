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
  const [total, setTotal] = useState<[]>([])
  const [labels, setLabels] = useState<[]>([])
  const [loading, setLoading] = useState(false);

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
        const formattedLabels = rawData.map((item: any) => {
          const date = new Date(item.day);
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        });
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
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Matches Played",
        data:total,
        backgroundColor: "#2A1C91",
        borderRadius: 8,
        hoverBackgroundColor: "#C729AC",
      },
    ],
  };

  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] flex-1 min-h-75 p-4">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MatchesPlayed;