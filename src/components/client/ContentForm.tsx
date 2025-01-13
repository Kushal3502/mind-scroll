"use client";

import { Editor } from "@/components/client/Editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { contentSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Data {
  title?: string;
  thumbnail?: string;
  content?: string;
}

function ContentForm({ title = "", thumbnail = "", content = "" }: Data) {
  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title,
      thumbnail,
      content,
    },
  });

  async function onSubmit(values: z.infer<typeof contentSchema>) {
    console.log(values);

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
        });
        console.log(response);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} type="file" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Editor onChange={field.onChange} initialValue={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className=" w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Please wait" : "Publish"}
        </Button>
      </form>
    </Form>
  );
}

export default ContentForm;
