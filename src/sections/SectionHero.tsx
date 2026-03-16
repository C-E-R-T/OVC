import { motion } from "framer-motion"

function SectionHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-primarySoft/40 to-primarySoft">

      {/* 상단 흰색 오버레이 */}
     <div className="absolute top-0 left-0 z-0 h-[40px] w-full bg-white" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-10 lg:px-20 w-full">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-primary font-semibold mb-6 tracking-wide"
        >
          All Certifications, One Platform
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 text-gray-900"
        >
          One View Cert,
          <br />
          자격증 준비의 새로운 방법
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
          className="text-gray-600 text-lg lg:text-xl max-w-2xl mb-12 leading-8"
        >
          시험 일정 관리부터 자격증 탐색까지
          <br className="hidden sm:block" />
          모든 준비 과정을 OVC에서 관리하세요.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="flex gap-4"
        >
        </motion.div>
      </div>

      {/* 다음 섹션과 자연스럽게 이어지는 하단 오버레이 */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-primarySoft" />
    </section>
  )
}

export default SectionHero