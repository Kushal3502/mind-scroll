import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ blogId: string }>;

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { blogId } = await params;

  try {
    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Blog delete error :: ", error);
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
