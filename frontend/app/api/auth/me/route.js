import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api/v1";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/customer/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, user: data.data });
  } catch (err) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
