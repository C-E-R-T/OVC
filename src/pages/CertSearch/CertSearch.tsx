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

  const { data: searchData, isLoading:isSearchLoading, isError:isSearchError, } = useCertSearch({
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
    <div className="flex flex-row">
      {/* 좌측 - 사이드바 영역 */}
      <div className="w-[320px] h-auto p-[50px] bg-green-100">
        <h3 className="font-medium text-lg mb-6">카테고리</h3>
        <div className="space-y-4">
          {isCategoryLoading && <p>카테고리 불러 오는 중...</p>}
          {isCategoryError && <p>카테고리를 불러오지 못했습니다.</p>}

          {!isCategoryLoading &&
            !isCategoryError &&
            categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
        </div>
      </div>
      {/* 우측 - 카드 영역 */}
      <div className="flex-1 p-8">
        <div className="flex justify-between">
          <div>
            <h1 className="font-semibold text-4xl pb-2">자격증 탐색</h1>
            <p className="pb-5">
              커리어를 한 단계 높여줄 최적의 자격증을 리스트에서 확인해보세요.
            </p>
          </div>
          <div className="flex h-fit p-2 bg-gray-100 rounded-lg gap-4 mb-6">
            <button
              onClick={() => {
                setViewType("grid");
              }}
              className="px-4 h-fit rounded-lg  hover:bg-gray-300 transition font-medium"
            >
              그리드
            </button>
            <button
              onClick={() => {
                setViewType("list");
              }}
              className="px-4  h-fit rounded-lg hover:bg-gray-300 transition font-medium"
            >
              리스트
            </button>
          </div>
        </div>
        <div className="flex w-full border border-black-200 justify-between px-6 py-5 rounded-xl mb-[24px] gap-2">
          <input
            className="w-full outline-none"
            type="text"
            placeholder="자격증 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="p-2 rounded hover:bg-gray-200 transition"
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
          <div className="flex flex-wrap gap-x-6 gap-y-6 w-full">
            {certs.map((item) => {
              return (
                <div
                  key={item.certId}
                  onClick={() => handleOpenModal(item.certId)}
                >
                  <SearchGridCard
                    title={item.name}
                    category={getCategoryName(item.categoryId)}
                    description={item.description ?? ""}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 필터아이템의 길이가 0보다 클때 리스트화 */}
        {viewType === "list" && (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            {certs.map((item, index) => {
              const isLast = index === certs.length - 1;

              return (
                // 리스트를 감싸는 div
                <div
                  key={item.certId}
                  //리스트의 마지막
                  className={`p-2 ${!isLast ? "border-b border-gray-200" : ""}`}
                  onClick={() => handleOpenModal(item.certId)}
                >
                  <SearchListCard
                    title={item.name}
                    category={getCategoryName(item.categoryId)}
                    description={item.description ?? ""}
                  />
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={isFirst}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              이전
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`px-3 py-2 border rounded ${
                  currentPage === pageNumber
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {pageNumber + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={isLast}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              다음
            </button>
          </div>
        )}
      </div>
      <CertDetailModal
        isOpen={isModalOpen}
        certId={selectedCertId}
        onClose={()=>setIsModalOpen(false)}
        />

    </div>
  );
}

export default CertSearch;
