import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type Token = {
	id: string;
	role: string;
	iat: string;
	exp: string;
};

const allowedOrigins = ['https://d31msg5rv6t2vi.cloudfront.net/']
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request: NextRequest) {
	const token = request.cookies.get("jwtToken");
	const origin = request.headers.get('origin') ?? ''
	const isAllowedOrigin = allowedOrigins.includes(origin)
   
	const isPreflight = request.method === 'OPTIONS'
   
	if (isPreflight) {
	  const preflightHeaders = {
		...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
		...corsOptions,
	  }
	  return NextResponse.json({}, { headers: preflightHeaders })
	}

	const response = NextResponse.next()
 
	if (isAllowedOrigin) {
	  response.headers.set('Access-Control-Allow-Origin', origin)
	}
   
	Object.entries(corsOptions).forEach(([key, value]) => {
	  response.headers.set(key, value)
	})
   

	if (token?.value) {
		try {
			const decoded = jwtDecode<Token>(token.value);

			if (
				request.nextUrl.pathname.startsWith("/users/admin") &&
				decoded.role !== "Admin"
			) {
				return NextResponse.rewrite(new URL("/blocked", request.url));
			}
		} catch (error) {
			console.error("JWT decoding failed:", error);
		}
	}

	if (!token) {
		if (request.nextUrl.pathname.startsWith("/users")) {
			return NextResponse.rewrite(new URL("/blocked", request.url));
		}
		if (
			request.nextUrl.pathname.endsWith("/departments") ||
			request.nextUrl.pathname.endsWith("/users") ||
			request.nextUrl.pathname.endsWith("/projects") ||
			request.nextUrl.pathname.endsWith("/timesheets")
		) {
			return NextResponse.rewrite(new URL("/blocked", request.url));
		}
	}


	return response;
}
