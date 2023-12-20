"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useTheme } from "next-themes";
import { Sun, Moon, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExtraButtons = () => {
  const { theme, setTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return;

  return (
    <div
      className={`absolute bottom-0 p-2 gap-6 flex w-full bg-white dark:bg-[#0c0a09]`}
    >
      <Button
        className={`w-full`}
        type={`button`}
        variant={`secondary`}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      <Link
        href={`https://github.com/e-roy/gemini-pro-vision-playground`}
        className={`w-full`}
        passHref
        // legacyBehavior
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className={`w-full`} type={`button`} variant={`secondary`}>
          <GithubIcon className={`h-5 w-5`} />
        </Button>
      </Link>
    </div>
  );
};
