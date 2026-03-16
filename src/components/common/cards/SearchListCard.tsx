import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../../../api/favorite";

interface SearchListCardProps {
  certId: number;
  title: string;
  category: string;
  description: string;
  onScheduleClick?: () => void;
}

function SearchListCard({
  certId,
  title,
  category,
  description,
  onScheduleClick,
}: SearchListCardProps) {
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
    <div className="group flex w-full overflow-hidden rounded-[30px] border border-white/70 bg-white/72 shadow-[0_10px_32px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      {/* 좌측 영역 */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="w-full px-8 py-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex h-fit w-fit items-center rounded-full border border-primary/10 bg-primarySoft/70 px-4 py-2 text-xs font-semibold text-gray shadow-sm">
              {category}
            </span>

            <h3 className="break-keep text-[30px] font-bold leading-tight tracking-tight text-gray-900">
              {title}
            </h3>

            <div className="mt-4 h-[1px] w-42 rounded-full bg-black" />

          </div>

          <div className="pt-5">
            <p className="break-keep text-[15px] leading-7 text-gray-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 우측 영역 */}
      <div className="flex flex-col items-center justify-center border-l border-white/70 bg-white/35 px-6 py-6 backdrop-blur-md">
        <button
          onClick={onScheduleClick}
          className="mb-3 h-[50px] w-[160px] rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primaryDark"
        >
          상세 보기
        </button>

        <button
          onClick={() => {
            addFavoriteMutation.mutate();
          }}
          className="h-[50px] w-[160px] rounded-full border border-primary/10 bg-primarySoft/65 px-5 py-2 text-sm font-semibold text-gray-800 transition hover:bg-primarySoft"
        >
          내 찜에 추가
        </button>
      </div>
    </div>
  );
}

export default SearchListCard;