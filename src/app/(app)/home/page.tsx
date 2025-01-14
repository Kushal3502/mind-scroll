import Blogs from "@/components/client/Blogs";
import Category from "@/components/client/Category";

function Home() {
  return (
    <div className=" grid md:grid-cols-3 gap-4">
      <div className=" col-span-2">
        <Blogs />
      </div>
      <div>
        <Category />
      </div>
    </div>
  );
}

export default Home;
