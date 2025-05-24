import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 min-h-screen font-[family-name:var(--font-poppins)] overflow-y-auto">
      <main className="min-h-screen flex items-stretch">
        <div className="flex flex-col items-stretch justify-center bg-white p-20 rounded-r-4xl min-w-1/2 -mr-20 z-10">
          <p className="text-6xl font-bold pb-2">
            Aarogya<span className="text-blue-700 text-7xl">X</span>
          </p>
          <p className="text-xl text-zinc-700">
            The Integrated Hospital Manager
          </p>
          <div className="flex-grow"></div>
          <div className="flex items-center justify-end w-full gap-2">
            <button className="border border-zinc-400 font-semibold py-2 text-lg px-6 rounded-lg">
              Sign Up
            </button>
            <Link
              className="bg-blue-700 text-white font-semibold py-2 text-lg px-6 rounded-lg hover:bg-blue-800"
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className=" bg-[url('/hospital-management.jpg')] bg-no-repeat bg-cover flex-grow"></div>
      </main>
    </div>
  );
}
