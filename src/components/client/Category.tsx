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
      <CardContent >
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            {category.map((item, index) => (
              <div key={index} className="rounded-lg border p-4 shadow-sm">
                <h3 className="mb-3 text-base font-semibold">{item.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.subcategories.map((el, index) => (
                    <Badge
                      variant="outline"
                      key={index}
                      className="hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      {el}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default Category;
