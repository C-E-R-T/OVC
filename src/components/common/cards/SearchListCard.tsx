interface SearchListCardProps {
  title: string;
  category: string;
  description: string;
}

function SearchListCard({ title, category, description }: SearchListCardProps) {
  return (
    <div className="w-full flex bg-white overflow-hidden">
      {/* 좌측 영역 */}
      <div className="flex mr-auto items-center">
        <div className="pl-6 flex items-start justify-between">
          <div className="w-18 h-18 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
            CISSP
          </div>
        </div>

        {/* 제목 + 설명 */}
        <div className="pl-6">
          <div className="flex-row flex flex-col gap-3">
            <h3 className="text-2xl pb-3 font-bold text-gray-900 leading-tight">
              {title}
            </h3>
            <span className="h-fit text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 우측 영역 */}
      <div className="flex flex-col border-gray-100 p-4 flex items-center">
        <button className="w-[160px] h-[50px] bg-green-700 text-gray-100 px-5 py-2 mb-2 rounded-lg font-medium hover:bg-green-200 transition">
          일정 보기
        </button>

        <button className="w-[160px] h-[50px] bg-gray-100 text-green-900 px-5 py-2 rounded-lg font-medium hover:bg-green-200 transition">
          내 찜에 추가
        </button>
      </div>
    </div>
  );
}

export default SearchListCard;
