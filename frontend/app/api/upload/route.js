import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "/products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "ImageKit private key is not configured on server" },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString("base64");

    const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

    const uploadPayload = new FormData();
    uploadPayload.append("file", base64File);
    uploadPayload.append("fileName", file.name || `product_${Date.now()}.jpg`);
    uploadPayload.append("folder", folder);
    uploadPayload.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: uploadPayload,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ImageKit upload error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to upload image to ImageKit" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      fileId: data.fileId,
      name: data.name,
      thumbnailUrl: data.thumbnailUrl,
    });
  } catch (error) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during upload" },
      { status: 500 }
    );
  }
}
