import Navbar from "@/components/client/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 mx-auto bg-red-200 mt-12 px-4 py-8">{children}</main>
    </div>
  );
}
