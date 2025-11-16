'use client'
import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/assets/data';
import Input from '../sign-up/components/Input';
import ConnectWith from '@/components/ConnectWith';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try{
      const reply = await fetch("http://localhost:3001/api/auth/login", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
        })
      });
	  const parsedData = await reply.json();
	  localStorage.setItem('token', parsedData.token);

      if(!reply.ok){
        const errorData = await reply.json();
        console.log(errorData);
        throw new Error(errorData.message || "login failed");
      }

      const data = await reply.json();
      console.log("sign in succeful:", data);

      router.push("/Dashboard")

    }catch(err:any){
      setError(err.message || "An error occurred");
			console.error("Login error", err)
    }finally{
      setLoading(false);
    }
    
  }

  return (
	<div className='min-h-screen flex justify-center items-center'>
		<div className='flex flex-row  justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-xl'>
			<div className='flex flex-col items-center justify-center text-white w-[400px] m-2'>
					<h1 className='text-3xl font-bold'>Welcome back</h1>
          <p className='text-center text-[#A6A6A6] text-xs '>Sign in to access to your profile, games,<br/>and chat with your friends </p>

					<form onSubmit={handleSubmit} className="space-y-1 mt-6">

						<div>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="E-mail"
							/>
          	</div>

						<div>
							<Input
								type="password"
								value={password}
								onChange={(e) => setpassword(e.target.value)}
								placeholder="your password"
							/>
          	</div>


						{error && <p className="text-red-500 text-xs text-center">{error}</p>}
				    <button
							type="submit"
							disabled={loading}
							className=" w-full px-4 py-2 bg-teal-950 text-white rounded hover:bg-green-700 disabled:bg-gray-500 transition"
							>
							{loading ? "login ..." : "log in"}
          	</button>

					</form>
					<p className="text-gray-400 text-center text-xs mt-1">
						Don't have an account?{" "}
						<Link href="/sign-up" className="text-green-400 hover:text-green-300">
							Sign up
						</Link>
        </p>
				<ConnectWith/>
			</div>
			<div className= 'relative overflow-hidden m-2 bg-white rounded-xl w-[400px]'>
				<Image
					src={assets.signIn_image}
					alt="logo"
					fill={true}
					className='object-cover'
					/>
			</div>
		</div>
	</div>
  )
}

export default SignIn
