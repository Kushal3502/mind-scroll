"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Blog, User } from "@prisma/client";
import axios from "axios";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  async function fetchUserData() {
    if (session?.user?.id) {
      const response = await axios.get(`/api/user/${session.user.id}`);
      if (response.data.success) {
        setUserData(response.data.user);
        setBlogs(response.data.user.blogs);
        console.log(response);
      }
    }
  }

  async function handleDelete(blogId: string) {
    const response = await axios.delete(`/api/blog/delete/${blogId}`);

    if (response.data.success) {
      setBlogs((prev) => prev.filter((item) => item.id !== blogId));
      toast.success(response.data.message);
    } else {
      toast.error("Failed to delete blog");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 ">
                  <AvatarImage
                    src={
                      session?.user?.image || "https://github.com/shadcn.png"
                    }
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="">
                    {session?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userData?.name}</p>
                  <p className="text-gray-600">{userData?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className=" p-4 rounded">
                  <p className="">Total Blogs</p>
                  <p className="text-2xl font-bold">{blogs?.length}</p>
                </div>
                <div className=" p-4 rounded">
                  <p className="">Total Likes</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blogs && blogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Avatar className="h-10 w-10 object-cover">
                              <AvatarImage src={item.thumbnail || " "} />
                              <AvatarFallback>I</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>
                            <time>
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </time>
                          </TableCell>
                          <TableCell className="text-right flex justify-center items-center gap-2">
                            <Link href={`/blog/${item.id}`}>
                              <Button size={"sm"} variant={"outline"}>
                                <Eye />
                              </Button>
                            </Link>
                            <Link href={`/blog/edit/${item.id}`}>
                              <Button size={"sm"} variant={"outline"}>
                                <Pencil />
                              </Button>
                            </Link>
                            <Button
                              size={"sm"}
                              variant={"destructive"}
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className=" flex flex-col justify-center items-center gap-3">
                    <p className="text-gray-600">No recent activity</p>
                    <Link href={"/blog/add"}>
                      <Button size={"sm"}>
                        Add blog <Plus />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
