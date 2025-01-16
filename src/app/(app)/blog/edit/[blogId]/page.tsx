"use client";

import { Blog } from "@/components/client/Blogs";
import EditorForm from "@/components/client/EditorForm";
import { contentSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof contentSchema>;

function EditBlog() {
  const router = useRouter();
  const { blogId } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      thumbnail: "",
      content: "",
      tags: [],
    },
  });

  async function fetchBlog() {
    const response = await axios.get(`/api/blog/get/${blogId}`);

    if (response.data.success) {
      setBlog(response.data.blog);
      // Reset form with new values
      form.reset({
        title: response.data.blog.title,
        thumbnail: response.data.blog.thumbnail,
        content: response.data.blog.content,
        tags: response.data.blog.tags,
      });
    }
  }

  async function handleBlogUpdate(values: FormData) {
    console.log(values);

    try {
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        // Handle new file upload
        const formData = new FormData();
        formData.append("file", file);

        //todo:delete previous image

        const uploadResponse = await axios.post("/api/image-upload", formData);

        if (uploadResponse.data.success) {
          const response = await axios.patch(`/api/blog/edit/${blogId}`, {
            title: values.title,
            thumbnail: uploadResponse.data.response.secure_url,
            content: values.content,
            tags: values.tags,
          });
          toast.success(response.data.message);
          router.push("/home");
        }
      } else {
        // Handle update without new thumbnail
        const response = await axios.patch(`/api/blog/edit/${blogId}`, {
          title: values.title,
          thumbnail: blog?.thumbnail, // Use existing thumbnail
          content: values.content,
          tags: values.tags,
        });
        toast.success(response.data.message);
        router.push("/home");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  return (
    <div>
      {blog && (
        <EditorForm
          form={form}
          data={blog}
          onSubmit={handleBlogUpdate}
          buttonText="Update Blog"
          isEditing={true}
        />
      )}
    </div>
  );
}

export default EditBlog;
