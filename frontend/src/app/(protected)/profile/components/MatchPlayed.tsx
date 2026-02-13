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
        //[0,1,2]
        const data = await response.json();
        const rawData = data.data || [];
        const formattedLabels = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"]
        formattedLabels.splice(0, rawData.length)
				rawData.map((item: any) => {
          const date = new Date(item.day);
          formattedLabels.unshift(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
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
        backgroundColor: "#555555",
        hoverBackgroundColor: "#C729AC",
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
