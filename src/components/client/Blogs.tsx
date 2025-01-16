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

export interface Blog {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: Date;
}

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[] | null>();
  const [pages, setPages] = useState();
  const [currPage, setCurrPage] = useState(1);

  async function fetchBlogs() {
    const response = await axios.get(`/api/blog/get?page=${currPage}`);

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
    <Card>
      <CardHeader>
        <div className=" flex justify-start items-center gap-2">
          <span className=" text-xl font-semibold">Trending</span>
          <TrendingUp className=" h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className=" grid grid-cols-1 gap-2">
        {blogs && blogs.map((item) => <BlogCard blog={item} key={item.id} />)}
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
