import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  const author = session?.user?.id;

  if (!author) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { title, thumbnail, content, tags } = await request.json();

  if (!title || !content || !author || !tags) {
    return NextResponse.json(
      {
        success: false,
        message: "All fields are required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const newBlog = await prisma.blog.create({
      data: {
        content,
        title,
        tags,
        author,
        thumbnail,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New blog added",
        blog: newBlog,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Blog add error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error adding blog",
      },
      {
        status: 500,
      }
    );
  }
}
