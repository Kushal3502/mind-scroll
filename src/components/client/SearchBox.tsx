"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <div className=" flex gap-2">
      <Input
        type="text"
        placeholder="Enter blog title"
        onChange={(e) => setQuery(e.target.value)}
      />
      <Link href={`/blog/search/${query}`}>
        <Button>Search</Button>
      </Link>
    </div>
  );
}

export default SearchBox;
