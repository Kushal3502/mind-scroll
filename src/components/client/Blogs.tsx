"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { TrendingUp } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Blog {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  author: string;
  createdAt: Date;
}

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[] | null>();
  const [totalBlogs, setTotalBlogs] = useState();
  const [pages, setPages] = useState();
  const [currPage, setCurrPage] = useState(1);

  async function fetchBlogs() {
    const response = await axios.get(`/api/blog/get?page=${currPage}`);

    if (response.data.success) {
      setBlogs(response.data.blogs);
      setPages(response.data.totalPages);
      setTotalBlogs(response.data.totalBlogs);
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
        <PaginationItem key={i}>
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
    <Card className=" border-none">
      <CardHeader>
        <div className=" flex justify-start items-center gap-2">
          <span className=" text-xl font-semibold">Trending</span>
          <TrendingUp className=" h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        {blogs && blogs.map((item) => <BlogCard blog={item} key={item.id} />)}
      </CardContent>
      <CardFooter>
        {totalBlogs && totalBlogs > 10 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevious} />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem>
                <PaginationNext onClick={handleNext} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardFooter>
    </Card>
  );
}

export default Blogs;
