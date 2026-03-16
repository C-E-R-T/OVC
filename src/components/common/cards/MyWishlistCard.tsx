import { CalendarDays, type LucideIcon } from "lucide-react";

// 카드의 종류 정의
export const WISHLIST_CARD_TYPE = {
  APPLY: "APPLY",
  EXAM: "EXAM",
  RESULT: "RESULT",
} as const;

export type WishlistCardType =
  typeof WISHLIST_CARD_TYPE[keyof typeof WISHLIST_CARD_TYPE];

interface MyWishlistCardProps {
  type: WishlistCardType;
  title: string;
  startDate: string;
  endDate: string;
  activeStatuses?: WishlistCardType[];
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

// 카드 타입에 따라 표시되는 UI 정보 저장
const WISHLIST_CARD_CONFIG: Record<WishlistCardType, WishlistCardConfig> = {
  APPLY: {
    label: "시험신청일",
    badgeClassName: "bg-primarySoft text-gray border border-primary/10",
    datePrefix: "시험신청일",
    buttonText: "시험 신청하러가기",
    icon: CalendarDays,
  },
  EXAM: {
    label: "시험일",
    badgeClassName: "bg-primarySoft text-red border border-primary/10",
    datePrefix: "시험일",
    buttonText: "수험표 확인",
    icon: CalendarDays,
  },
  RESULT: {
    label: "시험발표일",
    badgeClassName: "bg-primarySoft text-blue border border-primary/10",
    datePrefix: "시험발표일",
    buttonText: "결과 확인",
    icon: CalendarDays,
  },
};

//시간 제거하는 함수 -> 날짜만 표시되도록
function toDateText(dateString: string) {
  // UTC 파싱 오차를 피하기 위해 문자열 기준으로 날짜만 잘라 사용
  return dateString.split("T")[0];
}

function toDateOnly(dateString: string) {
  const [year, month, day] = toDateText(dateString).split("-").map(Number);
  return new Date(year, month - 1, day);
}

// startDate와 endDate가 같으면 일정을 기간이 아닌 하루로 표시
function formatDateRange(startDate: string, endDate: string) {
  const start = toDateText(startDate);
  const end = toDateText(endDate);
  if (start === end) return start;
  return `${start} - ${end}`;
}

// 디데이 표시하는 함수
function getDayStatus(startDate: string, endDate: string) {
  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  const isTodayInRange = todayOnly >= start && todayOnly <= end;

  if (isTodayInRange) {
    return { text: "D-day", className: "text-red font-bold" };
  }

  if (todayOnly < start) {
    const diffMs = start.getTime() - todayOnly.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return { text: `D-${diffDays}`, className: "text-primary font-semibold" };
  }

  return { text: "마감", className: "text-gray-400" };
}

const MyWishlistCard = ({
  type,
  title,
  startDate,
  endDate,
  activeStatuses = [],
  onClick,
  onDelete,
}: MyWishlistCardProps) => {
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
        border-gray-100
        bg-white
        p-8
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {onDelete && (
        <button
          onClick={onDelete}
          className="
            absolute
            top-6
            right-6
            h-8
            w-8
            rounded-full
            border
            border-gray-200
            bg-white
            text-sm
            font-bold
            text-gray-500
            transition
            hover:bg-gray-50
            hover:text-gray-700
          "
        >
          X
        </button>
      )}

<!--       <div className="mb-6 flex items-start gap-3">
        <span
          className={`
            rounded-full
            px-4
            py-2
            text-sm
            font-semibold
            ${config.badgeClassName}
          `}
        >
<!--           {config.label} -->
<!--  </span> -->
      {/* 상단 */}
      <div className="flex items-start mb-6 gap-3 flex-wrap">
        {/* 진행 중 상태가 여러 개면 배지를 모두 노출, 아니면 대표 타입만 노출 */}
        {(activeStatuses.length > 1 ? activeStatuses : [type]).map((status) => {
          const statusConfig = WISHLIST_CARD_CONFIG[status];
          return (
            <span
              key={status}
              className={`
              px-4
              py-2
              text-sm
              font-semibold
              rounded-full
              ${statusConfig.badgeClassName}
              `}
            >
              {statusConfig.label}
            </span>
          );
        })}

        <span className={`text-xl font-extrabold ${dayStatus.className}`}>
          {dayStatus.text}
        </span>
      </div>

      <h2 className="text-2xl font-bold leading-tight text-gray-900">
        {title}
      </h2>

      <div className="mt-6 flex items-center gap-3 text-gray-500">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-base">
          {config.datePrefix} : {formatDateRange(startDate, endDate)}
        </span>
      </div>

      {config.buttonText && (
        <button
          type="button"
          onClick={onClick}
          className="
            mt-8
            w-full
            rounded-xl
            bg-gray-900
            py-3
            font-semibold
            text-white
            transition
            hover:bg-primaryDark
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
