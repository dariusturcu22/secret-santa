import { Button } from "@/components/ui/button";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
      <h1 className="text-2xl font-semibold">Welcome to Secret Santa!</h1>
      <div className="flex gap-4">
        <Button className="bg-green-600 text-white hover:bg-green-700">
          Sign Up
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
