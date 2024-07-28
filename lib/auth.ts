import bcrypt from "bcryptjs";

export const comparePassword = async (
	password: string,
	hashedPassword: any
) => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		console.error("Error comparing passwords:", error);
		throw error;
	}
};

export const hashPassword = async (password: string, genSalt: number) => {
	try {
		return await bcrypt.hash(password, genSalt);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
