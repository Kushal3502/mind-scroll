import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ blogId: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { blogId } = await params;

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

    const comments = await prisma.comment.findMany({
      where: { blogId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment fetched successfully",
        comments,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Comment fetch error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching comment",
      },
      {
        status: 500,
      }
    );
  }
}
