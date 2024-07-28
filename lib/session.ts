import { SessionOptions } from "iron-session";

export type SessionProp = {
	id: string;
	Department?: string;
	NDTEmail?: string;
	Name?: string;
	Password?: string;
	Role?: string;
	Status?: string;
	Surname?: string;
	success: boolean;
	isAdmin: boolean;
};

export const defaultSession: SessionProp = {
	Name: "",
	success: false,
	isAdmin: true,
	NDTEmail: "",
	id: ""
};

export const sessionOptions: SessionOptions = {
	password: process.env.SESSION_KEY!,
	cookieName: "ndt-user_session",
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	},
};
