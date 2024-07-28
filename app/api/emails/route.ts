import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { NextRequest } from "next/server";
import ToFreshDesk from "@/app/emails/FreshDesk";
import { getSession } from "@/actions/auth/actions";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const {
    property,
    contactPerson,
    contactNo,
    date,
    campus,
    query,
    problem,
    resolve,
    client,
    idNumber,
    studentNumber,
    contactNumber,
    email,
    institution,
    accommodation,
    fullName,
  } = await data;

  const session = await getSession()



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

  

  const emailHtml = render(
    ToFreshDesk(
      property,
      campus,
      problem,
      idNumber,
      studentNumber,
      email,
      institution,
      accommodation,
      fullName,
      date,
      query,
      resolve,
      contactNumber,
      contactNo,
      contactPerson
    )
  );

  console.log(emailHtml);

  const options = {
    from: `${session.NDTEmail}`,
    to: process.env.EMAIL_TO,
    subject: `New Query from a ${client}`,
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
}
