'use client'
import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import Link from 'next/link'
import Input from './components/Input'
import ConnectWith from '@/components/ConnectWith'


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
			const reply = await fetch("http://localhost:3001/api/auth/register" ,{
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

			const parsedData = await reply.json();
			localStorage.setItem('token', parsedData.token);
			
			if (!reply.ok) {
				const errorData = await reply.json();
				throw new Error(errorData.message || "Signup failed");
			}
			
			const data = await reply.json();
			console.log("Signup successful:", data);
			router.replace("/sign-up/selecteImage");
		}
		catch(err:any){
			setError(err.message || "An error occurred");
			console.error("Signup error", err)
		}
		finally{
			setLoading(false);
		}
}

  return (
	<div className='min-h-screen flex justify-center items-center'>
		<div className='flex flex-row  justify-between bg-[#0F0F0F]/75 w-[800px] h-[480px] rounded-4xl'>
			<div className='flex flex-col items-center justify-center'>
				<form onSubmit={handleSubmit} className="space-y-1 flex flex-col items-center text-white w-[400px] mx-2">
					<h1 className='text-2xl font-bold text-center '>Create an account</h1>
					<p className='text-xs text-[#A6A6A6] text-center mb-6'>Enter your personal data to create your account</p>
					<div>
						<input
							type="text"
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
							placeholder="Firstname"
							required
							className="w-40 h-8 px-4 py-2 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
							/>
						<input
							type="text"
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
							placeholder="Lastname"
							required
							className="ml-1 w-40 h-8 px-4 py-2 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
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
						className=" w-81 mt-3 px-4 py-2 bg-[#0F2C34] text-white text-xs rounded hover:bg-[#245664] disabled:bg-gray-500 transition"
						>
						{loading ? "Creating account..." : "Continue"}
					</button>

					<p className="text-[#A6A6A6] text-xs text-center">
					Already have an account?{" "}
					<Link href="/sign-in" className="text-green-400 hover:text-green-300">
						Sign In
					</Link>
					</p>

				</form>
				<ConnectWith/>
			</div>
							

			<div className= 'relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]'>
				<Image
					src={assets.SignUp_image}
					alt="logo"
					fill={true}
					className='object-cover'
					/>
			</div>

		</div>
	</div>
  )
}
