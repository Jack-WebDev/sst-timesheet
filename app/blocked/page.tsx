import Link from "next/link";
import { FaDoorOpen } from "react-icons/fa";

const page = () => {
	return (
		<div className="grid justify-center content-center gap-8 h-screen text-center">
			<h1 className="text-[2rem]">Not Authorized</h1>
			<Link
				href={"/"}
				className="text-primary flex items-center gap-4 text-[2rem]"
			>
				Go Back to Home <FaDoorOpen />
			</Link>
		</div>
	);
};

export default page;
