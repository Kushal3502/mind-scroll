import Blogs from "@/components/client/Blogs";
import Category from "@/components/client/Category";
import SearchBox from "@/components/client/SearchBox";

function Home() {
  return (
    <div className=" grid md:grid-cols-3 grid-cols-1 gap-4">
      <div className=" col-span-2">
        <Blogs />
      </div>
      <div className=" col-span-1">
        <div className=" grid grid-cols-1 gap-2">
          <SearchBox />
          <Category />
        </div>
      </div>
    </div>
  );
}

export default Home;
