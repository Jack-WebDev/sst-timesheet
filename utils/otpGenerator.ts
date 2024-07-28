export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const isOtpExpired = (expirationTime: Date): boolean => {
  const now = new Date();
  return now > expirationTime;
};
