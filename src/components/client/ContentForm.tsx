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
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MultiSelect } from "./MultiSelect";
import category from "@/category.json";

interface Data {
  title?: string;
  thumbnail?: string;
  content?: string;
  tags?: string[];
}

interface ContentFormProp {
  data: Data;
}

function ContentForm({ data }: ContentFormProp) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: data?.title || "",
      thumbnail: data?.thumbnail || "",
      content: data?.content || "",
      tags: data?.tags || [],
    },
  });

  const handleImagePreview = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof contentSchema>) {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-7xl mx-auto px-4"
      >
        <div className=" flex flex-col gap-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mb-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input
                      placeholder="Write an engaging title..."
                      {...field}
                      className="h-full text-2xl md:text-3xl lg:text-4xl font-semibold border-none focus:border-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 transition-colors duration-200 placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className=" rounded-xl p-4">
                  <FormControl>
                    <div className="space-y-4 flex flex-col justify-center items-center">
                      {data?.thumbnail || preview ? (
                        <div className="h-40 w-full overflow-hidden rounded-lg shadow-sm">
                          <img
                            src={preview || data?.thumbnail}
                            alt="Preview"
                            className="object-cover w-full h-full "
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-full  border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <Input
                        placeholder="Upload thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e);
                          handleImagePreview(e);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiSelect
                    options={category}
                    onValueChange={(tags) => {
                      // setSelectedTags(tags);
                      field.onChange(tags);
                    }}
                    defaultValue={field.value}
                    placeholder="Select upto 5 tags"
                    variant="inverted"
                    maxCount={5}
                  />
                </FormControl>
                <FormMessage className="text-red-500 px-4 pb-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    onChange={field.onChange}
                    initialValue={field.value}
                  />
                </FormControl>
                <FormMessage className="text-red-500 px-4 pb-4" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full "
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <span>Publish Blog</span>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default ContentForm;
