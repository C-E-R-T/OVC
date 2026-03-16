import { useState } from "react";
import SearchGridCard from "../../components/common/cards/SearchGridCard";
import SearchListCard from "../../components/common/cards/SearchListCard";
import { Search } from "lucide-react";
import { useCertSearch } from "../../hooks/useCertSearch";
import { useCategory } from "../../hooks/useCategory";
import CertDetailModal from "../../components/common/modal/CertDetailModal";

function CertSearch() {
  //모달이 열렸다.닫혔다
  const [isModalOpen, setIsModalOpen] = useState(false);
  //상세조회용 변수
  const [selectedCertId, setSelectedCertId] = useState<number | null>(null);

  //페이지네이션
  const [page, setPage] = useState(0);
  //그리드로 볼건지 리스트로 볼건지
  const [viewType, setViewType] = useState("grid");

  //입력 중인 값(검색창에 입력한 값)(단순입력)
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  //실제 검색에 적용된 값(엔터를 눌렀을 경우나 검색버튼을 클릭했을때 적용되는 값)
  const [keyword, setKeyword] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useCertSearch({
    keyword, //검색어
    categoryIds, //카테고리 ids
    page, //1페이지
    size: 10, //한페이지에 10개
    sort: "name,ASC", //이름을 기준으로 오름차순
  });

  //api로 가져온 애들 null일 경우 빈배열
  const certs = searchData?.data.content ?? [];

  //카테고리를 가져오는 hooks
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategory();

  const categories = categoryData?.data ?? [];

  //카테고리 id를 이용해서 카테고리 이름을 찾아오는 함수
  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((category) => category.id === categoryId)?.name ?? ""
    );
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
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
    setPage(0); //검색 조건 바뀌면 페이지는 1페이지로
  };

  const totalPages = searchData?.data.totalPages ?? 0;
  const currentPage = searchData?.data.currentPage ?? 0;
  const isFirst = searchData?.data.isFirst ?? true;
  const isLast = searchData?.data.isLast ?? true;

  //totalPages = 5일 때
  //pageNumbers = [0,1,2,3,4]
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

      {/* 우측 - 카드 영역 */}
      <div className="flex-1 min-w-0 p-8">
        <div className="flex justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="font-semibold text-4xl pb-2">자격증 탐색</h1>
            <p className="text-gray-600">
              커리어를 한 단계 높여줄 최적의 자격증을 리스트에서 확인해보세요.
            </p>
          </div>

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
              리스트
            </button>
          </div>
        </div>

        <div className="flex w-full border border-gray-300 justify-between px-6 py-5 rounded-xl mb-6 gap-2">
          <input
            className="w-full outline-none"
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
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <Search size={20} />
          </button>
        </div>

        {isSearchLoading && <div>불러오는 중...</div>}
        {isSearchError && <div>데이터를 불러오지 못했습니다.</div>}
        {!isSearchLoading && !isSearchError && certs.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            조건에 맞는 자격증이 없습니다.
          </div>
        )}

        {viewType === "grid" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
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
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            {certs.map((item, index) => {
              const isLastItem = index === certs.length - 1;

              return (
                <div
                  key={item.certId}
                  className={`p-2 ${!isLastItem ? "border-b border-gray-200" : ""}`}
                >
                  <SearchListCard
                    certId={item.certId}
                    title={item.name}
                    category={getCategoryName(item.categoryId)}
                    description={item.description ?? ""}
                    onScheduleClick={() => handleOpenModal(item.certId)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 페이지네이션 부분 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={isFirst}
              className="min-w-[72px] px-4 py-2.5 rounded-xl border border-[#E7DAB7] bg-[#FFF3D6] text-[#6B5520] font-semibold hover:bg-[#F7E8C2] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              이전
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`w-11 h-11 rounded-xl text-sm font-semibold transition ${
                    currentPage === pageNumber
                      ? "bg-[#1A0089] text-white shadow-sm"
                      : "bg-white border border-[#ECE7D8] text-[#1A0089] hover:bg-[#FFF3D6]"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={isLast}
              className="min-w-[72px] px-4 py-2.5 rounded-xl border border-[#E7DAB7] bg-[#FFF3D6] text-[#6B5520] font-semibold hover:bg-[#F7E8C2] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>

      <CertDetailModal
        isOpen={isModalOpen}
        certId={selectedCertId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default CertSearch;
