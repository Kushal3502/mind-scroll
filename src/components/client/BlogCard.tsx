"use client";

import React, { useEffect, useState } from "react";
import { Blog } from "./Blogs";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface BlogCardProps {
  blog: Blog;
}

interface User {
  name: string;
  image: string;
}

function BlogCard({ blog }: BlogCardProps) {
  const [user, setUser] = useState<User | null>();

  async function fetchUser(userId: string) {
    const response = await axios.get(`/api/user/${userId}`);
    if (response.data.success) {
      setUser(response.data.user);
    }
  }

  useEffect(() => {
    fetchUser(blog.author);
  }, [blog]);

  return (
    <Link href={`/blog/${blog.id}`}>
      <Card className=" w-full flex justify-around items-center mb-4">
        <CardHeader className="md:p-4 p-2">
          <Image
            src={blog.thumbnail}
            alt="thumbnail"
            height={150}
            width={300}
            className="w-full md:h-40 h-24 object-cover rounded-lg "
          />
        </CardHeader>
        <div className="text-justify">
          <CardContent className="space-y-2 p-4 flex flex-col">
            <h2 className="md:text-lg text-sm font-bold  ">{blog.title}</h2>
            <div className=" flex flex-wrap gap-2">
              {blog.tags.map((item, index) => (
                <Badge variant="secondary" key={index}>
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-3 p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm ">{user?.name}</span>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}

export default BlogCard;
