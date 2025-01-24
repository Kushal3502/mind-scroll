import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Edit3, Globe, User } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Boundless Expression",
    description:
      "Write without limits. Your thoughts, your style, your platform.",
    colorLight: "bg-blue-100",
    colorDark: "bg-blue-600",
  },
  {
    icon: <Edit3 className="w-6 h-6" />,
    title: "Intuitive Editing",
    description:
      "Smooth, distraction-free writing experience that sparks creativity.",
    colorLight: "bg-green-100",
    colorDark: "bg-green-600",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Integration",
    description:
      "Enhanced writing with smart AI assistance, helping you craft better content with intelligent suggestions and creative insights.",
    colorLight: "bg-purple-100",
    colorDark: "bg-purple-600",
  },
];

function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="text-center">
        <h2 className="md:text-6xl text-4xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Unleash Your Thoughts, <br />
          One Scroll at a Time
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          MindScroll is your digital canvas – where ideas flow freely,
          creativity knows no bounds, and your unique voice finds its home.
        </p>
        <div className="flex gap-6 justify-center">
          <Link href="/signup">
            <Button>
              Join Now
              <User className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/home">
            <Button variant="outline">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-8 border rounded-2xl shadow-lg"
          >
            <div
              className={`${item.colorLight} dark:bg-opacity-40 p-4 rounded-full mb-6`}
            >
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
