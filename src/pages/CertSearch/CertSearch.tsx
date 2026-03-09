import { useState } from "react"
import SearchGridCard from "../../components/common/cards/SearchGridCard"
import SearchListCard from "../../components/common/cards/SearchListCard"


function CertSearch() {
    const [viewType, setViewType] = useState("grid");

    return (
        <div className="flex flex-row">
            {/* 좌측 - 사이드바 영역 */}
            <div className="w-[320px] h-screen p-[50px] bg-green-100">
                <h3 className="font-medium text-lg mb-6">카테고리</h3>
                <div className="space-y-4">

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-green-600" />
                        <span className="text-gray-700 font-medium">IT/기술</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-green-600" />
                        <span className="text-gray-700 font-medium">경영/비즈니스</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-green-600" />
                        <span className="text-gray-700 font-medium">금융/회계</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-green-600" />
                        <span className="text-gray-700 font-medium">외국어</span>
                    </label>

                </div>
            </div>
            {/* 우측 - 카드 영역 */}
            <div className="flex-1 p-8">
                <div className="flex justify-between">
                    <div>
                        <h1 className="font-semibold text-4xl pb-2">자격증 탐색</h1>
                        <p className="pb-5">커리어를 한 단계 높여줄 최적의 자격증을 리스트에서 확인해보세요.</p>
                    </div>
                    <div className="flex h-fit p-2 bg-gray-100 rounded-lg gap-4 mb-6">
                        <button onClick={() => { setViewType("grid") }}
                            className="px-4 h-fit rounded-lg  hover:bg-gray-300 transition font-medium"
                        >
                            그리드
                        </button>
                        <button onClick={() => { setViewType("list") }}
                            className="px-4  h-fit rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            리스트
                        </button>
                    </div>
                </div>

                {viewType === "grid" && (
                    <SearchGridCard
                        title="AWS Certified Solutions Architect"
                        description="AWS 기술을 활용한 클라우드 설계 자격증"
                    />
                )}

                {viewType === "list" && (
                    <SearchListCard
                        title="CISSP - Information Security Professional"
                        description="보안 관리자 및 엔지니어를 위한 국제 공인 정보 시스템 보안 전문가 자격입니다. 기업 보안 정책 및 위험 관리에 필수적입니다."
                    />
                )}
            </div>
        </div>
    )
}

export default CertSearch