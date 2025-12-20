"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import { assets } from "@/assets/data";

//check if data empty
export default function Personal_information() {
  const { user, login } = useAuth();
  // console.log("this is the user",user)
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  });
  // console.log(formData);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.avatar);
  const isChanged =
    formData.firstname !== (user.firstname || "") ||
    formData.lastname !== (user.lastname || "") ||
    formData.username !== (user.username || "") ||
    formData.email !== (user.email || "") ||
    formData.avatar !== user.avatar;

  function handleUpload(e) {
    const file = e.target.files?.[0];
    // console.log("====>", file)
    if (!file) return;

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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "content-Type": "application/json",
          },
          credentials: "include",
          //can't send data like must create an new FormData type and append to it all the data from my formData
          body: JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            username: formData.username,
            email: formData.email,
            avatar: formData.avatar,
          }),
        },
      );

      if (!response.ok) throw new Error("failde to update information");

      login({ ...user, formData });
      console.log("user update successfully :)");
    } catch (err) {
      console.log("failed to updare user :( ", err.message);
      setError(err.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col justify-center items-center gap-1"
    >
      <h1 className="text-white font-bold text-xsm">personal information</h1>
      <h3 className="text-[#ABABAB] text-sm">
        Keep your player profile accurate for a better gaming experience.
      </h3>
      <div className="w-32 h-32 flex justify-center items-center">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-lg cursor-pointer"
          />
        ) : (
          <Image
            src={assets.defaultProfile}
            alt="default"
            width={120}
            height={120}
            className="rounded-lg cursor-pointer"
          />
        )}
      </div>
      <div className="flex gap-2 my-4">
        <input
          type="file"
          id="profile-image-input"
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
        <label htmlFor="profile-image-input">
          <div className="flex justify-center items-center gap-2 w-36 h-10 bg-[#414141]/60 rounded-sm text-xs cursor-pointer">
            <img src={assets.uploadSettings.src} width={12} />
            Upload image
          </div>
        </label>
        <button
          type="button"
          onClick={() => {
            setImagePreview(null);
            setFormData((prev) => ({ ...prev, avatar: null }));
          }}
          className="flex justify-center items-center gap-2 w-36 h-10 bg-[#414141]/60 rounded-sm text-xs cursor-pointer"
        >
          <img src={assets.trash.src} width={12} />
          Remove image
        </button>
      </div>
      <div className="flex gap-1">
        <input
          required
          type="text"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstname: e.target.value }))
          }
          className="bg-[#414141]/60 rounded-sm p-2 text-sm w-52 focus:outline-none"
          defaultValue={formData.firstname}
        />
        <input
          required
          type="text"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastname: e.target.value }))
          }
          className="bg-[#414141]/60 rounded-sm p-2 text-sm w-52 focus:outline-none"
          defaultValue={formData.lastname}
        />
      </div>
      <input
        required
        type="text"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, username: e.target.value }))
        }
        className="bg-[#414141]/60 rounded-sm p-2 text-sm w-105 focus:outline-none"
        defaultValue={formData.username}
      />
      <input
        required
        type="text"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        className="bg-[#414141]/60 rounded-sm p-2 text-sm w-105 focus:outline-none"
        defaultValue={formData.email}
      />
      {error && <p className="text-xsm text-red-700">{error}</p>}
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
    </form>
  );
}
