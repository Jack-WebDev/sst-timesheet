"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/Login";
import { RegisterForm } from "@/components/auth/Register";
import Image from "next/image";
import { useThemeStore } from "./store";

const Home = () => {
	const {isDarkMode} = useThemeStore()
	return (
		<>
			<div className={`userAuth h-screen flex items-center justify-around ${isDarkMode ? "bg-white" : "bg-white"}`}>
				<div className="left__column text-center">
					<Image
						src={"/6974855_4380.jpg"}
						alt=""
						width={500}
						height={500}
						className="form_img"
						style={{ width: "100%", height: "auto" }}
					/>
				</div>
				<Image
					src={"/ndt-technologies-web-logo.svg"}
					alt=""
					width={100}
					height={100}
					className="logo"
				/>

				<div>
					<div className="intro grid justify-items-center relative bottom-12">
						<h1 className="text-[2rem] mt-8 text-secondary font-semibold">
							New Dawn <span className="text-primary">360</span>
						</h1>
						<p className="text-secondary font-medium">
							Your Time, Our Commitment, Streamlined Together.
						</p>
					</div>
					<Tabs defaultValue="login" className="form__container w-[400px]">
						<TabsList className="tabs__header">
							<TabsTrigger value="login" className="login_tab">
								Login
							</TabsTrigger>
							<TabsTrigger value="register" className="register_tab">
								Register
							</TabsTrigger>
						</TabsList>

						<TabsContent value="login">
							<LoginForm />
						</TabsContent>
						<TabsContent value="register">
							<RegisterForm />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default Home;
