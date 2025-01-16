import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // get query params
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") ?? "";
    const tags = searchParams.get("tags") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "5");

    const skip = (page - 1) * limit;

    // get paginated result
    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          //   {
          //     tags: {
          //         contains: tags,
          //         mode: "insensitive",
          //       },
          //   },
        ],
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // get total number of blogs
    const totalBlogs = await prisma.blog.count();

    return NextResponse.json(
      {
        success: true,
        blogs,
        totalBlogs,
        page,
        totalPages: Math.ceil(totalBlogs / limit),
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
