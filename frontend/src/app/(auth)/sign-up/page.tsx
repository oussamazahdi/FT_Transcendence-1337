'use client'
import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import Link from 'next/link'



export default function SignUp(){

	const [username, setUsername] = useState("");
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
  	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file){
			if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
			}
			if(file.size > 5 * 1024 * 1024 ){
				setError("Image size must be less than 5MB");
        return;
			}

			
			const reader = new FileReader();
      reader.onloadend = () => {
				const base64String = reader.result as string

				setProfileImage(base64String);

        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    	}
	}
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
					email,
          password,
          username,
					profileImage: profileImage || null,
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
		<div className='flex flex-row  justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-xl'>
			<div className='flex flex-col items-center justify-center text-white w-[400px] m-2'>
					<h1 className='text-3xl font-bold'>Sign up</h1>
					<form onSubmit={handleSubmit} className="space-y-4 my-3">

						<div className="flex flex-col items-center">
            		<label className="block text-white text-center">Profile Picture</label>
							<div className="flex flex-row justify-center">
							{imagePreview ? (
								<div className=" overflow-hidden w-10 h-10 rounded-full bg-gray-700 border-4 border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition">
									<Image
                    src={imagePreview}
										alt="Upload icon"
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                  />
                </div>
								) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 border-4 border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition">
                  <Image
                    src={assets.arrow}
                    alt="Upload icon"
                    width={48}
                    height={48}
                    className="invert"
                  />
                </div>
								)}

								<div className='m-2'>
									<label className="w-32 h-8 px-4 py-2 text-center rounded bg-gray-700 text-white text-xs placeholder-gray-400 focus:outline-none">
										Choose Image
										<input
											type="file"
											onChange={handleImageChange}
											accept="image/*"
											className="hidden"
											/>
									</label>
									</div>
          	</div>
							<p className="text-xs text-gray-400">Max size: 5MB</p>
						</div>


						<div>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="your username"
								required
								className=" w-60 h-8 px-4 py-2 rounded bg-gray-700 text-white text-xs placeholder-gray-400 focus:outline-none"
							/>
          	</div>

						<div>
							<input
								type="text"//to change it later to email type
								value={email}
								onChange={(e) => setemail(e.target.value)}
								placeholder="you@email.com"
								required
								className=" w-60 h-8 text-xs px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
							/>
          	</div>

						<div>
							<input
								type="password"
								value={password}
								onChange={(e) => setpassword(e.target.value)}
								placeholder="••••••••"
								required
								className=" h-8 text-xs w-60 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
							/>
          	</div>

						<div>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="confirm your password"
								required
								className=" h-8 text-xs w-60 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
							/>
          	</div>

						{error && <p className="text-red-500 text-xs text-center">{error}</p>}
				    <button
							type="submit"
							disabled={loading}
							className=" w-full px-4 py-2 bg-teal-950 text-white rounded hover:bg-green-700 disabled:bg-gray-500 transition"
							>
							{loading ? "Creating account..." : "Sign Up"}
          	</button>

					</form>
					<p className="text-gray-400 text-center mt-4">
						Already have an account?{" "}
						<Link href="/sign-in" className="text-green-400 hover:text-green-300">
							Sign In
						</Link>
        </p>
			</div>
			<div className= 'relative overflow-hidden m-2 bg-white rounded-xl w-[400px]'>
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
