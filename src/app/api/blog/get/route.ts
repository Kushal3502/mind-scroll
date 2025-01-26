import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // get query params
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") ?? "";
    const tag = searchParams.get("tag") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "5");

    const skip = (page - 1) * limit;

    let whereClause = {};

    if (query) {
      whereClause = {
        title: {
          contains: query,
          mode: "insensitive",
        },
      };
    } else if (tag) {
      whereClause = {
        tags: {
          has: tag,
        },
      };
    }

    // get paginated result
    const blogs = await prisma.blog.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
    });

    // get total number of blogs
    const totalBlogs = await prisma.blog.count({
      where: whereClause,
    });

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
