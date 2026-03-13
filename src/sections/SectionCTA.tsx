function SectionCTA() {

  return (
    <section className="py-32 bg-gradient-to-r from-primary to-primaryLight text-white">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <div>

          <h2 className="text-3xl font-bold mb-6">
            OVC로 자격증 준비를
            더 쉽게 시작하세요
          </h2>

          <p className="opacity-80 mb-8">
            시험 일정 관리, 자격증 정보 탐색,
            커뮤니티까지 하나의 플랫폼에서 제공합니다.
          </p>

          <button className="bg-white text-primary px-6 py-3 rounded-full font-semibold">
            시작하기
          </button>

        </div>

        <div className="flex justify-center">

          <div className="w-64 h-96 bg-white rounded-3xl shadow-2xl"></div>

        </div>

      </div>

    </section>
  )

}

export default SectionCTA