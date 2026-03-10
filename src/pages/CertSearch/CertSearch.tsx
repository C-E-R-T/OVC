import { useState } from "react";
import SearchGridCard from "../../components/common/cards/SearchGridCard";
import SearchListCard from "../../components/common/cards/SearchListCard";
import { Search } from "lucide-react";

type Item = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const items: Item[] = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    category: "IT/기술",
    description: "AWS 기술을 활용한 클라우드 설계 자격증",
  },
  {
    id: 2,
    title: "CISSP",
    category: "경영/비즈니스",
    description: "보안 관리자 및 엔지니어를 위한 자격증",
  },
  {
    id: 3,
    title: "Google Associate Cloud Engineer",
    category: "금융/회계",
    description: "GCP 환경에서 인프라를 관리하는 기본 능력 평가",
  },
];

const categories = ["IT/기술", "경영/비즈니스", "금융/회계", "외국어"];

function CertSearch() {
  const [viewType, setViewType] = useState("grid");

  //입력 중인 값(검색창에 입력한 값)(단순입력)
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  //실제 검색에 적용된 값(엔터를 눌렀을 경우나 검색버튼을 클릭했을때 적용되는 값)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  //input에 입력했던것으로 검색에 적용할 겁니다.
  const handleSearch = () => {
    setAppliedSearch(searchInput);
    setAppliedCategories(selectedCategories);
  };

  //카테고리를 하나도 안 체크하면 전체 허용
  //체크된 카테고리가 있으면 해당 카테고리만 허용
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      appliedCategories.length === 0 ||
      appliedCategories.includes(item.category);

    //검색어는 제목 | 설명으로도 검색가능
    const matchesSearch =
      item.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(appliedSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-row">
      {/* 좌측 - 사이드바 영역 */}
      <div className="w-[320px] h-screen p-[50px] bg-green-100">
        <h3 className="font-medium text-lg mb-6">카테고리</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-5 h-5 accent-green-600"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="text-gray-700 font-medium">{category}</span>
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

        {/* 필터된 애가 없으면 */}
        {filteredItems.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            조건에 맞는 자격증이 없습니다.
          </div>
        )}

        {/* 필터아이템의 길이가 0보다 클때 그리드화 */}
        {viewType === "grid" && filteredItems.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-6 w-full">
            {filteredItems.map((item) => {
              return (
                <div key={item.id}>
                  <SearchGridCard
                    title={item.title}
                    category={item.category}
                    description={item.description}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 필터아이템의 길이가 0보다 클때 리스트화 */}
        {viewType === "list" && filteredItems.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            {filteredItems.map((item, index) => {
              const isLast = index === filteredItems.length - 1;

              return (
                // 리스트를 감싸는 div
                <div
                  key={item.id}
                  //리스트의 마지막
                  className={`p-2 ${!isLast ? "border-b border-gray-200" : ""}`}
                >
                  <SearchListCard
                    title={item.title}
                    category={item.category}
                    description={item.description}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CertSearch;
