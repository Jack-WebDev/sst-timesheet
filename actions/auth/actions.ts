"use server";

import { SessionProp, defaultSession, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserProps } from "../../types/userProps";

export const getSession = async () => {
  const session = await getIronSession<SessionProp>(cookies(), sessionOptions);

  if (!session.success) {
    session.Name = defaultSession.Name;
  }

  return session;
};

export const login = async (userData: UserProps) => {
  const session = await getSession();
  const fullName = `${userData.Name} ${userData.Surname}`;

  session.Name = fullName;
  session.success = true;
  session.NDTEmail = userData.NDTEmail;
  session.id = userData.id

  if (userData.Role === "Admin") {
    await session.save();
    redirect("/users/admin");
  } else if (userData.Role === "Manager") {
    await session.save();
    redirect("/users/manager");
  } else if (userData.Role === "Executive") {
    await session.save();
    redirect("/users/exec");
  } else {
    session.isAdmin = false;
    await session.save();
    redirect("/users/employee");
  }
};

export const logOut = async () => {
  const session = await getSession();
  cookies().delete("jwtToken");

  session.destroy();

  redirect("/");
};
