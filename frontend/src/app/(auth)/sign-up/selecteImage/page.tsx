'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/data'
import { useRouter } from 'next/navigation'

const SelecteImage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const avatarStyle = "w-11 h-11 rounded-lg object-cover cursor-pointer transition-all hover:scale-110";

  const avatars = [
    { color: "/gameAvatars/profile1.jpeg", black: "/gameAvatars/blackAvatar/avatar1.png", alt: "avatar 1" },
    { color: "/gameAvatars/profile2.jpeg", black: "/gameAvatars/blackAvatar/avatar2.png", alt: "avatar 2" },
    { color: "/gameAvatars/profile3.jpeg", black: "/gameAvatars/blackAvatar/avatar3.png", alt: "avatar 3" },
    { color: "/gameAvatars/profile4.jpeg", black: "/gameAvatars/blackAvatar/avatar4.png", alt: "avatar 4" },
    { color: "/gameAvatars/profile5.jpeg", black: "/gameAvatars/blackAvatar/avatar5.png", alt: "avatar 5" },
    { color: "/gameAvatars/profile6.jpeg", black: "/gameAvatars/blackAvatar/avatar6.png", alt: "avatar 6" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Choose a file first");
      return;
    }
    
    if(!file.type.startsWith('image/')){
      setError("Please select a valid image");
      return;
    }
  
    if(file.size > 5 * 1024 * 1024){
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setProfileImage(file);
    setSelectedAvatar(null); // Clear avatar selection if custom image is chosen

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  }

  const handleSubmit = async () => {
    if (!profileImage && !selectedAvatar) {
      setError("Please select an image or choose an avatar");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (profileImage) {
        // Upload custom image
        const formData = new FormData();
        formData.append("file", profileImage); // Changed from "image/" to "file"
        
        const reply = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await reply.json();
        
        if (!reply.ok) {
          throw new Error(data.error || `Upload failed (${reply.status})`);
        }

        console.log("Upload successful:", data);
        
      } else if (selectedAvatar) {
        // Select predefined avatar
        const reply = await fetch("http://localhost:5000/select-avatar", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatarUrl: selectedAvatar }), 
        });

        const data = await reply.json();
        
        if (!reply.ok) {
          throw new Error(data.error || `Avatar selection failed (${reply.status})`);
        }

        console.log("Avatar selection successful:", data);
      }

      // Navigate to dashboard on success
      router.replace("/dashboard");

    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='flex flex-row justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-4xl'>

        <div className='flex flex-col justify-center items-center w-[400px] mx-2 space-y-2'>
          <h1 className='text-white text-lg font-bold'>Select Profile Avatar</h1>

          <h2 className='text-[#A6A6A6] text-sm px-6 text-center'>
            Import an avatar or choose one of the available avatars
          </h2>

          <div className='relative border rounded-lg w-81 h-30 text-white border-[#A6A6A6] border-dashed p-2 text-xs text-center'>
            <div className="flex justify-center items-center">
              <input
                type="file"
                id="profile-image-input"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {imagePreview ? (
                <label htmlFor="profile-image-input" className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </label>
              ) : (
                <label htmlFor="profile-image-input" className="flex flex-col justify-center items-center w-16 h-16 rounded-lg cursor-pointer hover:bg-white/10 transition">
                  <Image
                    src={assets.upload}
                    alt="Upload icon"
                    width={48}
                    height={48}
                    className="mb-2 invert"
                  />
                  <span className="text-xs text-gray-400">Upload</span>
                </label>
              )}
            </div>
            <h4 className='mt-2 text-[#A6A6A6]'>Drag and drop your profile picture here</h4>
          </div>

          <h2 className='text-[#A6A6A6] text-sm'>or choose avatar from here</h2>

          <div className='flex flex-row space-x-2'>
            {avatars.map((a) => (
              <img
                key={a.color}
                src={selectedAvatar === a.color ? a.color : a.black}
                alt={a.alt}
                className={avatarStyle}
                onClick={() => {
                  setSelectedAvatar(a.color);
                  setImagePreview(a.color);
                  setProfileImage(null); // Clear custom image if avatar is chosen
                }}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="w-81 mt-3 px-4 py-2 bg-teal-950 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-500 transition"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>

        </div>

        <div className='relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]'>
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

export default SelecteImage


// 'use client'
// import React, { ReactEventHandler, useState } from 'react'
// import Image from 'next/image'
// import { assets } from '@/assets/data'
// import { useRouter } from 'next/navigation'

// const SelecteImage = () => {
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const avatarStyle = "w-11 h-11 rounded-lg object-cover cursor-pointer transition-all hover:scale-110";


//   const avatars = [
//     { color: "/gameAvatars/profile1.jpeg", black: "/gameAvatars/blackAvatar/avatar1.png", alt: "avatar 1" },
//     { color: "/gameAvatars/profile2.jpeg", black: "/gameAvatars/blackAvatar/avatar2.png", alt: "avatar 2" },
//     { color: "/gameAvatars/profile3.jpeg", black: "/gameAvatars/blackAvatar/avatar3.png", alt: "avatar 3" },
//     { color: "/gameAvatars/profile4.jpeg", black: "/gameAvatars/blackAvatar/avatar4.png", alt: "avatar 4" },
//     { color: "/gameAvatars/profile5.jpeg", black: "/gameAvatars/blackAvatar/avatar5.png", alt: "avatar 5" },
//     { color: "/gameAvatars/profile6.jpeg", black: "/gameAvatars/blackAvatar/avatar6.png", alt: "avatar 6" },
//   ];

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file)
//       return alert("Choose a file first");
//     if(!file.type.startsWith('image/')){
//       setError("Please selecte a valid image");
//       return ;
//     }
  
//     if(file.size > 5 * 1024 * 1024){
//       setError("Image size must be less than 5MB")
//       return
//     }

//     setError(null);
//     setProfileImage(file);

//     const preview = URL.createObjectURL(file);
//     setImagePreview(preview);
//   }

//   //Lfunction Lmli7a
//   const handleSubmit = async () => {
//     if (!profileImage && !selectedAvatar) {
//       setError("No image selected");
//       return;
//     }

//     setError(null);
//     setLoading(true);
//     let success = false

//     try{
//       if (profileImage){
//         const formData = new FormData();
//         formData.append("image/", profileImage);
//         const reply = await fetch("http://localhost:5000/upload", {
//           method: "POST",
//           body: formData,
//         })

//         const data = await reply.json();
//         if (!reply.ok) {
//           throw new Error(data.error || `Upload failed (${reply.status})`);
//         }

//         success = true;

//       }else{
//         const reply = await fetch("http://localhost:5000/select-avatar", {
//           method: "POST",
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ avatarUrl: selectedAvatar }), 
//         })

//         const data = await reply.json();
//         if (!reply.ok) {
//           throw new Error(data.error || `Avatar selection failed (${reply.status})`);
//         }

//         success = true;

//       }

//     router.replace("/dashboard")

//     }catch(err){
//       console.error("Upload error:", err);
//       setError("Failed to upload image");
//     }finally {
//     setLoading(false);
//   }
//   }

//   return (
//     <div className='min-h-screen flex justify-center items-center'>
// 		  <div className='flex flex-row  justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-4xl'>

//       <div className='flex flex-col justify-center items-center w-[400px] mx-2 space-y-2'>
//         <h1 className='text-white text-lg font-bold'>Selecte Profile Avatar</h1>

//         <h2 className='text-[#A6A6A6] text-sm px-6 text-center'>import a avatar or choise one of the available avatars</h2>

//         <div className='relative border rounded-lg w-81 h-30 text-white border-[#A6A6A6] border-dashed p-2 text-xs text-center'>
//             <div className="flex justify-center items-center">
//               <input
//                 type="file"
//                 id="profile-image-input"
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 className="hidden"
//               />
//               {imagePreview ? (
//               <label htmlFor="profile-image-input" className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer">
//                   <Image
//                     src={imagePreview}
//                     alt="Profile preview"
//                     fill
//                     className="object-cover"
//                   />
//                 </label>
//               ) : (
//                 <label htmlFor="profile-image-input" className="flex flex-col justify-center items-center w-16 h-16 rounded-lg cursor-pointer hover:bg-white/10 transition">
//                   <Image
//                     src={assets.upload}
//                     alt="Upload icon"
//                     width={48}
//                     height={48}
//                     className="mb-2 invert"
//                   />
//                   <span className="text-xs text-gray-400">Upload</span>
//                 </label>
//               )}
//             </div>
//           <h4 className='mt-2 text-[#A6A6A6]'>drage and drop your profile picture here</h4>
//         </div>


//         <h2 className='text-[#A6A6A6] text-sm '>or choise avatar from here</h2>

//         <div className='flex flex-row space-x-2'>
//           {avatars.map((a) => (
//             <img
//               key={a.color}
//               src={selectedAvatar === a.color ? a.color : a.black}
//               alt={a.alt}
//               className={avatarStyle}
//               onClick={() => {
//                 setSelectedAvatar(a.color);
//                 setImagePreview(a.color);
//               }}
//             />
//           ))}
//         </div>

//         {error && <p className="text-red-500 text-xs text-center">{error}</p>}
//         <button
//           type="submit"
//           disabled={loading}
//           onClick={handleSubmit}
//           className=" w-81 mt-3 px-4 py-2 bg-teal-950 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-500 transition"
//           >
//           {loading ? "Creating account..." : "Continue"}
//         </button>

//       </div>

//       <div className= 'relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]'>
//         <Image
//           src={assets.loginImg}
//           alt="logo"
//           fill={true}
//           className='object-cover'
//           />
//       </div>
        
//       </div>
//     </div>
//   )
// }

// export default SelecteImage

// ---------------------------------------------------------------------------------------------------------------

{/* <div className="flex flex-col items-center">
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
						</div> */}







