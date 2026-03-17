import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function SectionCalendar() {
  
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-primarySoft to-white">

      <div className="relative max-w-[1400px] mx-auto px-10 lg:px-20 w-full grid lg:grid-cols-[1.1fr_1fr] gap-24 items-center">

        <motion.div
          initial={{ opacity: 0, x: -60, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-primary font-semibold mb-4 tracking-wide">
            일정 생성 · 관리
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 leading-tight">
            자격증 일정 관리
          </h2>

          <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800 leading-snug">
            모든 자격증 시험 일정을
            <br />
            캘린더에서 한눈에
          </h3>

          <p className="text-gray-600 text-base lg:text-lg max-w-lg mb-10 leading-8">
            시험 접수일, 시험일, 결과 발표일까지 자격증 일정을 자동으로 정리합니다.
            <br />
            여러 자격증 시험 일정을 캘린더에서 한 번에 확인하세요.
          </p>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/calendar")}
            className="bg-primary text-lg lg:text-xl text-white mt-10 px-16 sm:px-24 lg:px-32 py-5 lg:py-6 rounded-full shadow-lg shadow-primary/20 transition"
          >
            일정 보러가기
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ y: -6 }}
          className="relative rounded-3xl transition"
        >
          {/* 캘린더 이미지 */}
          <div className="relative h-[520px] w-full">

            {/* 뒤쪽 카드 */}
            <div className="absolute right-10 top-10 z-10 w-[100%] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              {/* 카드 상단 느낌 */}
              <div className="mb-4 flex items-start gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="w-3 h-3 rounded-full bg-primary/25" />
                <span className="w-3 h-3 rounded-full bg-primary/15" />
              </div>

              <img
                src="/calendar_image_1.png"
                alt="캘린더 미리보기 1"
                className="w-full rounded-[20px] object-cover pb-3"
              />
            </div>

            {/* 앞쪽 카드 */}
            <div className="absolute left-50 top-90 z-20 w-[72%] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              <div className="mb-4 flex items-start gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="w-3 h-3 rounded-full bg-primary/25" />
                <span className="w-3 h-3 rounded-full bg-primary/15" />
              </div>
              <img
                src="/calendar_image_2.png"
                alt="캘린더 미리보기 2"
                className="w-full rounded-[20px] object-cover pb-3"
              />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}

export default SectionCalendar