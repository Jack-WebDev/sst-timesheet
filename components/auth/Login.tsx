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
import { login } from "@/actions/auth/actions";
import { toast } from "react-toastify";
import { useUser } from "@/app/store";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .email({ message: "Please add a valid email" })
    .refine((email) => email.endsWith("@ndt.co.za"), {
      message: "Email must be a valid NDT email",
    }),
  password: z.string(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post("api/login", values);
      const userData = await res.data;
      useUser.setState(userData);
      await login(userData);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="rounded-xl hover:border-primary"
                  type="email"
                />
              </FormControl>
              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  className="rounded-xl hover:border-primary"
                  type="password"
                />
              </FormControl>
              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />
        <Link href={"/forgot-password"} className="relative top-[5px] left-[9.5rem] text-primary font-semibold text-sm">Forgot Password?</Link>
        <Button type="submit" className="login_btn w-full hover:bg-primary">
          Let Me In
        </Button>
      </form>
    </Form>
  );
}
