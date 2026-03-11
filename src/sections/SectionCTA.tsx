function SectionCTA() {
    return (
        <section className="w-full min-h-screen bg-[#F7FFE3] flex items-center justify-center min-h-screen snap-start">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                    자격증 준비를 더 쉽게 시작하세요
                </h2>

                <p className="mb-6">
                    자격증 일정 관리부터 정보 탐색, 커뮤니티까지
                </p>

                <div className="flex gap-4 justify-center">
                    <button className="px-6 py-2 bg-white rounded-full">
                        자격증 탐색하기
                    </button>

                    <button className="px-6 py-2 bg-black text-white rounded-full">
                        지금 시작하기
                    </button>
                </div>
            </div>
        </section>
    );
}

export default SectionCTA