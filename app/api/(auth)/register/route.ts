import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";
import { hashPassword } from "@/lib/auth";
import { isValidEmailDomain } from "@/lib/validateEmail";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

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

      if (user.Password && user.Password.length > 0) {
        return NextResponse.json(
          {
            message: "User already exists!",
          },
          { status: 400 }
        );
      }


      const hashedPassword = await hashPassword(password, 10);

      const validUser = await db.user.update({
        where: {
          NDTEmail: email,
        },
        data: {
          Password: hashedPassword,
        },
      });

      const token = signJwt(
        { id: validUser?.id, role: validUser?.Role },
        "JWT_KEY!",
        10
      );

      cookies().set("jwtToken", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
      });

      return NextResponse.json(validUser, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
