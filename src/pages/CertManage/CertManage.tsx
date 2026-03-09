import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard, {
  WISHLIST_CARD_TYPE,
} from "../../components/common/cards/MyWishlistCard";
import { Award, Bookmark, type LucideIcon } from "lucide-react";

function CertManage() {
  return (
    <div className="p-5">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl mb-2">내 자격증</h1>
            <p className="text-gray-500 mb-8">
              전문적인 성과를 관리하고 향후 학습 목표를 추적하세요.
            </p>
          </div>
          <button className="bg-green-700">내 자격증 등록</button>
        </div>

        <div className="flex w-full">
          <div className="w-[45%] bg-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex p-2 gap-1">
                <Award />
                <p>취득한 자격증</p>
              </div>
              <div className="px-3 py-1 bg-gray-300 text-base rounded-xl">
                1개 취득 완료
              </div>
            </div>
            <div className="p-4">
              <MyCertCard
                name="정보처리기사"
                authority="한국산업인력공단"
                passingDate="2025-06-01"
              />
            </div>
          </div>
          <div className="w-[55%] bg-green-200">
            <div className="flex items-start justify-between">
              <div className="flex p-2 gap-1">
                <Bookmark />
                <p>내 찜 목록</p>
              </div>
              <div className="px-3 py-1 bg-gray-300 text-base rounded-xl">
                5개 항목
              </div>
            </div>
            <div className="p-4 grid">
              <MyWishlistCard
                type={WISHLIST_CARD_TYPE.APPLY}
                title="TOEIC Listening & Reading"
                startDate="2026-03-01"
                endDate="2026-03-15"
                onClick={() => console.log("시험 신청")}
              />
              <MyWishlistCard
                type={WISHLIST_CARD_TYPE.APPLY}
                title="TOEIC Speaking"
                startDate="2026-03-10"
                endDate="2026-03-15"
                onClick={() => console.log("시험 신청")}
              />
              <MyWishlistCard
                type={WISHLIST_CARD_TYPE.EXAM}
                title="TOEIC Listening & Reading"
                startDate="2026-03-15"
                endDate="2026-03-15"
                onClick={() => console.log("시험 신청")}
              />
              <MyWishlistCard
                type={WISHLIST_CARD_TYPE.RESULT}
                title="TOEIC Listening & Reading"
                startDate="2026-03-09"
                endDate="2026-03-09"
                onClick={() => console.log("시험 신청")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertManage;
