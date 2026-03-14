import { CalendarDays, type LucideIcon } from "lucide-react";

//카드의 종류 정의
export const WISHLIST_CARD_TYPE = {
  APPLY: "APPLY",
  EXAM: "EXAM",
  RESULT: "RESULT",
} as const;

export type WishlistCardType =
//type에 들어올 수 있는 값의 범위를 제한(APPLY, EXAM, RESULT의 값만을 허용)
  typeof WISHLIST_CARD_TYPE[keyof typeof WISHLIST_CARD_TYPE];

interface MyWishlistCardProps {
  type: WishlistCardType;
  title: string;
  startDate: string;
  endDate: string;
  onClick?: () => void;
  onDelete?: () => void;
}

interface WishlistCardConfig {
  label: string;
  badgeClassName: string;
  datePrefix: string;
  buttonText?: string;
  icon: LucideIcon;
}

//카드 타입에 따라 표시되는 UI 정보 저장
const WISHLIST_CARD_CONFIG: Record<WishlistCardType, WishlistCardConfig> = {
  APPLY: {
    label: "시험신청일",
    badgeClassName: "bg-blue-500 text-white",
    datePrefix: "시험신청일",
    buttonText: "시험 신청하러가기",
    icon: CalendarDays,
  },
  EXAM: {
    label: "시험일",
    badgeClassName: "bg-emerald-600 text-white",
    datePrefix: "시험일",
    buttonText: "수험표 확인",
    icon: CalendarDays,
  },
  RESULT: {
    label: "시험발표일",
    badgeClassName: "bg-violet-600 text-white",
    datePrefix: "시험발표일",
    buttonText: "결과 확인",
    icon: CalendarDays,
  },
};

//시간 제거하는 함수 -> 날짜만 표시되도록
function toDateOnly(dateString: string) {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

//startDate와 endDate가 같으면 일정을 기간이 아닌 하루로 표시
function formatDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) return startDate;
  return `${startDate} - ${endDate}`;
}

//디데이 표시하는 함수
function getDayStatus(startDate: string, endDate: string) {
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  const isTodayInRange = todayOnly >= start && todayOnly <= end;

  if (isTodayInRange) {
    return { text: "D-day", className: "text-red-500" };
  }

  if (todayOnly < start) {
    const diffMs = start.getTime() - todayOnly.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return { text: `D-${diffDays}`, className: "text-green-500" };
  }

  return { text: "마감", className: "text-slate-400" };
}

const MyWishlistCard = ({
  type,
  title,
  startDate,
  endDate,
  onClick,
  onDelete,
}: MyWishlistCardProps) => {

  //카드 타입에 맞는 설정을 가져옴
  const config = WISHLIST_CARD_CONFIG[type];
  const dayStatus = getDayStatus(startDate, endDate);
  const Icon = config.icon;

  return (
    <article
      className="
      relative
      w-full
      max-w-[460px]
      rounded-2xl
      border
      border-slate-200
      bg-gradient-to-br
      from-white
      to-slate-50
      p-8
      shadow-sm
      transition
      hover:-translate-y-1
      hover:shadow-xl
      "
    >

      {/* 삭제 버튼 */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-6 right-6 h-8 w-8 rounded-full bg-red-600 text-sm font-bold text-white hover:bg-red-700"
        >
          X
        </button>
      )}

      {/* 상단 */}
      <div className="flex items-start mb-6 gap-3">

        <span
          className={`
          px-4
          py-2
          text-sm
          font-semibold
          rounded-full
          ${config.badgeClassName}
          `}
        >
          {config.label}
        </span>

        <span className={`text-xl font-extrabold ${dayStatus.className}`}>
          {dayStatus.text}
        </span>

      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-slate-900 leading-tight">
        {title}
      </h2>

      {/* 날짜 */}
      <div className="flex items-center gap-3 mt-6 text-slate-500">

        <Icon className="h-5 w-5" />

        <span className="text-base">
          {config.datePrefix} : {formatDateRange(startDate, endDate)}
        </span>

      </div>

      {/* 버튼 */}
      {config.buttonText && (
        <button
          type="button"
          onClick={onClick}
          className="
          mt-8
          w-full
          rounded-xl
          bg-green-700
          py-3
          font-semibold
          text-white
          transition
          hover:bg-green-800
          hover:shadow-md
          active:scale-[0.98]
          "
        >
          {config.buttonText}
        </button>
      )}

    </article>
  );
};

export default MyWishlistCard;