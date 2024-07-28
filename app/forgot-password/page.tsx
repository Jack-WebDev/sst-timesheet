"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .email({ message: "Please add a valid email" })
    .refine((email) => email.endsWith("@ndt.co.za"), {
      message: "Email must be a valid NDT email",
    }),
});

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await axios.post("/api/forgot-password", values);

      if (res.status === 200) {
        toast.success("Your OTP has been sent to your email.");
        setLoading(false);
        router.push("/forgot-password/otp");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-x-12 bg-white  w-[70%] rounded-xl p-8"
        >
          <Image src={"/7070628_3275432.svg"} alt="" width={400} height={400} />
          <div className="flex flex-col justify-center items-start gap-y-4">
            <>
              <h1 className="text-5xl font-semibold text-secondary">
                Forgot Password?
              </h1>
              <p className="text-md text-gray-500">
                Enter your NDT email address and we&apos;ll send you an OTP to
                reset your password.
              </p>
            </>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="rounded-xl hover:border-primary placeholder:text-gray-500 w-full"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            <Button type="submit" className="login_btn w-full hover:bg-primary">
              Send Reset Password Email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
