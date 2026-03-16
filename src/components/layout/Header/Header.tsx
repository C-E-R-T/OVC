import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getMyInfo } from "../../../api/user"

function Header() {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo,
        retry: false,
    });

    const isLoggedIn = !!user;

    console.log("user:", user);
    console.log("isLoading:", isLoading);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("isError:", isError);

    return (
        <header className="fixed top-4 left-0 z-50 w-full px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="mx-auto mt-4 flex h-16 max-w-[1400px] items-center justify-between rounded-full border border-white/60 bg-white/55 px-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                    <Link
                        to="/"
                        className="text-xl font-bold tracking-tight text-gray-900 transition hover:opacity-80"
                    >
                        OVC
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            to="/calendar"
                            className="text-[15px] font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            일정
                        </Link>
                        <Link
                            to="/cert-search"
                            className="text-[15px] font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            자격증 탐색
                        </Link>
                        <Link
                            to="/cert-manage"
                            className="text-[15px] font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            자격증 관리
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {isLoading ? null : isLoggedIn ? (
                            <Link
                                to="/mypage"
                                className="text-[15px] font-medium text-gray-600 transition hover:text-gray-900"
                            >
                                마이페이지
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="text-[15px] font-medium text-gray-600 transition hover:text-gray-900"
                            >
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header