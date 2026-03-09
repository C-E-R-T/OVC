import { CalendarDays, type LucideIcon } from "lucide-react";

export const WISHLIST_CARD_TYPE = {
  APPLY: "APPLY",
  EXAM: "EXAM",
  RESULT: "RESULT",
} as const; // as const로 인해 enum타입으로 선언 가능.

export type WishlistCardType =
  typeof WISHLIST_CARD_TYPE[keyof typeof WISHLIST_CARD_TYPE]; //Map처럼 키밸류값 사용

interface MyWishlistCardProps {
  type: WishlistCardType;
  title: string;
  startDate: string;
  endDate: string;
  onClick?: () => void;
}

interface WishlistCardConfig {
  label: string;
  badgeClassName: string;
  datePrefix: string;
  buttonText?: string;
  icon: LucideIcon;// import type LucideIcon으로 가져온 타입
}

const WISHLIST_CARD_CONFIG: Record<WishlistCardType, WishlistCardConfig> = {
    //wishlist_card_type에 속한 객체
  APPLY: {
    label: "시험신청일",
    badgeClassName: "bg-blue-500 text-base text-white",
    datePrefix: "시험신청일:",
    buttonText: "시험 신청하러가기",
    icon: CalendarDays,
  },
  EXAM: {
    label: "시험일",
    badgeClassName: "bg-emerald-700 text-base text-white",
    datePrefix: "시험일:",
    buttonText: "수험표 확인",
    icon: CalendarDays,
  },
  RESULT: {
    label: "시험발표일",
    badgeClassName: "bg-violet-600 text-base text-white",
    datePrefix: "시험발표일:",
    icon: CalendarDays,
  },
};


//백에서 date를 string으로 받는데 그것을 Date 타입으로 변경
function toDateOnly(dateString: string) {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

//기간을 구해주는 함수
function formatDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) return startDate;
  return `${startDate} - ${endDate}`;
}

//날짜를 가져와서 css와 D-day를 선언해줄거에요
function getDayStatus(startDate: string, endDate: string) {
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  const isTodayInRange = todayOnly >= start && todayOnly <= end;

  //오늘이 시험신청일/시험일/시험발표일일 경우 아래와 같이 반환
  if (isTodayInRange) {
    return {
      text: "D-day",
      className: "text-red-500",
    };
  }

  if (todayOnly < start) {
    const diffMs = start.getTime() - todayOnly.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      text: `D-${diffDays}`,
      className: "text-slate-400",
    };
  }

  return {
    text: "마감",
    className: "text-slate-400",
  };
}

const MyWishlistCard = ({
  type,
  title,
  startDate,
  endDate,
  onClick,
}: MyWishlistCardProps) => {
    //시험신청일,시험일,시험발표일에 따라 들어가야 하는 값이 다르기에 해당 내용을 config에 저장
  const config = WISHLIST_CARD_CONFIG[type];
  const dayStatus = getDayStatus(startDate, endDate);

  return (
    <article className="w-full max-w-[480px] rounded-[16px] border border-slate-200 bg-white p-10 shadow-sm">
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex rounded-[16px] px-4 py-2 font-semibold  ${config.badgeClassName}`}
        >
          {config.label}
        </span>

        <span className={`text-2xl font-extrabold ${dayStatus.className}`}>
          {dayStatus.text}
        </span>
      </div>

      <h2 className="mt-10 text-2xl font-extrabold leading-tight text-slate-900">
        {title}
      </h2>

      <div className={`${config.buttonText ? "mt-20" : "mt-28"} flex items-center gap-3`}>
        {/* config.icon은 lucide icon을 사용하기 위해서 */}
        <config.icon className="h-6 w-6 text-slate-500" />
        <p className="text-xl text-slate-500">
          {config.datePrefix} {formatDateRange(startDate, endDate)}
        </p>
      </div>

    {/* 버튼텍스트가 있으면 버튼을 나타내라 */}
      {config.buttonText && (
        <button
          type="button"
          onClick={onClick}
          className="mt-6 w-full rounded-2xl bg-green-900 py-3 font-bold text-white"
        >
          {config.buttonText}
        </button>
      )}
    </article>
  );
};

export default MyWishlistCard;