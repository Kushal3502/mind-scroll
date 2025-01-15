"use client";

import { Blog } from "@/components/client/Blogs";
import ContentForm from "@/components/client/ContentForm";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function EditBlog() {
  const { blogId } = useParams();

  const [blog, setBlog] = useState<Blog | null>();

  async function fetchBlog() {
    const response = await axios.get(`/api/blog/get/${blogId}`);

    if (response.data.success) {
      setBlog(response.data.blog);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  return <div>{blog && <ContentForm data={blog} />}</div>;
}

export default EditBlog;
