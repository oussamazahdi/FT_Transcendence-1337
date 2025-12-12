"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useRouter } from "next/navigation";
import { AUTH_ERRORS } from "@/lib/utils";

const SelecteImage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // const {user, isLoading} = useAuth();
  const router = useRouter();


  //to change after merging qith kamal
  // useEffect(() => {
  //   if (isLoading)
  //     return;
  //   if (!user){//usless after merge 
  //     router.push("/sign-in");
  //     return;
  //   }
  //   if (user.avatar){
  //     router.push("/dashboard");
  //   }
  
  // }, user, isLoading, router)
  const avatarStyle =
    "w-11 h-11 rounded-lg object-cover cursor-pointer transition-all hover:scale-110";

  const avatars = [
    { color: "/gameAvatars/profile1.jpeg", black: "/gameAvatars/blackAvatar/avatar1.png", alt: "profile1",},
    { color: "/gameAvatars/profile2.jpeg", black: "/gameAvatars/blackAvatar/avatar2.png", alt: "profile2", },
    { color: "/gameAvatars/profile3.jpeg", black: "/gameAvatars/blackAvatar/avatar3.png", alt: "profile3", },
    { color: "/gameAvatars/profile4.jpeg", black: "/gameAvatars/blackAvatar/avatar4.png", alt: "profile4", },
    { color: "/gameAvatars/profile5.jpeg", black: "/gameAvatars/blackAvatar/avatar5.png", alt: "profile5", },
    { color: "/gameAvatars/profile6.jpeg", black: "/gameAvatars/blackAvatar/avatar6.png", alt: "profile6", },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setProfileImage(file);
    setSelectedAvatar(null); // Clear avatar selection if custom image is chosen

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleSubmit = async () => {
    if (!profileImage && !selectedAvatar) {
      setError("Please select an image or choose an avatar");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (profileImage) {
        // console.log("request from image")
        // Upload custom image
        const formData = new FormData();
        formData.append("image/", profileImage);
        const reply = await fetch(`http://localhost:3001/api/auth/uploadImage`,{
            method: "POST",
            headers:{
            },
            credentials: "include",
            body: formData,
          },
        );

        const data = await reply.json();

        if (!reply.ok) {
          // const errorMessage = AUTH_ERRORS[data.error] || AUTH_ERRORS["default"];
          const errorMessage = data.error;
          throw new Error (errorMessage);
        }

        // console.log("Upload successful:", data);
      } else if (selectedAvatar) {
        // console.log("request from avatar")
        // Select predefined avatar
        const reply = await fetch(`http://localhost:3001/api/auth/uploadImage`, {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ avatar: selectedAvatar }),
        });

        const data = await reply.json();

        if (!reply.ok) {
          // const errorMessage = AUTH_ERRORS[data.error] || AUTH_ERRORS["default"];
          const errorMessage = data.error;
          throw new Error (errorMessage);
        }

        // console.log("Avatar selection successful:", data);
      }

      // Navigate to dashboard on success
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // if (isLoading) return <div className="text-white text-center mt-20">Loading...</div>;


  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-row justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-4xl">
        <div className="flex flex-col justify-center items-center w-[400px] mx-2 space-y-2">
          <h1 className="text-white text-lg font-bold">
            Select Profile Avatar
          </h1>

          <h2 className="text-[#A6A6A6] text-sm px-6 text-center">
            Import an avatar or choose one of the available avatars
          </h2>

          <div className="relative border rounded-lg w-81 h-30 text-white border-[#A6A6A6] border-dashed p-2 text-xs text-center">
            <div className="flex justify-center items-center">
              <input
                type="file"
                id="profile-image-input"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {imagePreview ? (
                <label
                  htmlFor="profile-image-input"
                  className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                >
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </label>
              ) : (
                <label
                  htmlFor="profile-image-input"
                  className="flex flex-col justify-center items-center w-16 h-16 rounded-lg cursor-pointer hover:bg-white/10 transition"
                >
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
            <h4 className="mt-2 text-[#A6A6A6]">
              Drag and drop your profile picture here
            </h4>
          </div>

          <h2 className="text-[#A6A6A6] text-sm">or choose avatar from here</h2>

          <div className="flex flex-row space-x-2">
            {avatars.map((a) => (
              <img
                key={a.color}
                src={selectedAvatar === a.alt ? a.color : a.black}
                alt={a.alt}
                className={avatarStyle}
                onClick={() => {
                  setSelectedAvatar(a.alt);
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

        <div className="relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]">
          <Image
            src={assets.loginImg}
            alt="logo"
            fill={true}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SelecteImage;