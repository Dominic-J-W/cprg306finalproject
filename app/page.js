import Link from "next/link";

export default function Home() {
  return (
      <main className="flex flex-col gap-0.5 row-start-2 items-center sm:items-start bg-gray-300 min-h-screen">
        <h1 className="text-2xl w-full h-12 bg-gray-500">Video Game Finder</h1>
        <Link href="/pages/browse-games">Browse Games</Link>
      </main>
  );
}
