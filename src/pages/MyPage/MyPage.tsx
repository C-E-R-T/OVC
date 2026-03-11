// import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom";
// import { getMyInfo } from "../../api/user";

// function MyPage() {
//     const [isLogin, setIsLogin] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem("accessToken");

//         if (token) {
//             setIsLogin(true);
//         }
//     }, []);

//     const {data: user, isLoading, isError}=useQuery ({
//         queryKey:["*"],
//         queryFn: getMyInfo
//     });

//     if(isLoading) <div>로딩중...</div>
//     if(isError) <div>정보를 불러오는데 오류가 발생하였습니다.</div>

//     if (!isLogin) {
//         return (
//             <div className="flex gap-4 mt-[40px]">
//                 <button
//                     onClick={() => navigate("/login")}
//                     className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition"
//                 >
//                     Login
//                 </button>

//                 <button
//                     onClick={() => navigate("/signup")}
//                     className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-medium hover:bg-green-50 transition"
//                 >
//                     Signup
//                 </button>
//             </div>
//         )
//     }

//     return (
//         <div className="p-[40px]">
//             <div className="flex flex-col">
//                 <h1 className="font-semibold text-[35px] mb-[8px]">안녕하세요, {user?.name}님!</h1>
//                 <p className="mb-[50px]">계정 정보 및 활동 내역을 관리하세요.</p>
//             </div>

//             {/* 카드 섹션 */}
//             <section className="flex flex-col border border-gray-200 p-[20px] bg-green-200">
//                 <div className="flex items-center">
//                     {/* 이미지 카드 섹션 */}
//                     <div className="w-56 h-56 bg-gray-300 rounded-full mr-[50px]"></div>
//                     <div className="flex flex-col">
//                         <p className="font-bold text-[35px]">{user?.name}</p>
//                         <p className="text-gray-500 text-[18px]">{user?.email}</p>
//                     </div>
//                 </div>
//                 <button className="w-full mt-[30px] mb-[8px] py-3 bg-green-700 text-gray-100 rounded-lg">프로필 편집</button>
//             </section>
//             {/* 하단 섹션 */}
//             <div className="flex-col mt-[72px]">
//                 {/* 계정 설정 영역 */}
//                 <div className="flex gap-8">
//                     <span className="flex flex-col w-[70%]">
//                         <h3 className="font-medium text-[22px] mb-[16px]">계정 설정</h3>
//                         <div className="border border-gray-100 bg-green-100 rounded-xl p-[16px]">
//                             <div className="flex">
//                                 <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
//                                     P
//                                 </div>
//                                 <p className="flex items-center pl-[16px]">비밀번호 변경</p>
//                             </div>

//                             {/* 구분선 */}
//                             <div className="my-[16px] border-t border-gray-200"></div>

//                             <div className="flex">
//                                 <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
//                                     P
//                                 </div>
//                                 <p className="flex items-center pl-[16px]">뭔가가 들어가요</p>
//                             </div>
//                         </div>
//                     </span>
//                     {/* 활동 요약 영역 */}
//                     <div className="w-[30%] flex flex-col">
//                         <span>
//                             <h3 className="font-medium text-[22px] mb-[16px]">활동 요약</h3>
//                         </span>
//                         <div className="flex gap-4">
//                             <div className="flex flex-col flex-1 h-[180px] justify-center border border-gray-200 rounded-xl p-6 text-center">
//                                 <p className="text-[28px] font-bold">12</p>
//                                 <p className="text-gray-500">취득 자격증</p>
//                             </div>

//                             <div className="flex flex-col flex-1 h-[180px] justify-center border border-gray-200 rounded-xl p-6 text-center">
//                                 <p className="text-[28px] font-bold">28</p>
//                                 <p className="text-gray-500">위시리스트</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default MyPage

function MyPage() {
    return (
        <div className="p-[40px]">
            <div className="flex flex-col">
                <h1 className="font-semibold text-[35px] mb-[8px]">안녕하세요, 이다영님!</h1>
                <p className="mb-[50px]">계정 정보 및 활동 내역을 관리하세요.</p>
            </div>

            {/* 카드 섹션 */}
            <section className="flex flex-col border border-gray-200 p-[20px] bg-green-200">
                <div className="flex items-center">
                    {/* 이미지 카드 섹션 */}
                    <div className="w-56 h-56 bg-gray-300 rounded-full mr-[50px]"></div>
                    <div className="flex flex-col">
                        <p className="font-bold text-[35px]">이다영</p>
                        <p className="text-gray-500 text-[18px]">dayounglee0311@gmail.com</p>
                    </div>
                </div>
                <button className="w-full mt-[30px] mb-[8px] py-3 bg-green-700 text-gray-100 rounded-lg">프로필 편집</button>
            </section>
            {/* 하단 섹션 */}
            <div className="flex-col mt-[72px]">
                {/* 계정 설정 영역 */}
                <div className="flex gap-8">
                    <span className="flex flex-col w-[70%]">
                        <h3 className="font-medium text-[22px] mb-[16px]">계정 설정</h3>
                        <div className="border border-gray-100 bg-green-100 rounded-xl p-[16px]">
                            <div className="flex">
                                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
                                    P
                                </div>
                                <p className="flex items-center pl-[16px]">비밀번호 변경</p>
                            </div>

                            {/* 구분선 */}
                            <div className="my-[16px] border-t border-gray-200"></div>

                            <div className="flex">
                                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
                                    P
                                </div>
                                <p className="flex items-center pl-[16px]">뭔가가 들어가요</p>
                            </div>
                        </div>
                    </span>
                    {/* 활동 요약 영역 */}
                    <div className="w-[30%] flex flex-col">
                        <span>
                            <h3 className="font-medium text-[22px] mb-[16px]">활동 요약</h3>
                        </span>
                        <div className="flex gap-4">
                            <div className="flex flex-col flex-1 h-[180px] justify-center border border-gray-200 rounded-xl p-6 text-center">
                                <p className="text-[28px] font-bold">12</p>
                                <p className="text-gray-500">취득 자격증</p>
                            </div>

                            <div className="flex flex-col flex-1 h-[180px] justify-center border border-gray-200 rounded-xl p-6 text-center">
                                <p className="text-[28px] font-bold">28</p>
                                <p className="text-gray-500">위시리스트</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage