"use client";
import useAuthContext from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const auth = useAuthContext();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await auth.login!(email, password);
    if (!result) return;
    router.push(`/${result.role.toLowerCase()}`);
  };
  return (
    <div className="grid grid-cols-1 min-h-screen font-[family-name:var(--font-poppins)] overflow-y-auto">
      <main className="min-h-screen flex items-stretch">
        <form
          className="flex flex-col items-stretch justify-center bg-white p-20 rounded-r-4xl min-w-1/2 -mr-20 z-10"
          onSubmit={handleSubmit}
        >
          <p className="text-4xl font-bold pb-2">
            Aarogya<span className="text-blue-700 text-5xl">X</span>
          </p>
          <hr className="border-slate-300" />
          <div className="flex-grow flex flex-col items-stretch p-8 text-lg">
            <label className="flex flex-col gap-2 mb-4">
              <p className="font-semibold">Email</p>
              <input
                className="px-4 py-2 rounded-xl bg-transparent border border-slate-300"
                type="text"
                name="email"
              />
            </label>
            <label className="flex flex-col gap-2 mb-4">
              <p className="font-semibold">Password</p>
              <input
                className="px-4 py-2 rounded-xl bg-transparent border border-slate-300"
                type="password"
                name="password"
              />
            </label>
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <button className="border border-zinc-400 font-semibold py-2 text-lg px-6 rounded-lg">
              Clear
            </button>
            <button className="bg-blue-700 text-white font-semibold py-2 text-lg px-6 rounded-lg hover:bg-blue-800">
              Log In
            </button>
          </div>
        </form>
        <div className=" bg-[url('/hospital-management.jpg')] bg-no-repeat bg-cover flex-grow"></div>
      </main>
    </div>
  );
}
