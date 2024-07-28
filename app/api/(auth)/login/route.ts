import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

import { comparePassword } from "@/lib/auth";
import { isValidEmailDomain } from "@/lib/validateEmail";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { email, password } = await data;

    try {
      if (email.length < 1) {
        return NextResponse.json(
          {
            message: "Please enter a valid email!",
          },
          { status: 401 }
        );
      }

      if (!isValidEmailDomain(email, "ndt.co.za")) {
        return NextResponse.json(
          {
            message: "Invalid NDT email! Please try again",
          },
          { status: 401 }
        );
      }

      const user = await db.user.findFirst({
        where: {
          NDTEmail: email,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            message: "Email not found!",
          },
          { status: 500 }
        );
      }

      const isPasswordValid = await comparePassword(password, user?.Password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid Password" },
          { status: 401 }
        );
      }

      const token = signJwt({ id: user?.id, role: user?.Role }, "JWT_KEY!", 10);

      cookies().set("jwtToken", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
      });

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
