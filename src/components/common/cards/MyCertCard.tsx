interface MyCertCardProps {
  name: string;
  authority: string;
  passingDate: string;
  expirationDate?: string;
}

const MyCertCard = ({
  name,
  authority,
  passingDate,
  expirationDate,
}: MyCertCardProps) => {
  return (
    <article className="w-full max-w-[480px] rounded-xl border bg-white p-5 shadow-xl ">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
          <p className="mt-2 text-base text-slate-500">{authority}</p>
        </div>
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

      <button className="mt-6 w-full rounded-2xl bg-green-900 py-3 font-bold text-white">
        자격증 확인
      </button>
    </article>
  );
};

export default MyCertCard;
