import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ blogId: string }>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { blogId } = await params;

  const { title, thumbnail, content, tags } = await request.json();

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    // if blog not found
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        {
          status: 400,
        }
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        content,
        title,
        tags,
        thumbnail,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully",
        blog: updatedBlog,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
