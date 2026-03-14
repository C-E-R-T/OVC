interface MyCertCardProps {
  name: string;
  authority: string;
  certNum?: string;
  passingDate: string;
  expirationDate?: string;
  onDelete?: () => void;
}

const MyCertCard = ({
  name,
  authority,
  certNum,
  passingDate,
  expirationDate,
  onDelete,
}: MyCertCardProps) => {
  return (
    <article className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-xl transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
          <p className="mt-2 text-base text-slate-500">{authority}</p>
          <p className="mt-2 text-sm text-slate-500">자격증 번호: {certNum}</p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white hover:bg-red-700"
        >
          X
        </button>
      </div>

      <div className="my-5 h-px bg-slate-200" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400">합격일</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{passingDate}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">만료일</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {expirationDate ?? "-"}
          </p>
        </div>
      </div>

    </article>
  );
};

export default MyCertCard;
