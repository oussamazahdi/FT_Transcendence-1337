"use client";
import { assets } from "@/assets/data";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConnectWith from "@/components/ConnectWith";
import { AUTH_ERRORS } from "@/lib/utils";
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { SignUpSchema, type SignUpForm } from "@/types/index";

export default function SignUp() {
  const router = useRouter();
  const {register, handleSubmit, formState: { errors, isSubmitting }, setError} = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: SignUpForm) => {
    try {
      const reply = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,{
          method: "POST",
          headers: {"Content-Type": "application/json",},
          credentials:"include",
          body: JSON.stringify({
            firstname: values.firstname,
            lastname: values.lastname,
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        },
      );

      if (!reply.ok) {
        const errorData: { error?: string } = await reply.json();
        const message = (errorData.error && AUTH_ERRORS[errorData.error]) || AUTH_ERRORS["default"];
        setError("root", { message });
        return;
      }
      router.replace(`/sign-up/email-verification?email=${values.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : AUTH_ERRORS["default"];
      setError("root", { message });
    }
  };

  const rootError = errors.root?.message;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-[#1A1A1A]/75 w-full md:w-200 h-140 rounded-xl mx-4 md:mx-0">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-2 md:p-2">
          <form onSubmit={handleSubmit(onSubmit)}
            className="space-y-1 flex flex-col items-center justify-center text-white w-full px-10"
          >
            <h1 className="text-xl md:text-3xl font-bold text-center">
              Create an account
            </h1>
            <p className="text-center text-[#A6A6A6] text-xs/3 md:text-xs mb-2 md:mb-6">
              Enter your personal data to create your account
            </p>
            <div className="flex flex-col md:flex-row gap-1 w-full">
              <div className="w-full">
                <input 
                  maxLength={15}
                  className="w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
                  placeholder="Firstname" {...register("firstname")} />
                {errors.firstname && (<p className="text-red-500 text-[10px] mt-1">{errors.firstname.message}</p>)}
              </div>
              <div className="w-full">
                <input 
                  maxLength={15}
                  className="w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
                  placeholder="Lastname" {...register("lastname")}/>
                  {errors.lastname && (<p className="text-red-500 text-[10px] mt-1">{errors.lastname.message}</p>)}
              </div>
            </div>
            <div className="w-full">
              <input 
                maxLength={15}
                className="w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
                placeholder="Nickname" {...register("username")} />
                {errors.username && (<p className="text-red-500 text-[10px] mt-1">{errors.username.message}</p>)}
            </div>
            <div className="w-full">
              <input
                maxLength={256}
                className="w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
                type="email" placeholder="Email address" {...register("email")} />
                {errors.email && (<p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>)}
            </div>
            <div className="w-full">
              <input 
                maxLength={64}
                className="w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
                type="password" placeholder="Password" {...register("password")} />
                {errors.password && (<p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>)}
            </div>
            <div className="w-full">
              <input
                maxLength={64}
                className="w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none"
                type="password" placeholder="Confirm password" {...register("confirmPassword")} />
                {errors.confirmPassword && (<p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>)}
            </div>

            {rootError && (<p className="text-red-500 text-xs text-center">{rootError}</p>)}

            <button
              type="submit"
              disabled={isSubmitting}
              className=" w-full mt-3 px-4 py-2 bg-[#0F2C34] text-white text-xs rounded hover:bg-[#245664] disabled:bg-gray-500 transition"
            >
              {isSubmitting ? "Creating account..." : "Continue"}
            </button>

            <p className="text-[#A6A6A6] text-xs text-center">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-green-400 hover:text-green-300"
              >
                Sign In
              </Link>
            </p>
          </form>
          <ConnectWith />
        </div>

        <div className="hidden md:block relative overflow-hidden m-2 bg-white rounded-3xl w-100">
          <Image
            src={assets.SignUp_image}
            alt="logo"
            fill={true}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
