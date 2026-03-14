import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../../../api/favorite";

interface SearchGridCardProps {
  certId: number;
  title: string;
  category: string;
  description: string;
  onScheduleClick?: () => void;
}

function SearchGridCard({ certId, title, category, description, onScheduleClick }: SearchGridCardProps) {

  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: () => addFavorite(certId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert("찜 목록에 추가되었습니다.");
    },

    onError: (error: any) => {
      if (error?.response?.status === 409) {
        alert("이미 찜한 자격증입니다.");
      } else {
        alert("찜 추가에 실패했습니다,");
      }
    }
  });

  return (
    <div className="w-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* 상단 영역 */}
      <div className="p-6 flex items-start justify-between">
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
        <button
          onClick={() => {
            console.log("일정 보기 버튼 클릭");
            onScheduleClick?.();
          }}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition cursor-pointer"
        >
          일정 보기
        </button>

        <button
          onClick={() => {
            console.log("찜 버튼 클릭", certId);
            addFavoriteMutation.mutate()
          }}
          className="bg-green-100 text-green-900 px-5 py-2 rounded-full font-medium hover:bg-green-200 transition">
          내 찜에 추가
        </button>
      </div>
    </div>
  );
}

export default SearchGridCard;
