interface SearchListCardProps {
  title: string;
  category: string;
  description: string;
  onScheduleClick?: () => void;
}

function SearchListCard({
  title,
  category,
  description,
  onScheduleClick,
}: SearchListCardProps) {
  return (
    <div className="w-full flex bg-white overflow-hidden rounded-[28px] border border-[#ECE7D8]">
      {/* 좌측 영역 */}
      <div className="flex mr-auto items-center flex-1 min-w-0">
        {/* 제목 + 설명 */}
        <div className="pl-8 pr-6 py-8 w-full">
          <div className="flex flex-col gap-3">
            <span className="h-fit w-fit text-[#1A0089] bg-[#B8CE52] px-4 py-1.5 rounded-full text-sm font-semibold">
              {category}
            </span>

            <h3 className="text-[30px] font-bold text-[#0F172A] leading-tight break-keep">
              {title}
            </h3>

            <div className="h-[2px] w-[150px] rounded-full bg-[#1A0089]" />
            
          </div>

          <div className="pt-5">
            <p className="text-gray-500 text-base leading-relaxed break-keep">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 우측 영역 */}
      <div className="flex flex-col p-6 items-center justify-center bg-[#FFF9EC] border-l border-[#ECE7D8]">
        <button
          onClick={onScheduleClick}
          className="w-[160px] h-[50px] bg-[#FE5E32] text-white px-5 py-2 mb-3 rounded-xl font-semibold hover:bg-[#E9552C] transition"
        >
          상세 보기
        </button>

        <button className="w-[160px] h-[50px] bg-[#FFF3D6] text-[#6B5520] border border-[#E7DAB7] px-5 py-2 rounded-xl font-semibold hover:bg-[#F7E8C2] transition">
          내 찜에 추가
        </button>
      </div>
    </div>
  );
}

export default SearchListCard;