import { NextResponse } from "next/server";
import { authAdmin } from "@/lib/firebase_admin";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];
  // console.log(req.cookies.auth_key);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await authAdmin.verifyIdToken(token);
    return NextResponse.json({ message: "Authenticated", user: decodedToken });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}