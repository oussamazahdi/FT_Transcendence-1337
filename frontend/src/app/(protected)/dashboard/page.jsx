"use client"
import React from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const dashboard = () => {
  return (
    <div className="flex w-full min-w-100 mx-3 lg:w-4/5 min-h-[80vh] rounded-lg overflow-hidden">
      <h1>This is dashboard</h1>
    </div>
  );
};

export default dashboard;
