"use client";

import category from "@/category.json";
import { Blog } from "@prisma/client";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Editor } from "./Editor";

export interface BlogFormData {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
}

interface EditorFormProps {
  form: UseFormReturn<BlogFormData>;
  data?: Blog;
  onSubmit: (data: BlogFormData) => Promise<void>;
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
  const [preview, setPreview] = useState<string>("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <>
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
                  <div className="flex gap-2 items-center">
                    <Input
                      readOnly
                      value={field.value
                        .map(
                          (tag: string) =>
                            category.find((item) => item.value === tag)?.label
                        )
                        .join(", ")}
                      placeholder="Selected tags will appear here..."
                      className="flex-1 text-xs"
                    />
                    <Button
                      type="button"
                      size={"sm"}
                      onClick={() => setIsTagDialogOpen(true)}
                    >
                      Select Tags
                    </Button>
                  </div>
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
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Tags (Max 5)</DialogTitle>
            <DialogDescription className="pt-4">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.map((item) => (
                      <Label
                        key={item.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                      >
                        <Input
                          type="checkbox"
                          checked={field.value.includes(item.value)}
                          onChange={(e) => {
                            const updatedTags = e.target.checked
                              ? [...field.value, item.value]
                              : field.value.filter(
                                  (tag: string) => tag !== item.value
                                );

                            if (updatedTags.length <= 5) {
                              field.onChange(updatedTags);
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{item.label}</span>
                      </Label>
                    ))}
                  </div>
                )}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditorForm;
