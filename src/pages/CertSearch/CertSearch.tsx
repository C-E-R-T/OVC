import { useState } from "react";
import SearchGridCard from "../../components/common/cards/SearchGridCard";
import SearchListCard from "../../components/common/cards/SearchListCard";
import { Search } from "lucide-react";
import { useCertSearch } from "../../hooks/useCertSearch";
import { useCategory } from "../../hooks/useCategory";
import CertDetailModal from "../../components/common/modal/CertDetailModal";

function CertSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [viewType, setViewType] = useState("grid");

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [keyword, setKeyword] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useCertSearch({
    keyword,
    categoryIds,
    page,
    size: 6,
    sort: "name,ASC",
  });

  const certs = searchData?.data.content ?? [];

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategory();

  const categories = categoryData?.data ?? [];

  const getCategoryName = (categoryId: number) => {
    return categories.find((category) => category.id === categoryId)?.name ?? "";
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleOpenModal = (certId: number) => {
    setSelectedCertId(certId);
    setIsModalOpen(true);
  };

  //input에 입력했던것으로 검색에 적용할 겁니다.
  const handleSearch = () => {
    setKeyword(searchInput);
    setCategoryIds(selectedCategories);
    setPage(0);
  };

  const totalPages = searchData?.data.totalPages ?? 0;
  const currentPage = searchData?.data.currentPage ?? 0;
  const isFirst = searchData?.data.isFirst ?? true;
  const isLast = searchData?.data.isLast ?? true;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  const handlePrevPage = () => {
    if (!isFirst) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLast) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <div className="min-h-screen px-6 pb-12 pt-30">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* 상단 영역 */}
        <section className="mb-4 p-8">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-black">
                SEARCH
              </p>
              <h1 className="pb-2 text-4xl font-bold tracking-tight text-gray-900">
                자격증 탐색
              </h1>
              <p className="text-base leading-7 text-gray-500">
                커리어를 한 단계 높여줄 최적의 자격증을 리스트에서 확인해보세요.
              </p>
            </div>
    <div className="flex">
      {/* 좌측 - 사이드바 영역 */}
      <div className="w-[420px] shrink-0 min-h-screen bg-[#FFF9EC] border-r border-[#ECE7D8] p-8 animate-slideIn">
        <div className="pb-6 border-b border-[#ECE7D8]">
          <h3 className="font-semibold text-[22px] text-[#1A0089]">카테고리</h3>
          <p className="mt-2 text-sm text-[#6B7280]">
            원하는 분야를 선택해서 자격증을 찾아보세요.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-6">
          {isCategoryLoading && (
            <p className="text-sm text-gray-500">카테고리 불러오는 중...</p>
          )}

          {isCategoryError && (
            <p className="text-sm text-red-500">
              카테고리를 불러오지 못했습니다.
            </p>
          )}

          {!isCategoryLoading &&
            !isCategoryError &&
            categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);

              return (
                <label
                  key={category.id}
                  className={`flex items-center gap-4 cursor-pointer px-3 py-5 rounded-xl transition ${
                    isSelected
                      ? "bg-[#FFF3D6] border border-[#E7DAB7]"
                      : "hover:bg-[#FFF3D6]/60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-5 h-5 accent-[#1A0089]"
                  />

                  <span
                    className={`text-base ${
                      isSelected
                        ? "text-[#1A0089] font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                </label>
              );
            })}
        </div>
      </div>

            <div className="inline-flex h-fit gap-2 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <button
                onClick={() => setViewType("grid")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${viewType === "grid"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                  }`}
              >
                그리드
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${viewType === "list"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                  }`}
              >
                리스트
              </button>
            </div>
          </div>

          {/* 검색바 */}
          <div className="mb-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
            <input
              className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
              type="text"
              placeholder="자격증 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white transition hover:scale-105 hover:bg-primaryDark"
          <div className="flex h-fit p-2 bg-gray-100 rounded-lg gap-2">
            <button
              onClick={() => setViewType("grid")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                viewType === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              그리드
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                viewType === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <Search size={18} />
            </button>
          </div>

          {/* 카테고리 필터 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-gray-700">
                CATEGORY
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>

            {isCategoryLoading && (
              <p className="text-sm text-gray-500">카테고리 불러오는 중...</p>
            )}

            {isCategoryError && (
              <p className="text-sm text-red-500">
                카테고리를 불러오지 못했습니다.
              </p>
            )}

            {!isCategoryLoading && !isCategoryError && (
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);

                  return (
                    <label
                      key={category.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-full px-4 py-3 transition backdrop-blur-md ${isSelected
                          ? "border border-white/70 bg-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                          : "border border-transparent bg-white/35 hover:border-white/60 hover:bg-white/55"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span
                        className={`text-sm transition ${isSelected
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                          }`}
                      >
                        {category.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 카드 영역 */}
        <section className="rounded-[32px] backdrop-blur-xl">
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
            <>
              {viewType === "grid" && (
                <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                  {certs.map((item) => (
                    <div key={item.certId} className="w-full">
                      <SearchGridCard
                        certId={item.certId}
                        title={item.name}
                        category={getCategoryName(item.categoryId)}
                        description={item.description ?? ""}
                        onScheduleClick={() => handleOpenModal(item.certId)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {viewType === "list" && (
                <div className="space-y-4">
                  {certs.map((item) => (
                    <SearchListCard
                      key={item.certId}
                      certId={item.certId}
                      title={item.name}
                      category={getCategoryName(item.categoryId)}
                      description={item.description ?? ""}
                      onScheduleClick={() => handleOpenModal(item.certId)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={isFirst}
                className="min-w-[72px] rounded-full border border-primary/10 bg-primarySoft/60 px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-primarySoft disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전
              </button>

              <div className="flex items-center gap-2">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    className={`h-11 w-11 rounded-full text-sm font-semibold transition ${currentPage === pageNumber
                        ? "bg-gray-900 text-white shadow-sm"
                        : "border border-white/70 bg-white/70 text-gray-700 hover:bg-primarySoft/60"
                      }`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={isLast}
                className="min-w-[72px] rounded-full border border-primary/10 bg-primarySoft/60 px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-primarySoft disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </section>

        <CertDetailModal
          isOpen={isModalOpen}
          certId={selectedCertId}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default CertSearch;