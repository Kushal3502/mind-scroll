"use client";

import EditorForm from "@/components/client/EditorForm";
import { contentSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function AddBlog() {
  const router = useRouter();

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      thumbnail: "",
      content: "",
      tags: [],
    },
  });

  async function handleAddBlog(values: z.infer<typeof contentSchema>) {
    console.log(values);

    try {
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post("/api/image-upload", formData);

        if (uploadResponse.data.success) {
          const response = await axios.post("/api/blog/add", {
            title: values.title,
            thumbnail: String(uploadResponse.data.response.secure_url),
            content: values.content,
            tags: values.tags,
          });

          toast.success(response.data.message);

          router.push("/home");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      <EditorForm form={form} onSubmit={handleAddBlog} buttonText="Publish" />
    </div>
  );
}

export default AddBlog;
