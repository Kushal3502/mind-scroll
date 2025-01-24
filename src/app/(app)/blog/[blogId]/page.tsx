"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import parse from "html-react-parser";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddComment from "@/components/client/AddComment";
import { Blog, User } from "@prisma/client";

function ViewBlog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState<User | null>();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();

  async function fetchBlogDetails() {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/blog/get/${blogId}`);
      console.log(response);

      if (response.data.success) {
        setBlog(response.data.blog);
        setUser(response.data.blog.user);
        setComments(response.data.blog.comments);
        setLikeCount(response.data.blog.likes.length);

        if (session?.user?.id) {
          const likeStatus = response.data.blog.likes.some(
            (like: any) => like.userId === session.user?.id
          );

          setIsLiked(likeStatus);
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

  async function handleLike() {
    if (status !== "authenticated") {
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.post(`/api/like/${blogId}`);

      if (response.data.success) {
        if (isLiked) {
          setIsLiked(false);
          setLikeCount(likeCount - 1);
          toast.success(response.data.message);
        } else {
          setIsLiked(true);
          setLikeCount(likeCount + 1);
          toast.success(response.data.message);
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to like blog");
      console.error("Blog like error:", error);
    }
  }

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    blog && (
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
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleLike}>
                  <Heart
                    className="size-5 text-red-500 transition-all"
                    fill={isLiked ? "#ef4444" : "transparent"}
                    stroke={isLiked ? "#ef4444" : "currentColor"}
                  />
                </Button>
                <span className="text-sm font-medium">{likeCount} likes</span>
              </div>
              <div>
                {session?.user?.id == blog.author && (
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
        <article className="prose prose-lg max-w-none prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto">
          <div className="max-w-full overflow-x-hidden">
            {parse(blog.content)}
          </div>
        </article>
        <Separator className=" my-6" />
        <footer>
          <AddComment blogId={blogId as string} />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {comments.map((comment: any) => (
              <div key={comment.id} className=" rounded-lg mb-4 border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.user?.image} />
                    <AvatarFallback>
                      {comment.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{comment.user?.name}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </footer>
      </article>
    )
  );
}

export default ViewBlog;
