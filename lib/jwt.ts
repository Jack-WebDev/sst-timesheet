import jwt from "jsonwebtoken";

export const signJwt = (payload: Object, secret: string, exp: number) => {
	return jwt.sign(payload, secret, { expiresIn: exp });
};
