function LoginPage() {

    const handleNaverLogin = () => {
        try {
            window.location.href = "http://localhost:8080/oauth2/authorization/naver";
        } catch (error) {
            console.log("로그인 오류 발생", error);
            alert("로그인 실패!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">

            <div className="w-full max-w-md bg-white rounded-xl">

                <h1 className="text-2xl font-bold text-center mb-10">
                    소셜 로그인
                </h1>

                <div className="flex flex-col gap-4">

                    <button
                        onClick={handleNaverLogin}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        네이버 로그인
                    </button>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;