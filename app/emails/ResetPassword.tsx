import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";



export const ResetPasswordEmail = (name:string | null, otp:string) => {
  return (
    <Html>
      <Head />
      <Preview>New Dawn 360 Reset Password OTP</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={"/ndt-technologies-web-logo.svg"}
            width="40"
            height="33"
            alt="ndt logo"
          />
          <Section>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Someone has requested a password change for your New Dawn 360
              account. If this was you, use the OTP below. This OPT will expire in 5 minutes.
            </Text>
            <Text>OTP: {otp}</Text>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const anchor = {
  textDecoration: "underline",
};
