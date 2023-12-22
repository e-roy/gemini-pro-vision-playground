import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound(): JSX.Element {
  return (
    <main className="h-full bg-cover bg-top sm:bg-top">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <p className="text-sm font-semibold text-slate-700 text-opacity-50 uppercase tracking-wide">
          404 error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          {`Uh oh! I think you’re lost.`}
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-800 text-opacity-50">
          {`It looks like the page you’re looking for doesn't exist.`}
        </p>
        <div className="mt-6">
          <Link href={`/`}>
            <Button type={`button`}>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
