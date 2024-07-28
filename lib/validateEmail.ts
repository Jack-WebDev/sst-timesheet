export const isValidEmailDomain = (email: string, domain: string) => {
	const regex = new RegExp(`@${domain}$`, "i");
	return regex.test(email);
};
