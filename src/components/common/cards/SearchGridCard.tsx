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
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-[30px] border border-white/70 bg-white/72 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_46px_rgba(15,23,42,0.10)]">
      {/* 상단 */}
      <div className="px-6 pt-6">
        <span className="inline-flex items-center rounded-full border border-primary/10 bg-primarySoft/70 px-4 py-2 text-xs font-semibold tracking-tight text-grayshadow-sm">
          {category}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex min-h-[240px] flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className="break-keep text-[30px] font-bold leading-[1.2] tracking-tight text-gray-900">
          {title}
        </h3>

        <div className="mt-4 h-[1px] w-42 rounded-full bg-black" />

        <p className="mt-5 line-clamp-4 break-keep text-[15px] leading-7 text-gray-500">
          {description}
        </p>
      </div>

      {/* 하단 */}
      <div className="border-t border-white/70 bg-white/35 px-6 py-5 backdrop-blur-md">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              addFavoriteMutation.mutate();
            }}
            className="h-[50px] w-[160px] rounded-full border border-primary/10 bg-primarySoft/65 text-sm font-semibold text-gray-800 transition hover:bg-primarySoft disabled:opacity-60"
          >
            내 찜에 추가
          </button>

          <button
            onClick={() => {
              onScheduleClick?.();
            }}
            className="h-[50px] w-[160px] rounded-full bg-gray-900 text-sm font-semibold text-white transition hover:bg-primaryDark"
          >
            상세 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchGridCard;