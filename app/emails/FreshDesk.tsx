import {
  Text,
  Html,
  Head,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";



export default function ToFreshDesk(
  property?: string,
  campus?: string,
  problem?: string,
  idNumber?: string,
  studentNumber?: string,
  email?: string,
  institution?: string,
  accommodation?: string,
  fullName?: string,
  date?: string,
  query?: string,
  resolve?: string,
  contactNumber?: string,
  contactNo?: string,
  contactPerson?: string
) {
  return (
    <Html>
      <Head />
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={heading}>New AP Query</Text>
      </Section>
      <Section style={paragraphContent}>
        <Text style={paragraph}>Query Details:</Text>
        {property ? (
          <Text style={paragraph}>
            <b>Property Name: </b>
            {property}
          </Text>
        ) : null}
        {campus ? (
          <Text style={paragraph}>
            <b>Campus: </b>
            {campus}
          </Text>
        ) : null}
        {problem ? (
          <Text style={paragraph}>
            <b>Problem: </b>
            {problem}
          </Text>
        ) : null}
        {date ? (
          <Text style={paragraph}>
            <b>Date: </b>
            {date}
          </Text>
        ) : null}
        {query ? (
          <Text style={paragraph}>
            <b>Query: </b>
            {query}
          </Text>
        ) : null}
        {resolve ? (
          <Text style={paragraph}>
            <b>Resolve: </b>
            {resolve}
          </Text>
        ) : null}

        {contactNumber ? (
          <Text style={paragraph}>
            <b>Contact No: </b>
            {contactNumber}
          </Text>
        ) : null}

        {contactNo ? (
          <Text style={paragraph}>
            <b>Contact No: </b>
            {contactNo}
          </Text>
        ) : null}
        {contactPerson ? (
          <Text style={paragraph}>
            <b>Contact Person: </b>
            {contactPerson}
          </Text>
        ) : null}
        {idNumber ? (
          <Text style={paragraph}>
            <b>ID Number: </b>
            {idNumber}
          </Text>
        ) : null}

        {accommodation ? (
          <Text style={paragraph}>
            <b>Accommodation: </b>
            {accommodation}
          </Text>
        ) : null}

        {studentNumber ? (
          <Text style={paragraph}>
            <b>Student Number: </b>
            {studentNumber}
          </Text>
        ) : null}

        {institution ? (
          <Text style={paragraph}>
            <b>Institution: </b>
            {institution}
          </Text>
        ) : null}

        {email ? (
          <Text style={paragraph}>
            <b>Email: </b>
            {email}
          </Text>
        ) : null}

        {fullName ? (
          <Text style={paragraph}>
            <b>Full Name: </b>
            {fullName}
          </Text>
        ) : null}

        <Hr style={hr} />
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#dbddde",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const sectionLogo = {
  padding: "0 40px",
};

const headerBlue = {
  marginTop: "-1px",
};

const container = {
  margin: "30px auto",
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden",
};

const containerContact = {
  backgroundColor: "#f0fcff",
  width: "90%",
  borderRadius: "5px",
  overflow: "hidden",
  paddingLeft: "20px",
};

const heading = {
  fontSize: "14px",
  lineHeight: "26px",
  fontWeight: "700",
  color: "#004dcf",
};

const paragraphContent = {
  padding: "0 40px",
};

const paragraphList = {
  paddingLeft: 40,
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#3c4043",
};

const link = {
  ...paragraph,
  color: "#004dcf",
};

const hr = {
  borderColor: "#e8eaed",
  margin: "20px 0",
};

const footer = {
  maxWidth: "100%",
};
