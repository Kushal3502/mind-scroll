import Navbar from "@/components/client/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 mx-auto container mt-14 px-4 py-8">{children}</main>
    </div>
  );
}
