"use client";
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { AUTH_ERRORS } from "@/lib/utils";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const SelectImage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const router = useRouter();
  let data;

  const avatarStyle =
    "w-11 h-11 rounded-lg object-cover cursor-pointer transition-all hover:scale-110";

  const avatars = [
    {
      color: "/gameAvatars/profile1.jpeg",
      black: "/gameAvatars/blackAvatar/avatar1.png",
      alt: "profile1",
    },
    {
      color: "/gameAvatars/profile2.jpeg",
      black: "/gameAvatars/blackAvatar/avatar2.png",
      alt: "profile2",
    },
    {
      color: "/gameAvatars/profile3.jpeg",
      black: "/gameAvatars/blackAvatar/avatar3.png",
      alt: "profile3",
    },
    {
      color: "/gameAvatars/profile4.jpeg",
      black: "/gameAvatars/blackAvatar/avatar4.png",
      alt: "profile4",
    },
    {
      color: "/gameAvatars/profile5.jpeg",
      black: "/gameAvatars/blackAvatar/avatar5.png",
      alt: "profile5",
    },
    {
      color: "/gameAvatars/profile6.jpeg",
      black: "/gameAvatars/blackAvatar/avatar6.png",
      alt: "profile6",
    },
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
    setSelectedAvatar(null);

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
        console.log("request from image");
        const formData = new FormData();
        formData.append("image/", profileImage);
        const reply = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/uploadImage`,
          {
            method: "POST",
            headers: {},
            credentials: "include",
            body: formData,
          },
        );

        data = await reply.json();

        if (!reply.ok) {
          const errorMessage =
            AUTH_ERRORS[data.error] || AUTH_ERRORS["default"];
          throw new Error(errorMessage);
        }

        console.log("Upload successful:", data);
      } else if (selectedAvatar) {
        console.log("request from avatar");
        const reply = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/uploadImage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ avatar: selectedAvatar }),
          },
        );

        data = await reply.json();

        if (!reply.ok) {
          const errorMessage =
            AUTH_ERRORS[data.error] || AUTH_ERRORS["default"];
          throw new Error(errorMessage);
        }

        console.log("Avatar selection successful:", data);
      }
      login(data.userData);
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-[#1A1A1A]/75 w-full md:w-[800px] h-[480px] rounded-xl mx-4 md:mx-0">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-2">
          <h1 className="text-white text-lg font-bold px-2">
            Select Profile Avatar
          </h1>

          <h2 className="text-[#A6A6A6] text-sm max-w-81 px-2 text-left md:text-center">
            Import an avatar or choose one of the available avatars
          </h2>

          <div className="relative border rounded-lg w-full max-w-81 h-30 text-white border-[#A6A6A6] border-dashed p-2 text-xs text-center line-clamp-2">
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
                  <CloudArrowUpIcon className="size-16 text-[#A5A5A5]" />
                </label>
              )}
            </div>
            <h4 className="mt-2 text-[#A6A6A6]">
              Click here to upload your profile or <br />
              Drag and drop it here
            </h4>
          </div>

          <h2 className="text-[#A6A6A6] text-sm mb-2">
            or choose avatar from here
          </h2>

          <div className="flex flex-row space-x-2 overflow-y-scroll p-1">
            {avatars.map((a) => (
              <img
                key={a.color}
                src={selectedAvatar === a.alt ? a.color : a.black}
                alt={a.alt}
                className={avatarStyle}
                onClick={() => {
                  setSelectedAvatar(a.alt);
                  setImagePreview(a.color);
                  setProfileImage(null);
                }}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className=" w-full mt-3 max-w-81 px-4 py-2 bg-[#0F2C34] text-white text-xs rounded hover:bg-[#245664] disabled:bg-gray-500 transition"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
          <div onClick={() => logout()} className="items-center text-gray-500 text-sm mt-2 hover:underline cursor-pointer">Return to landing page</div>

        </div>

        <div className="hidden md:block relative overflow-hidden m-2 bg-white rounded-3xl w-100">
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

export default SelectImage;