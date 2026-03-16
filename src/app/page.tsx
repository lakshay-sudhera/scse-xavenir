export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-3xl rounded-full"></div>

      {/* Content */}
      <div className="z-10 text-center space-y-8">

        <h1 className="text-6xl md:text-7xl font-bold tracking-wide">
          Xavenir
        </h1>

        <h2 className="text-5xl md:text-6xl font-semibold text-purple-500">
          2025
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          The Annual Techfest of SCSE, NIT Jamshedpur.  
          Competitions, workshops and innovations.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center pt-6">

          <a
            href="/register"
            className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-semibold"
          >
            Register
          </a>

          <a
            href="/login"
            className="px-8 py-3 rounded-lg border border-purple-500 hover:bg-purple-600 transition"
          >
            Login
          </a>

        </div>

      </div>

    </main>
  );
}