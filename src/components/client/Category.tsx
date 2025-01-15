import React from "react";
import category from "@/category.json";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

function Category() {
  return (
    <Card className=" shadow-md">
      <CardHeader className=" text-xl font-semibold">
        Search by category
      </CardHeader>
      <CardContent>
        <div className="space-y-2 space-x-1">
          {category.map((item, index) => (
            <Badge
              variant="outline"
              key={index}
              className="hover:bg-primary/10 transition-colors cursor-pointer"
            >
              {item.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Category;
