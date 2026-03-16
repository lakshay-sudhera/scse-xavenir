export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-gray-900 p-10 rounded-xl w-[400px] space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          className="w-full p-3 rounded bg-gray-800"
          placeholder="Email"
        />

        <input
          type="password"
          className="w-full p-3 rounded bg-gray-800"
          placeholder="Password"
        />

        <button className="w-full bg-purple-600 p-3 rounded">
          Login
        </button>

      </div>

    </div>
  );
}