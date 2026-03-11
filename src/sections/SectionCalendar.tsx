function SectionCalendar() {
    return (
        <section className="w-full min-h-screen bg-[#F7FFF3] flex items-center justify-center min-h-screen snap-start">
            <div className="text-center">
                {/* 왼쪽 텍스트 */}
                <div className="max-w-md">
                    <h2 className="text-2xl font-bold mb-4">
                        자격증 일정 관리
                    </h2>

                    <p className="text-gray-800">
                        모든 자격증 시험 일정을 캘린더에서 한눈에 확인하세요.
                    </p>

                    <button className="mt-6 px-6 py-2 bg-white rounded-full">
                        일정 보러가기
                    </button>
                </div>

                {/* 오른쪽 이미지 */}
                <div className="w-[400px] h-[300px] bg-gray-300 flex items-center justify-center">
                    캘린더 영역
                </div>
            </div>
        </section>
    );
}

export default SectionCalendar