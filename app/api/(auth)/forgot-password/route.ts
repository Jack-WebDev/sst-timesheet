import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";
import nodemailer from "nodemailer";
import { isValidEmailDomain } from "@/lib/validateEmail";
import { generateOTP } from "@/utils/otpGenerator";
import ResetPasswordEmail from "@/app/emails/ResetPassword";
import { render } from "@react-email/render";
import { addMinutes } from "date-fns";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { email } = await data;

    try {
      // if (!isValidEmailDomain(email, "ndt.co.za")) {
      //   return NextResponse.json(
      //     {
      //       message: "Invalid NDT email! Please try again",
      //     },
      //     { status: 401 }
      //   );
      // }

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

      const generatedOTP = generateOTP();
      const otpExpiryDate = addMinutes(new Date(), 5);

      await db.oTP.create({
        data: {
          userId: user.id,
          code: generatedOTP,
          expiryDate: otpExpiryDate,
        },
      });

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,

        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const name = user?.Name;

      const emailHtml = render(ResetPasswordEmail(name, generatedOTP));

      console.log(emailHtml);

      const options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "New Dawn 360 Reset Password OTP",
        html: emailHtml,
      };

      // console.log(options);

      try {
        const data = await transporter.sendMail(options);
        // console.log(data);
        return new Response(JSON.stringify({ message: "Email sent", data }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error(error);
        return new Response(
          JSON.stringify({ message: "Email failed to send", error }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
