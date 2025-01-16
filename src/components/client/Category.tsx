import category from "@/category.json";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";

function Category() {
  return (
    <Card className=" shadow-md">
      <CardHeader className=" text-xl font-semibold">
        Search by category
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {category.map((item, index) => (
            <Link key={index} href={`/blog/category/${item.value}`}>
              <Badge
                variant="outline"
                className="hover:bg-primary/10 transition-colors cursor-pointer"
              >
                {item.label}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Category;
