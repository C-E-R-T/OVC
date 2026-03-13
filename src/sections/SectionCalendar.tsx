function SectionCalendar() {

  return (
    <section className="py-32 bg-white">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <p className="text-primary font-semibold mb-2">
          Desk Research
        </p>

        <h2 className="text-3xl font-bold mb-12">
          자격증 준비 트렌드
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="font-semibold mb-4">
              MARKET TREND
            </h3>

            <p className="text-gray-500 text-sm">
              자격증 시장 규모 증가
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="font-semibold mb-4">
              LIFE TREND
            </h3>

            <p className="text-gray-500 text-sm">
              새로운 학습 방식 증가
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="font-semibold mb-4">
              CONSUMER TREND
            </h3>

            <p className="text-gray-500 text-sm">
              MZ세대 자기개발 관심 증가
            </p>
          </div>

        </div>

      </div>

    </section>
  )

}

export default SectionCalendar