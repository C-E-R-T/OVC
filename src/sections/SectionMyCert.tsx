function SectionMyCert() {

  return (
    <section className="py-32 bg-primarySoft">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-16">
          기존 자격증 준비의 문제점
        </h2>

        <div className="bg-white rounded-3xl shadow-xl p-10 grid md:grid-cols-2 gap-10">

          <div>
            <h3 className="font-semibold mb-3">
              Strength
            </h3>

            <p className="text-gray-500">
              다양한 자격증 시험 존재
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Weakness
            </h3>

            <p className="text-gray-500">
              일정 관리 어려움
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Opportunity
            </h3>

            <p className="text-gray-500">
              자기개발 수요 증가
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Threat
            </h3>

            <p className="text-gray-500">
              정보 분산 문제
            </p>
          </div>

        </div>

      </div>

    </section>
  )

}

export default SectionMyCert