import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api/v1";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, login, password, isAdmin } = body;

    const endpoint = isAdmin
      ? `${API_URL}/admin/login`
      : `${API_URL}/customer/login`;

    const payload = isAdmin
      ? { email: email || login, password }
      : { login: login || phone || email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || "Login failed", errors: data.errors },
        { status: response.status || 400 }
      );
    }

    const token = data.data?.token;
    const cookieStore = await cookies();

    // Set HttpOnly Cookie
    if (token) {
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: data.data?.user,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Internal server error: " + err.message },
      { status: 500 }
    );
  }
}
