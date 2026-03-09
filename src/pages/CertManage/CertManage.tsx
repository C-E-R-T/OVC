import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard,{WISHLIST_CARD_TYPE} from "../../components/common/cards/MyWishlistCard";
import styles from "./CertManage.module.css";

function CertManage() {
  return (
    <div>
      <MyCertCard
        name="정보처리기사"
        authority="한국산업인력공단"
        passingDate="2025-06-01"
      />
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
  );
}

export default CertManage;
