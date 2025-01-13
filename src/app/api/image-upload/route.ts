import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json(
      {
        success: false,
        error: "No file provided",
      },
      {
        status: 400,
      }
    );

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "MindScroll",
          },
          (error, uploadResult) => {
            if (error) reject(error);
            return resolve(uploadResult);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.log("File upload error :: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}
