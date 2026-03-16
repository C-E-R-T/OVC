import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../../../api/favorite";

interface SearchGridCardProps {
  certId: number;
  title: string;
  category: string;
  description: string;
  onScheduleClick?: () => void;
}

function SearchGridCard({
  certId,
  title,
  category,
  description,
  onScheduleClick,
}: SearchGridCardProps) {
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
        alert("찜 추가에 실패했습니다.");
      }
    },
  });

  return (
    <div className="w-full h-full rounded-[28px] border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      {/* 상단 */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <span className="inline-flex items-center rounded-full border border-[#B8CE52] bg-[#B8CE52] px-3 py-1 text-sm font-semibold text-[#1A0089]">
          {category}
        </span>
      </div>

      {/* 본문 */}
      <div className="px-6 pb-6 min-h-[220px] flex flex-col">
        <h3 className="text-[30px] font-bold text-gray-900 leading-[1.2] break-keep">
          {title}
        </h3>

        <div className="mt-4 h-[2px] w-21 rounded-full bg-[#1A0089]" />

        <p className="mt-5 text-[15px] leading-7 text-gray-500 break-keep">
          {description}
        </p>
      </div>

      {/* 하단 */}
      <div className="border-t border-[#f1e5c8] bg-[#fffaf0] px-6 py-5 flex justify-end gap-3">
        <button
          onClick={() => {
            addFavoriteMutation.mutate();
          }}
          className="w-[160px] h-[50px] rounded-xl border border-[#eadcb7] bg-[#FFF3D6] text-[#5b4a1f] font-semibold hover:bg-[#f8e8c4] transition"
        >
          내 찜에 추가
        </button>

        <button
          onClick={() => {
            onScheduleClick?.();
          }}
          className="w-[160px] h-[50px] rounded-xl bg-[#FE5E32] text-white font-semibold hover:bg-[#e45127] transition"
        >
          상세 보기
        </button>
      </div>
    </div>
  );
}

export default SearchGridCard;