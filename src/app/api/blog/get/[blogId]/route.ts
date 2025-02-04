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
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
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

    return NextResponse.json(
      {
        success: true,
        message: "Blog fetched successfully",
        blog,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Fetch blog error :: ", error);
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
