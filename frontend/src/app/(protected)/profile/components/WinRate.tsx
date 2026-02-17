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

const WinRate = ({id}:any) => {
  const [wins, setWins] = useState<any[]>([])
  const [loses, setLoses] = useState<any[]>([])
  const [labels, setLabels] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
    useEffect(()=>{
      const fetchDaysData = async () => {
        setLoading(true);
        try{
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics/weekly?userId=${id}`, {
            method:"get",
            credentials:"include"
          })
  
          if (!response.ok) 
            throw new Error;
          
          const data = await response.json();
          const rawData = data.data || [];
          const formattedLabels = rawData.map((d: {day:string}) => {
            const date = new Date(d.day);
            return date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });
          });
          while (formattedLabels.length < 7) {
            formattedLabels.push("-");
          }
          const winsData = rawData.map((item: any) => item.wins);
          const losesData = rawData.map((item: any) => item.loses);

          setLabels(formattedLabels);
          setWins(winsData);
          setLoses(losesData);
        }catch(error:any){
          return []
        }finally{
          setLoading(false);
        }
      }
      fetchDaysData()
    },[id])
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
      title:{
        display: true,
        color:"#FFFFFF",
        text: "Win/Lose Rate",
        font: {
          size: 20,
          lineHeight: 1.2,
        },
      }
    },
  };

  const data = {
    labels: labels,
    datasets:[{
      label:"Wins",
      data: wins,
      backgroundColor:"rgb(66, 167, 138, 0.5)",
      borderColor:"rgb(66, 167, 138, 0.5)",
      borderWidth:1,
    },
    {
      label:"Loses",
      data: loses,
      backgroundColor:"rgb(178, 59, 59, 0.5)",
      borderColor:"rgb(178, 59, 59, 0.5)",
      borderWidth:1

    }
    ]
  }
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] flex-1 h-full min-h-55 md:min-h-0 p-4">
      {loading ? 
      <p>Loading...</p>
      : 
      <Line
      options={options}
      data={data}
      />
    }
    </div>
  );
};

export default WinRate;
