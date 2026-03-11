import { useState } from "react";
import { login } from "../../api/auth";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({
        email,
        password
      });

      localStorage.setItem("accessToken", res.accessToken);

      alert("로그인 성공!");
    } catch (error) {
      console.log("로그인 오류 발생", error);
      alert("로그인 실패!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="w-full max-w-md bg-white rounded-xl">

        <h1 className="text-2xl font-bold text-center mb-10">
          로그인
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            로그인
          </button>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;