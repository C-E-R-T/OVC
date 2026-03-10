interface SearchGridCardProps {
  title: string;
  category: string;
  description: string;
}

function SearchGridCard({ title, category, description }: SearchGridCardProps) {
  return (
    <div className="w-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* 상단 영역 */}
      <div className="p-6 flex items-start justify-between">
        <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
          AWS
        </div>

        <p className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
          {category}
        </p>
      </div>

      {/* 제목 + 설명 */}
      <div className="h-[240px] px-6 pb-6 flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
          {title}
        </h3>

        <p className="text-gray-500 text-base pb-10 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="border-t bg-gray-50 border-gray-100 p-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-green-800 font-medium">
          일정 보기
        </button>

        <button className="bg-green-100 text-green-900 px-5 py-2 rounded-full font-medium hover:bg-green-200 transition">
          내 찜에 추가
        </button>
      </div>
    </div>
  );
}

export default SearchGridCard;
