import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion"
import { getMyInfo } from "../api/user";
import { useNavigate } from "react-router-dom";

function SectionCTA() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false,
  });

  const isLoggedIn = !!user;

  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-primarySoft/40 to-primarySoft">
      <div className="max-w-[1400px] mx-auto px-10 lg:px-20 w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-primary font-semibold mb-6 tracking-wide"
        >
          GET STARTED
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl lg:text-6xl font-bold mb-8 text-gray-900 leading-tight"
        >
          지금 OVC로 시작하세요
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          viewport={{ once: true }}
          className="text-gray-600 text-lg lg:text-xl mb-12 leading-8"
        >
          자격증 준비의 모든 과정을
          <br className="hidden sm:block" />
          하나의 플랫폼에서 관리하세요.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isLoading) return;
            navigate(isLoggedIn ? "/mypage" : "/login");
          }}
          className="bg-primary text-lg lg:text-xl text-white font-semibold mt-10 px-16 sm:px-24 lg:px-32 py-5 lg:py-6 rounded-full transition"
        >
          시작하기
        </motion.button>
      </div>
    </section>
  )
}

export default SectionCTA