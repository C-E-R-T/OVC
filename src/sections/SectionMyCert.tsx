import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function SectionMyCert() {

  const navigate=useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-primarySoft/40 via-white to-white">
      {/* background decoration */}
      <div className="relative max-w-[1400px] mx-auto px-10 lg:px-20 w-full grid lg:grid-cols-[1.1fr_1fr] items-center">
        <motion.div
          initial={{ opacity: 0, x: -60, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-primary font-semibold mb-4 tracking-wide">
            MY CERTIFICATIONS
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 leading-tight">
            나의 자격증 관리
          </h2>

          <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800 leading-snug">
            취득한 자격증과 목표 자격증을 관리하고 
            <br/>인기 자격증 랭킹을 확인하세요
          </h3>

          <p className="text-gray-600 text-base lg:text-lg max-w-lg mb-10 leading-8">
            이미 취득한 자격증과 앞으로 취득하고 싶은 자격증을
            관리할 수 있습니다.
            <br />
            자격증 준비 현황을 확인하고,
            사람들이 많이 찜한 자격증 랭킹도 살펴보며
            목표를 체계적으로 관리하세요.
          </p>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={()=>navigate("/cert-manage")}
            className="bg-primary text-lg lg:text-xl text-white mt-10 px-16 sm:px-24 lg:px-32 py-5 lg:py-6 rounded-full shadow-lg shadow-primary/20 transition"
          >
            내 자격증 보기
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-2 gap-6"
        >






          {/* 캘린더 이미지 */}
          <div className="relative h-[520px] w-full">

            {/* 뒤쪽 카드 */}
            <div className="absolute left-10 top-0 z-10 w-[200%] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              {/* 카드 상단 느낌 */}
              <div className="mb-4 flex items-start gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="w-3 h-3 rounded-full bg-primary/25" />
                <span className="w-3 h-3 rounded-full bg-primary/15" />
              </div>

              <img
                src="/mycert_image_1.png"
                alt="캘린더 미리보기 1"
                className="w-full rounded-[8px] object-cover pb-3"
              />
            </div>

            {/* 앞쪽 카드 */}
            <div className="absolute left-00 top-60 z-20 w-[190%] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              <div className="mb-4 flex items-start gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="w-3 h-3 rounded-full bg-primary/25" />
                <span className="w-3 h-3 rounded-full bg-primary/15" />
              </div>
              <img
                src="/mycert_image_2.png"
                alt="캘린더 미리보기 2"
                className="w-full rounded-[8px] object-cover pb-3"
              />
            </div>
          </div>











        </motion.div>
      </div>
    </section>
  )
}

export default SectionMyCert