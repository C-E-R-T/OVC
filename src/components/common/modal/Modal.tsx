import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
}

const Modal = ({ isOpen, title, children, onClose, panelClassName = "" }: ModalProps) => {
  useEffect(() => {
    // 모달이 닫혀 있으면 전역 이벤트/스타일 변경을 수행 X.
    if (!isOpen) return;

    // 모달이 닫힐 때 기존 body 스타일을 복원하기 위해 현재 값을 저장.
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    // 스크롤바가 사라질 때 생기는 레이아웃 흔들림을 막기 위해 너비를 계산.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    // 배경 페이지 스크롤을 잠그기.
    document.body.style.overflow = "hidden";
    // 스크롤바가 사라진 만큼 우측 패딩을 보정해 화면이 좌우로 흔들리지 X.
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // 모달이 닫힐 때 이벤트 리스너와 body 스타일을 원래대로 복구.
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, onClose]);

  // 닫힌 상태에서는 포털 렌더링을 생략.
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ${panelClassName}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* 자식요소를 집어넣어주세요 */}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
