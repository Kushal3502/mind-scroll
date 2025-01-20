"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function AddComment({ blogId }: { blogId: string }) {
  const { status } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");

  async function handleSendMessage() {
    if (status !== "authenticated") {
      router.push("/signin");
      return;
    }

    try {
      if (blogId && message.trim()) {
        const response = await axios.post(`/api/comment/add/${blogId}`, {
          content: message,
        });

        console.log(response);

        if (response.data.success) {
          toast.success(response.data.message);
          setMessage("");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error("Failed to send comment");
      console.error("Comment submission error:", error);
    }
  }

  if (!blogId) {
    return null;
  }

  return (
    <div className="grid w-full gap-2">
      <Textarea
        placeholder="Type your message here."
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSendMessage}>
        {status == "authenticated" ? "Send Message" : "Login to send message"}
      </Button>
    </div>
  );
}

export default AddComment;
