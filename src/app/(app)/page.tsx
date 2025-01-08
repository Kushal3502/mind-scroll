import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <div >
      <h1 className=" h-screen bg-indigo-400">MindScroll</h1>
      <h1 className=" h-screen">MindScroll</h1>
      <h1>MindScroll</h1>
      <h1>MindScroll</h1>
      <h1>MindScroll</h1>
    </div>
  );
}
