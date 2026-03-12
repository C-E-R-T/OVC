export type Certificate = {
  id: number;
  name: string;
  authority: string; //발급 기관
  examTrend: string | null; //출제 경향
  acqMethod: string | null; //취득 방법
  precautions: string | null; //유의 사항
  // description: string | null; //자격증 설명
  writtenFee: number | null; 
  practicalFee: number | null;
  category_id: number;
  created_at: string;
};

export type Schedule = {
  scheduleId: number;
  certificateName: string;
  examName: string;
  examType: string; //실기, 필기 - {WRITTEN, PRACTIVCAL}
  eventType: string; //지원일, 시험일, 결과일 - {APPLY, EXAM, RESULT}
  startDate: string;
  endDate: string;
  exam_round: string; //회차 정보
};

export type CalendarEventType = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean; 
  extendedProps: {
    scheduleId: number;
    certificateName: string;
    examType: string;
    eventType: string;
    startDate: string;
    endDate: string;
  };
};