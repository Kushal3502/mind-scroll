"use client";

import { Blog } from "@/components/client/Blogs";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import parse from "html-react-parser";
import Image from "next/image";
import { User } from "@/components/client/BlogCard";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ViewBlog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useSession();

  console.log(currentUser);

  async function fetchBlog() {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/blog/get/${blogId}`);

      if (response.data.success) {
        setBlog(response.data.blog);
        const author = await axios.get(
          `/api/user/${response.data.blog.author}`
        );

        if (author.data.success) {
          setUser(author.data.user);
          console.log(author.data.user);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch blog");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-700">Blog not found</h1>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {blog.thumbnail && (
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <header>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{user?.name}</span>
            </div>
            <div>
              {currentUser.data?.user?.id == blog.author && (
                <Link href={`/blog/edit/${blogId}`}>
                  <Button variant="outline" size="sm" className="ml-2">
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <time>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>
      <Separator className=" my-6" />
      <div className="prose prose-lg max-w-none">{parse(blog.content)}</div>
      <Separator className=" my-6" />
      <footer>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-primary">
              <span>❤️ {69} likes</span>
            </button>
          </div>
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-primary">Share</button>
            <button className="text-gray-600 hover:text-primary">Save</button>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default ViewBlog;
