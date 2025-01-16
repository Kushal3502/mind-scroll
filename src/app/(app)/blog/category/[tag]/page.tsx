"use client";

import BlogCard from "@/components/client/BlogCard";
import { Blog } from "@/components/client/Blogs";
import Category from "@/components/client/Category";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function TagBlog() {
  const { tag } = useParams();

  const [blogs, setBlogs] = useState<Blog[] | null>();
  const [pages, setPages] = useState();
  const [currPage, setCurrPage] = useState(1);

  async function fetchBlogs() {
    const response = await axios.get(
      `/api/blog/get?tag=${tag}&page=${currPage}`
    );

    if (response.data.success) {
      setBlogs(response.data.blogs);
      setPages(response.data.totalPages);
    }
  }

  const handlePrevious = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };

  const handleNext = () => {
    if (currPage < (pages || 1)) {
      setCurrPage(currPage + 1);
    }
  };

  const renderPageNumbers = () => {
    if (!pages) return null;

    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(
        <PaginationItem key={i} className=" cursor-pointer">
          <PaginationLink
            onClick={() => setCurrPage(i)}
            isActive={currPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    fetchBlogs();
  }, [currPage]);

  return (
    <div className=" grid md:grid-cols-3 grid-cols-1 gap-4">
      <div className=" col-span-2">
        <Card>
          <CardHeader>
            <div className=" flex justify-start items-center gap-2">
              <span className=" text-xl font-semibold">
                Showing results for "{tag}"
              </span>
            </div>
          </CardHeader>
          <CardContent className=" grid grid-cols-1 gap-2">
            {blogs && blogs.length > 0 ? (
              blogs.map((item) => <BlogCard blog={item} key={item.id} />)
            ) : (
              <span>No results found</span>
            )}
          </CardContent>
          <CardFooter>
            {pages && pages > 1 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePrevious}
                      className={`${
                        currPage == 1 ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                  {renderPageNumbers()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNext}
                      className={`${
                        currPage == pages
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </CardFooter>
        </Card>
      </div>
      <div className=" col-span-1">
        <Category />
      </div>
    </div>
  );
}

export default TagBlog;
