"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import { assets } from "@/assets/data";
import { AUTH_ERRORS, USER_ERROR } from "@/lib/utils.ts";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { autofetch } from "@/lib/api.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ProfileSchema = z.object({
  firstname: z
    .string()
    .min(3, "Firstname must be at least 3 characters")
    .max(15, "Firstname must be at most 15 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Lastname contains invalid characters"),

  lastname: z
    .string()
    .min(3, "Lastname must be at least 3 characters")
    .max(15, "Lastname must be at most 15 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Lastname contains invalid characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be at most 15 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can contain only letters, numbers, _ or -"),

  email: z.string().email("Email address is invalid"),

  avatar: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});


type ProfileFormData = z.infer<typeof ProfileSchema>;

export default function Personal_information() {
  const { user, login } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [Rooterror, setRootError] = useState<string | null>(null);

  const {register, handleSubmit, setValue, reset, formState: { errors, isDirty }, setError} = useForm<ProfileFormData>({
  resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      avatar: null,
    },
    mode: "onSubmit",
  });


  useEffect(() => {
    if (!user) 
      return;
    reset({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || null,
    });

    setImagePreview(user.avatar && user.avatar !== "null" ? user.avatar : null);
  }, [user, reset]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setRootError(null)
    const file = e.target.files?.[0];
    if (!file) 
      return;

    if (!file.type.startsWith("image/")) {
      setRootError("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setRootError("Image size must be less than 5MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setValue("avatar", file, { shouldDirty: true, shouldValidate: true });
  }

  const onSubmit = async(values: ProfileFormData) => {
    setRootError(null);

    const userData = new FormData();
    userData.append("firstname", values.firstname);
    userData.append("lastname", values.lastname);
    userData.append("username", values.username);
    userData.append("email", values.email);

    if (values.avatar instanceof File) {
      userData.append("avatar", values.avatar);
    }

    try {
      const response = await autofetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}`,
        {
          method: "PUT",
          credentials: "include",
          body: userData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "INVALID_INPUT")
          throw new Error(`invalid ${data.fields}`);
        throw new Error(AUTH_ERRORS[data.error] || AUTH_ERRORS["default"]);
      }

      const newUser = data.user;
      login({ ...user, ...newUser });
    } catch (err:any) {
      setRootError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
            <div className="flex justify-center items-center gap-2 w-34 h-6 md:w-36 md:h-10 bg-[#414141]/60 hover:bg-[#414141] transition rounded-sm text-xs/3 md:text-xs cursor-pointer text-white">
              <ArrowUpTrayIcon className="w-4 h-4" />
              Upload image
            </div>
          </label>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-1 w-full">
          <div>
            <p className="text-[10px] text-gray-500">Firstname</p>
            <input
              maxLength={15}
              type="text"
              {...register("firstname")}
              className="w-full md:w-52 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
            />
            {errors.firstname && (<p className="text-red-500 text-[10px] mt-1">{errors.firstname.message}</p>)}
          </div>
          <div>
            <p className="text-[10px] text-gray-500">Lastname</p>
            <input
              maxLength={15}
              type="text"
              {...register("lastname")}
              className="w-full md:w-52 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
            />
            {errors.lastname && (<p className="text-red-500 text-[10px] mt-1">{errors.lastname.message}</p>)}
          </div>
        </div>

        <div className="w-full flex flex-col justify-center md:items-center">
          <div>
            <p className="text-[10px] text-gray-500">Username</p>
            <input
              maxLength={15}
              type="text"
              {...register("username")}
              className="w-full md:w-105 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
            />
            {errors.username && (<p className="text-red-500 text-[10px] mt-1">{errors.username.message}</p>)}
          </div>
          <div>
            <p className="text-[10px] text-gray-500">Email</p>
            <input
              maxLength={254}
              type="text"
              {...register("email")}
              className="w-full md:w-105 p-2 h-12 rounded-xl bg-[#4D4D4D]/40 text-white text-sm placeholder-[#FFFFFF]/23 focus:outline-none"
            />
          </div>
          {errors.email && (<p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>)}
        </div>

        {Rooterror && (<p className="text-red-600 text-xs text-center px-3 py-1 bg-red-300/20 border mt-2 rounded">{Rooterror}</p>)}

        <button
          disabled={!isDirty}
          type="submit"
          className={`w-60 h-8 text-xs rounded-sm mt-4 transition-all duration-200
            ${
              !isDirty
                ? "bg-[#414141]/60 text-white-600 cursor-not-allowed opacity-50"
                : "bg-[#070707] border-[#414141]/60 border hover:bg-[#0F2C34]/40 text-white hover:text-white cursor-pointer"
            }
          `}
        >
          save changes
        </button>
      </div>
    </form>
  );
}