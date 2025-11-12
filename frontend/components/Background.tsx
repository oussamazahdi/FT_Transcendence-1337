"use client"
export default function Background({ children }: { children: React.ReactNode }) {
	return (
		<div className=" min-h-screen">
			<div className="fixed inset-0 z-0">
		  		<img src="/BG.png" alt="Background" className="w-full h-full object-cover" />
		  		<div className="absolute inset-0 bg-black/10" />
			</div>
			<div className="z-10000">
					{children}
			</div>
	   </div>
	);
};


// "use client";

// export default function Background({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative">
//       {/* Fixed background */}
//       <div className="fixed inset-0 -z-10">
//         <img src="/BG.png" alt="Background" className="w-full h-full object-cover"/>
//         <div className="absolute inset-0 bg-black/10" />
//       </div>

//       {/* Fixed navbar */}
//       <header className="fixed top-0 left-0 w-full z-50">
//         {/* Your navbar component here */}
//       </header>

//       {/* Scrollable content */}
//       <main className="relative z-10 min-h-screen pt-[var(--navbar-height)]">
//         {children}
//       </main>
//     </div>
//   );
// }
