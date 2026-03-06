export type Certificate = {
  id: number;
  name: string;
  agency: string;
  exam_trend: string | null;
  acq_method: string | null;
  precautions: string | null;
  category_id: number;
  created_at: string;
};

export type Schedule = {
  scheduleId: number;
  certificateName: number;
  examName: string;
  examType: string;
  eventType: string;
  startDate: string;
  endDate: string;
};

export type CalendarEventType = {
  id: string;
  title: string;
  date: string;
  extendedProps: {
    scheduleId: number;
    certId: number;
    examType: string;
    applyStartAt: string;
    applyEndAt: string;
    // resultAt: string;
  };
};