import { useQuery } from "@tanstack/react-query";
import { getCertificateRanking } from "../../../api/certificateRank";

function CertificateRanking() {
    const { data = [], isLoading, isError } = useQuery({
        queryKey: ["certificateRanking"],
        queryFn: () => getCertificateRanking(10),
    });

    return (
        <section className="rounded-[28px] border border-[#e7e5df] bg-white px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] md:px-8 md:py-6">
            <div className="mb-5">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    POPULAR CERTIFICATES
                </p>
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[28px] font-bold leading-tight text-gray-900">
                        인기 자격증 랭킹
                    </h2>
                    <span className="rounded-full bg-[#f4efe3] px-3 py-1 text-[13px] font-semibold text-gray-700">
                        TOP 3
                    </span>
                </div>
                <p className="mt-2 text-[15px] text-gray-500">
                    사용자들이 많이 관심 등록한 자격증 순위를 확인해보세요.
                </p>
            </div>

            {isLoading ? (
                <div className="rounded-2xl bg-[#f8f8f6] px-5 py-6 text-sm text-gray-500">
                    랭킹 불러오는 중...
                </div>
            ) : isError ? (
                <div className="rounded-2xl bg-[#fff7f7] px-5 py-6 text-sm font-medium text-red-500">
                    랭킹을 불러오지 못했습니다.
                </div>
            ) : data.length === 0 ? (
                <div className="rounded-2xl bg-[#f8f8f6] px-5 py-6 text-sm text-gray-500">
                    아직 랭킹 데이터가 없습니다.
                </div>
            ) : (
                <ul className="space-y-3">
                    {data.map((item, index) => (
                        <li
                            key={item.certId}
                            className="flex items-center justify-between rounded-2xl bg-[#f8f8f6] px-5 py-4 transition hover:bg-[#f3f2ee]"
                        >
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[16px] font-bold text-primary shadow-sm">
                                    {index + 1}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-[17px] font-semibold text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        관심 등록 기준
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-[15px] font-bold text-gray-800">
                                    {item.likeCount.toLocaleString()}명
                                </p>
                                <p className="mt-1 text-xs text-gray-400">찜한 사용자</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default CertificateRanking;