import Image from "next/image"
import Link from "next/link"

export default function OtpLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="min-h-screen bg-gray-200 flex justify-center items-center flex-col">

        <Link href={"/"}>
          <Image
            src={"/ndt-technologies-web-logo.svg"}
            alt=""
            width={100}
            height={100}
            className="logo"
          />
        </Link>
        {children}
      </section>
    )
  }