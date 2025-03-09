import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Box, Brain, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function LandingPage() {
  return (
    <div className=" bg-slate-50 items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* who we are and what we do */}
      <h1 className="pb-2 text-4xl font-bold text-center text-black mb-4">
        Visualize Your Health
      </h1>
      <p className="pb-4 text-lg font-semibold text-slate-600 max-x-xl mb-4">
        VitalView helps you visualize and understand your lung scans with 3D
        models and analysis
      </p>
      {/* take user to page to upload scan and view report */}

      <Link href="/report">
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 bg-violet-100 text-stone-800 mb-10"
        >
          <span className="lg:inline">Start Visualizing Your Scans</span>
          <MoveRight className="w-4 h-4" />
        </Button>
      </Link>

      <div>
        {/* feature 1 */}
        <Separator className="my-4 " />
        <Card className=" mb-10 border-0 shadow-none">
          <CardContent className="">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Upload Scans Easily
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Upload your CT or MRI scans in DICOM, NIfTI, or common image
              formats with a simple drag and drop interface.
            </p>
          </CardContent>
        </Card>
        {/* feature 2 */}
        <Card className=" mb-10 border-0 shadow-none">
          {/* <Card className="bg-slate-200 mb-10"> */}
          <CardContent className="">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <Box className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              3D Visualization
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              View your lungs in an interactive 3D model to better understand
              your scans and results. Rotate, zoom, and explore from any angle.
            </p>
          </CardContent>
        </Card>
        {/* feature 3 */}
        <Card className=" mb-10 border-0 shadow-none">
          {/* <Card className="bg-slate-200"> */}
          <CardContent className="">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              In depth Analysis
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Get detailed insights about your scan with our AI analysis that
              identifies areas of concern and provides explanations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default LandingPage;
