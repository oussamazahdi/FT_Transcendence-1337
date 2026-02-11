"use client"
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  defaults
} from 'chart.js';
import {Line} from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const WinRate = () => {
  const [wins, setWins] = useState<[]>([])
  const [loses, setLoses] = useState<[]>([])
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
          const winsData = rawData.map((item: any) => item.wins);
          const losesData = rawData.map((item: any) => item.loses);

          setLabels(formattedLabels);
          setWins(winsData);
          setLoses(losesData);
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
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 12,
          }
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
        labels: {
          color: "white",
        },
      },
    },
  };

  const data = {
    labels: labels,
    datasets:[{
      label:"Wins",
      data: wins,
      backgroundColor:"#2A1C91",
      borderColor:"#2A1C91",
      borderWidth:1,
    },
    {
      label:"Loses",
      data: loses,
      backgroundColor:"#C729AC",
      borderColor:"#C729AC",
      borderWidth:1

    }
    ]
  }
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] flex-1 h-full min-h-[220px] md:min-h-0 p-2">
      <Line
        options={options}
        data={data}
      />
    </div>
  );
};

export default WinRate;
