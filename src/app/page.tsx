import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";

import LandingPage from "@/app/LandingPage";
import ReportPage from "@/app/report/page";

export default function Home() {
  return (
    <div className="bg-slate-50 items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <ReportPage /> */}
      <LandingPage />
    </div>
  );
}
