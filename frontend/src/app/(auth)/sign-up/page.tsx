'use client'
import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import Link from 'next/link'
import Input from './components/Input'

export default function SignUp(){
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		
		setLoading(true);

		try{

			const reply = await fetch("http://localhost:5000/sign-up" ,{
				method:"POST",
				headers: {
					"Content-Type": "application/json",
        },
				credentials: "include",
				body: JSON.stringify({
					firstname,
					lastname,
          username,
					email,
          password,
        })
			});
			
			 if (!reply.ok) {
        const errorData = await reply.json();
        throw new Error(errorData.message || "Signup failed");
      }

	  	const data = await reply.json();
      console.log("Signup successful:", data);

	  	router.push("/Dashboard");
		}catch(err:any){
			setError(err.message || "An error occurred");
			console.error("Signup error", err)
		}finally{
			setLoading(false);
		}
}

  return (
	<div className='min-h-screen flex justify-center items-center'>
		<div className='flex flex-row  justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-4xl'>
				<form onSubmit={handleSubmit} className="space-y-1 flex flex-col items-center justify-center text-white w-[400px] mx-2">
					<h1 className='text-2xl font-bold text-center '>Create an account</h1>
					<p className='text-xs text-center mb-8'>Enter your personal data to create your account</p>
					<div>
						<input
							type="text"
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
							placeholder="Firstname"
							required
							className="mr-1 w-40 h-8 px-4 py-2 rounded bg-white/10 text-white text-xs placeholder-gray-400 focus:outline-none"
							/>
						<input
							type="text"
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
							placeholder="Lastname"
							required
							className="w-40 h-8 px-4 py-2 rounded bg-white/10 text-white text-xs placeholder-gray-400 focus:outline-none"
							/>
					</div>
					<Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nickname"/>
					<Input type="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder="Email address"/>
					<Input type="password" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Password"/>
					<Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />

					{error && <p className="text-red-500 text-xs text-center">{error}</p>}
					<button
						type="submit"
						disabled={loading}
						className=" w-81 mt-3 px-4 py-2 bg-teal-950 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-500 transition"
						>
						{loading ? "Creating account..." : "Continue"}
					</button>

					<p className="text-gray-400 text-xs text-center mt-4">
					Already have an account?{" "}
					<Link href="/sign-in" className="text-green-400 hover:text-green-300">
						Sign In
					</Link>
					</p>
					
				</form>

			<div className= 'relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]'>
				<Image
					src={assets.loginImg}
					alt="logo"
					fill={true}
					className='object-cover'
					/>
			</div>

		</div>
	</div>
  )
}
