import db from "@/database";
import { isOtpExpired } from "@/utils/otpGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const { otp } = await data;

  try {
    const otpCode = await db.oTP.findFirst({
      where: {
        code: otp,
      },
    });

    if (!otpCode) {
      return NextResponse.json(
        {
          message: "Invalid OTP!",
        },
        { status: 401 }
      );
    }

    const isOtpExpiry = isOtpExpired(otpCode?.expiryDate);
    if (isOtpExpiry) {
      await db.oTP.delete({
        where: {
          id: otpCode.id,
        },
      });

      return NextResponse.json(
        {
          message: "OTP has expired!",
        },
        { status: 401 }
      );
    }

    if (otpCode.code === otp) {
      const user = await db.user.findFirst({
        where: {
          id: otpCode.userId,
        },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found!" },
          { status: 404 }
        );
      }

      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          Password: "",
        },
      });

      await db.oTP.delete({
        where: {
          id: otpCode.id,
        },
      });

      return NextResponse.json(
        {
          message: "Password has been reset!",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Unexpected error occurred!" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
