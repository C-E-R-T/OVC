import { useState } from "react";
import { signup } from "../../api/auth";

function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUsername] = useState("");

  const handleSignup = async () => {
    try {
      await signup({
        email,
        password,
        userName
      });

      alert("회원가입 성공!");
    } catch (error) {
      console.log("회원가입 오류 발생", error);
      alert("회원가입 실패!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="w-full max-w-md bg-white rounded-xl">

        <h1 className="text-2xl font-bold text-center mb-10">
          회원가입
        </h1>

        <div className="flex flex-col gap-4">

          <input
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

          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="userName"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            회원가입
          </button>

        </div>
      </div>

    </div>
  );
}

export default SignupPage;