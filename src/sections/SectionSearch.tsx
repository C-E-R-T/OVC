import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import SearchGridCard from "../components/common/cards/SearchGridCard";
import { useCertSearch } from "../hooks/useCertSearch";
import { useCategory } from "../hooks/useCategory";

function SectionSearch() {
  const [keyword] = useState("");
  const [categoryIds] = useState<number[]>([]);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useCertSearch({
    keyword,
    categoryIds,
    size: 6,
    sort: "name,ASC",
  });

  const { data: categoryData } = useCategory();

  const certs = searchData?.data?.content ?? [];
  const categories = categoryData?.data ?? [];
  const loopCerts = [...certs, ...certs];

  const getCategoryName = (categoryId: number) => {
    return categories.find((category) => category.id === categoryId)?.name ?? "";
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-white to-primarySoft/40">
      <div className="relative max-w-[1400px] mx-auto px-10 lg:px-20 w-full">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16"
        >
          <p className="text-primary font-semibold mb-4 tracking-wide">
            자격증 탐색
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            자격증 탐색
          </h2>

          <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800 leading-snug">
            어떤 자격증이 있는지 쉽게 찾아보세요
          </h3>

          <p className="text-gray-500 text-base lg:text-lg leading-8">
            IT, 경영, 어학 등 다양한 자격증 정보를 카테고리와 검색으로 빠르게 찾을 수 있습니다.
          </p>

          <p className="text-gray-500 text-base lg:text-lg leading-8">
            자격증 정보, 시험 일정, 설명까지 한 번에 확인하세요.
          </p>
        </motion.div>

        {/* 검색바 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20"
        >
          <div className="w-full rounded-full border border-primary/10 mb-30 px-8 py-5 flex items-center shadow-xl shadow-gray/10 bg-white/90">
            <input
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 outline-none text-base lg:text-lg"
              placeholder="ex) SQLD, 정보처리기사"
            />

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-gray-300 text-xl"
            >
              <Search size={18} />
            </motion.div>
          </div>
        </motion.div>

        {/* 카드 레일 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {isSearchLoading && (
            <div className="py-16 text-center text-gray-500">불러오는 중...</div>
          )}

          {isSearchError && (
            <div className="py-16 text-center text-red-500">
              데이터를 불러오지 못했습니다.
            </div>
          )}

          {!isSearchLoading && !isSearchError && certs.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              조건에 맞는 자격증이 없습니다.
            </div>
          )}

          {!isSearchLoading && !isSearchError && certs.length > 0 && (
            <div className="overflow-hidden">
              <motion.div
                className="flex w-max gap-8"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 150,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {loopCerts.map((item, index) => (
                  <motion.div
                    key={`${item.certId}-${index}`}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="min-w-[260px] shrink-0"
                  >
                    <SearchGridCard
                      certId={item.certId}
                      title={item.name}
                      category={getCategoryName(item.categoryId)}
                      description={item.description ?? ""}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default SectionSearch;