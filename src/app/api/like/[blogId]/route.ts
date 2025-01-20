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

  try {
    const isLiked = await prisma.like.findFirst({
      where: {
        userId: author,
        blogId,
      },
    });

    if (isLiked) {
      await prisma.like.deleteMany({
        where: {
          userId: author,
          blogId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Like removed",
        },
        {
          status: 200,
        }
      );
    } else {
      await prisma.like.create({
        data: {
          userId: author,
          blogId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "New like added",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("Like operation error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing like",
      },
      {
        status: 500,
      }
    );
  }
}
