import { Button } from "@/components/ui/button";
import { HomeIcon, Activity, CircleArrowUp } from "lucide-react";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* name */}
            <Activity className="w-6 h-6" />
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              VitalView
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Home */}
            {/* <Button
              variant="ghost"
              className="flex gap-2 bg-black text-white"
              asChild
            >
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button> */}
            {/* get started */}
            {/* <Button
              variant="ghost"
              className="flex gap-2 bg-black text-white"
              asChild
            >
              <Link href="/ReportPage">
                <CircleArrowUp className="w-4 h-4" />
                <span className="hidden lg:inline">Get Started</span>
              </Link>
            </Button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
