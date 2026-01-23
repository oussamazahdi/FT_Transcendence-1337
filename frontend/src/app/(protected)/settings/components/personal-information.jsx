"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import { assets } from "@/assets/data";
import { USER_ERROR } from "@/lib/utils";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Personal_information() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar === "null" ? null : user.avatar,
      });
      setImagePreview(user.avatar === "null" ? null : user.avatar);
    }
  }, [user]);

  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.avatar);
  const isChanged =
    formData.firstname !== (user?.firstname || "") ||
    formData.lastname !== (user?.lastname || "") ||
    formData.username !== (user?.username || "") ||
    formData.email !== (user?.email || "") ||
    formData.avatar !== user?.avatar;

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) 
      return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setFormData((prev) => ({ ...prev, avatar: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const userData = new FormData();

    userData.append("firstname", formData.firstname);
    userData.append("lastname", formData.lastname);
    userData.append("username", formData.username);
    userData.append("email", formData.email);
    if (formData.avatar instanceof File) {
      userData.append("avatar", formData.avatar);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          credentials: "include",
          body: userData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "INVALID_INPUT")
          throw new Error(`invalid ${data.fields}`);
        throw new Error(USER_ERROR[data.error] || USER_ERROR["default"]);
      }

      const newUser = data.user;
      login({ ...user, ...newUser });
      console.log("user update successfully :)");
    } catch (err) {
      console.log("failed to updare user :( ", err.message);
      setError(err.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col justify-start mt-4 md:mt-0 items-center px-4 overflow-y-auto"
    >
    <div className="flex flex-col items-center w-full py-8 md:py-0 my-auto">
      <h1 className="text-white font-bold text-sm md:text-xl">
        personal information
      </h1>
      <h3 className="text-[#ABABAB] text-xs md:text-sm text-center">
        Keep your player profile accurate for a better gaming experience.
      </h3>
        <div className="relative w-20 h-20 md:w-32 md:h-32 flex justify-center items-center overflow-hidden mt-2">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="avatar"
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <Image
              src={assets.defaultProfile}
              alt="default"
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />
          )}
        </div>
        <div className="flex md:flex-row flex-col gap-2 my-4">
          <input
            type="file"
            id="profile-image-input"
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
          <label htmlFor="profile-image-input">
            <div className="flex justify-center items-center gap-2 w-34 h-6 md:w-36 md:h-10 bg-[#414141]/60 rounded-sm text-xs/3 md:text-xs cursor-pointer">
              <ArrowUpTrayIcon className="w-4 h-4" />
              Upload image
            </div>
          </label>
          <button
            type="button"
            onClick={() => {
              setImagePreview(null);
              setFormData((prev) => ({ ...prev, avatar: null }));
            }}
            className="flex justify-center gap-2 items-center w-34 h-6  md:w-36 md:h-10 bg-[#414141]/60 rounded-sm text-xs/3 md:text-xs cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
            Remove image
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-1 w-full">
          <div>
            <p className="text-[10px] text-gray-500">Firstname</p>
            <input
              required
              type="text"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstname: e.target.value }))
              }
              className="w-full md:w-52 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
              value={formData.firstname}
              />
          </div>
          <div>
            <p className="text-[10px] text-gray-500">Lastname</p>
            <input
              required
              type="text"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastname: e.target.value }))
              }
              className="w-full md:w-52 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
              value={formData.lastname}
            />
          </div>
        </div>
        <div className="w-full flex flex-col justify-center md:items-center">
          <div>
            <p className="text-[10px] text-gray-500">Username</p>
            <input
              required
              type="text"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full md:w-105 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
              value={formData.username}
            />
          </div>
          <div>
            <p className="text-[10px] text-gray-500">Email</p>
            <input
              required
              type="text"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full md:w-105 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
              value={formData.email}
            />
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-xs text-center px-3 py-1 bg-red-300/20 border-1">
            {error}
          </p>
        )}
        <button
          disabled={!isChanged}
          type="submit"
          className={`w-60 h-8 text-xs rounded-sm mt-4 transition-all duration-200
            ${
              !isChanged
                ? "bg-[#414141]/60 text-white-600 cursor-not-allowed opacity-50"
                : "bg-[#070707] border-[#414141]/60 border-1 hover:bg-[#0F2C34]/40 text-white hover:text-white cursor-pointer"
            }
          `}
        >
          save change
        </button>
      </div>
    </form>
  );
}
