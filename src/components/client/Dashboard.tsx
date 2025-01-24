"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Blog, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import axios from "axios";
import BlogCard from "./BlogCard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[] | null>([]);

  async function fetchUserData() {
    if (session?.user?.id) {
      const response = await axios.get(`/api/user/${session.user.id}`);
      if (response.data.success) {
        setUserData(response.data.user);
        setBlogs(response.data.user.blogs);
      }
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blogs && blogs.length > 0 ? (
                  <div className=" grid grid-cols-1 gap-2">
                    {blogs &&
                      blogs.map((item) => (
                        <BlogCard blog={item} key={item.id} />
                      ))}
                  </div>
                ) : (
                  <div className=" flex flex-col justify-center items-center gap-3">
                    <p className="text-gray-600">No recent activity</p>
                    <Link href={"/blog/add"}>
                      <Button size={"sm"} variant={"outline"}>
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
