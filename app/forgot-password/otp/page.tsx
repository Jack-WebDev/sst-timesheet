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
import Loading from "../loading";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  otp: z
    .string()
    .min(6, {
      message: "Invalid OTP length.",
    })
    .max(6, {
      message: "Invalid OTP length.",
    }),
});

export default function ValidateOTPForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await axios.post("/api/forgot-password/otp", values);

      if (res.status === 200) {
        setLoading(false);
        router.push("/");
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
    <>
      {loading && <Loading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center gap-x-12 bg-white rounded-xl p-8"
        >
          <Image
            src={"/13246824_5191077.svg"}
            alt=""
            width={400}
            height={400}
          />
          <div className="flex flex-col justify-center items-start gap-y-4">
            <h1 className="text-3xl font-semibold text-secondary">
              OTP Verification
            </h1>
            <p className="text-md text-gray-500">
              Enter the OTP code we sent to your email address.
            </p>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>OPT Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your OPT Code"
                      {...field}
                      className="rounded-xl hover:border-primary placeholder:text-gray-500"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            <Button type="submit" className="login_btn w-full hover:bg-primary">
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
