"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BlogCard from "./BlogCard";
import { Blog } from "@prisma/client";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[] | null>();
  const [pages, setPages] = useState();
  const [currPage, setCurrPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog/get?page=${currPage}`);

      if (response.data.success) {
        setBlogs(response.data.blogs);
        setPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
    <Card>
      <CardHeader>
        <div className=" flex justify-start items-center gap-2">
          <span className=" text-xl font-semibold">Trending</span>
          <TrendingUp className=" h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className=" grid grid-cols-1 gap-2">
        {loading ? (
          <Card className="w-full">
            <div className="flex flex-col md:flex-row">
              <CardHeader className="p-3 md:p-4 lg:p-5">
                <Skeleton className="w-full md:w-48 lg:w-64 h-48 rounded-lg" />
              </CardHeader>
              <div className="flex flex-col justify-around flex-1 p-3 md:p-4">
                <CardContent className="space-y-3 p-0">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </CardContent>
                <CardFooter className="p-0 mt-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardFooter>
              </div>
            </div>
          </Card>
        ) : (
          blogs?.map((item) => <BlogCard blog={item} key={item.id} />)
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
                    currPage == pages ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default Blogs;
