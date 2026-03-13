function SectionHero() {

  return (
    <section className="w-full min-h-screen flex items-center justify-center text-center bg-white">

      <div className="max-w-4xl px-6">

        <p className="text-primary font-semibold mb-3">
         One View Cert
        </p>

        <h1 className="text-4xl font-bold mb-6 leading-snug">
          OVC, 이제 자격증 관리의 <span className="text-primary">변화</span>가 필요하지 않을까요?
        </h1>

        <p className="text-gray-500 leading-relaxed mb-10">
          여러 자격증 정보를 한곳에서 관리하고
          시험 일정과 준비 과정을 효율적으로 정리할 수 있는
          새로운 플랫폼입니다.
        </p>

        <div className="text-primary text-2xl animate-bounce">
          ↓
        </div>

      </div>

    </section>
  )

}

export default SectionHero