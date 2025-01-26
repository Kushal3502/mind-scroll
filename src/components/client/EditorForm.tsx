"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Upload, Loader2 } from "lucide-react";
import category from "@/category.json";
import { MultiSelect } from "./MultiSelect";
import { Editor } from "./Editor";
import Image from "next/image";
import { Blog } from "@prisma/client";

interface EditorFormProps {
  form: UseFormReturn<Blog>;
  data?: {
    title: string;
    thumbnail: string;
    content: string;
    tags: string[];
  };
  onSubmit: (data: Blog) => Promise<void>;
  buttonText: string;
  isEditing?: boolean;
}

function EditorForm({
  form,
  data,
  onSubmit,
  buttonText,
  isEditing,
}: EditorFormProps) {
  const [preview, setPreview] = React.useState<string>("");

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-7xl mx-auto px-4"
      >
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mb-6">
            <FormField
              control={form.control}
              name="title"
              defaultValue={data?.title}
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
              defaultValue={data?.thumbnail || ""}
              render={({ field }) => (
                <FormItem className="rounded-xl p-4">
                  <FormControl>
                    <div className="space-y-4 flex flex-col justify-center items-center">
                      {data?.thumbnail || preview ? (
                        <div className="h-40 w-full overflow-hidden rounded-lg shadow-sm">
                          <Image
                            src={preview || data?.thumbnail || ""}
                            alt="Preview"
                            width={400}
                            height={160}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
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
            defaultValue={data?.tags || []}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiSelect
                    options={category}
                    onValueChange={field.onChange}
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
                    initialValue={data?.content || ""}
                  />
                </FormControl>
                <FormMessage className="text-red-500 px-4 pb-4" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{isEditing ? "Updating..." : "Publishing..."}</span>
            </>
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default EditorForm;
