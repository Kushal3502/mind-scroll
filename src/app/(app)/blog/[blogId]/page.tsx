"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Blog, Comment, User } from "@prisma/client";
import axios from "axios";
import parse from "html-react-parser";
import { Brain, Heart, Loader2, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CommentWithUser = Comment & {
  user: {
    name: string | null;
    image: string | null;
  };
};

function ViewBlog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [comments, setComments] = useState<CommentWithUser[] | null>();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [summarizedContent, setSummarizedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey as string);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  async function fetchBlogDetails() {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog/get/${blogId}`);
      console.log(response);

      if (response.data.success) {
        setBlog(response.data.blog);
        setUser(response.data.blog.user);
        setComments(response.data.blog.comments);
        setLikeCount(response.data.blog.likes.length);

        if (session?.user?.id) {
          const likeStatus = response.data.blog.likes.some(
            // @ts-expect-error
            (like) => like.userId === session.user?.id
          );
          console.log(likeStatus);

          setIsLiked(likeStatus);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch blog error :: ", error);
      toast.error("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments() {
    try {
      const response = await axios.get(`/api/comment/get/${blogId}`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Comments fetch error:", error);
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
      }
    } catch (error) {
      toast.error("Failed to like blog");
      console.error("Blog like error:", error);
    }
  }

  async function handleSendMessage() {
    if (status !== "authenticated") {
      router.push("/signin");
      return;
    }

    setSending(true);

    try {
      if (blogId && message.trim()) {
        const response = await axios.post(`/api/comment/add/${blogId}`, {
          content: message,
        });

        console.log(response);

        if (response.data.success) {
          toast.success(response.data.message);
          setMessage("");
          fetchComments();
        }
      }
    } catch (error) {
      toast.error("Failed to send comment");
      console.error("Comment submission error:", error);
    } finally {
      setSending(false);
    }
  }

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function summarize(content: string) {
    setIsLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(
        `Summarize the content ${content}`
      );
      setSummarizedContent(result.response.text());
    } catch (error) {
      console.error("Fetch blog error :: ", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  if (loading) {
    return (
      <article className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
        <header className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </header>
        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="mt-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </article>
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
        <header className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {blog.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.image || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm sm:text-base">{user?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleLike}>
                  <Heart
                    className="size-4 sm:size-5 text-red-500 transition-all"
                    fill={isLiked ? "#ef4444" : "transparent"}
                  />
                </Button>
                <span className="text-xs sm:text-sm font-medium">
                  {likeCount} likes
                </span>
              </div>
              <Dialog>
                <DialogTrigger>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => summarize(blog.content)}
                  >
                    <Brain className="size-4" />
                    <span className="hidden sm:block">Summarize</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Blog Summary
                    </DialogTitle>
                    <DialogDescription className="mt-4">
                      {isLoading ? (
                        <Loader2 className="size-8 animate-spin text-primary" />
                      ) : (
                        <div className="prose prose-slate max-w-none">
                          <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {summarizedContent}
                          </p>
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {session?.user?.id == blog.author && (
                <Link href={`/blog/edit/${blogId}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="size-4" />
                    <span className="hidden sm:block ml-2">Edit</span>
                  </Button>
                </Link>
              )}
            </div>
            <time className="text-sm text-muted-foreground">
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
          <div className="grid w-full gap-2">
            <Textarea
              placeholder="Type your message here."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSendMessage} disabled={sending}>
              {status == "authenticated" ? (
                sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Sending</p>
                  </>
                ) : (
                  "Send Message"
                )
              ) : (
                "Login to send message"
              )}
            </Button>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className=" rounded-lg mb-4 border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          comment.user?.image || "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>
                        {comment.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{comment.user?.name}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p>No comments</p>
            )}
          </div>
        </footer>
      </article>
    )
  );
}

export default ViewBlog;
