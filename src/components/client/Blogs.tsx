"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { Card, CardContent, CardHeader } from "../ui/card";
import { TrendingUp } from "lucide-react";

export interface Blog {
  id: string;
  title: string;
  thumbnail: string;
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

  useEffect(() => {
    fetchBlogs();
  }, [currPage]);

  return (
    <Card className="">
      <CardHeader>
        <div className=" flex justify-start items-center gap-2 mb-4">
          <span className=" text-xl font-semibold">Trending</span>
          <TrendingUp className=" h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        {blogs && blogs.map((item) => <BlogCard blog={item} key={item.id} />)}
      </CardContent>
    </Card>
  );
}

export default Blogs;
