import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ blogId: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth();
  const author = session?.user?.id;

  const { blogId } = await params;

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

  const { content } = await request.json();

  if (!content) {
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
    const newComment = await prisma.comment.create({
      data: {
        userId: author,
        blogId,
        content,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New comment added",
        comment: newComment,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Comment add error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error adding comment",
      },
      {
        status: 500,
      }
    );
  }
}
