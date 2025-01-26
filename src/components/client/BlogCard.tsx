"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Blog, User } from "@prisma/client";

function BlogCard({ blog }: { blog: Blog }) {
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
    blog && (
      <Link href={`/blog/${blog.id}`}>
        <Card className=" w-full hover:shadow-xl ">
          <div className="flex flex-col md:flex-row">
            <CardHeader className="p-3 md:p-4 lg:p-5">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={blog.thumbnail as string}
                  alt={blog.title}
                  height={200}
                  width={300}
                  className="w-full md:w-48 lg:w-64 h-48 object-cover "
                  priority
                />
              </div>
            </CardHeader>
            <div className="flex flex-col justify-around flex-1 p-3 md:p-4">
              <CardContent className="space-y-3 p-0">
                <h2 className="text-lg md:text-xl font-bold line-clamp-2 ">
                  {blog.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((item, index) => (
                    <Badge key={index}>{item}</Badge>
                  ))}
                </div>
                <p className="text-sm ">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
              <CardFooter className="p-0 mt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ">
                    <AvatarImage
                      src={user?.image || "https://github.com/shadcn.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm ">{user?.name}</span>
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    )
  );
}

export default BlogCard;
