// "use client"
// import React, { useEffect, useState, useRef } from 'react';

// export default function Dashboard() {
//   const canvaRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const context = canvaRef.current?.getContext("2d");
//     if (!context) return ;
//     const width= 800;
//     const height = 70
//     const bigX = 10, bigY = 10, bigW = width - 20, bigH = height - 20;
//     context.strokeRect(bigX, bigY, bigW, bigH);
//   }, []);

//   return (
//     <div>
//       <h1>this is dashboard</h1>
//       <canvas ref={canvaRef}></canvas>
//     </div>
//   );
// }


// // Optionally clear full canvas
// ctx.clearRect(0, 0, width, height);

// export default function Dashboard() {
//   return (
//      <div className="bg-red-700/40 h-9/10 w-full mx-3 lg:w-3/5">
//       <h1>this is dashboard</h1>
//     </div>
//   );
// }


export default function Dashboard() {
  return (
    <div className="w-full mx-3 lg:w-3/5 min-h-[85vh] bg-[#8D8D8D]/25 flex flex-row rounded-xl">
      <h1 className="text-white text-2xl font-semibold">This is Dashboard</h1>
    </div>
  );
}


// // Optionally clear full canvas
// ctx.clearRect(0, 0, width, height);