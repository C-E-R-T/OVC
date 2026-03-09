import { useState } from "react";

interface CertRegisterFormValues {
  name: string;
  authority: string;
  certNum?: string;
  passingDate: string;
  expirationDate?: string;
}

interface CertRegisterFormProps {
  onClose: () => void;
  onCreate:(values: CertRegisterFormValues) => void;
}

const CertRegisterForm = ({ onClose, onCreate }: CertRegisterFormProps) => {
    const [form,setForm] = useState<CertRegisterFormValues>({
        name: "",
        authority: "",
        certNum: "",
        passingDate: "",
        expirationDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} =e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!form.name.trim()){
            alert("자격증명을 입력해주세요.");
            return;
        }

        if(!form.authority.trim()){
            alert("발급 기관을 입력해주세요.");
            return;
        }

        if(!form.passingDate){
            alert("합격일을 입력해주세요.");
            return;
        }

        onCreate(form);
        onClose();
    };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          자격증명
        </label>
        <input
          type="text"
          name="name"
          placeholder="예: 정보처리기사"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          발급 기관
        </label>
        <input
          type="text"
          name="authority"
          value={form.authority}
          placeholder="예: 한국산업인력공단"
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
        />
      </div>
      
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          자격증 번호
        </label>
        <input
          type="text"
          name="certNum"
          value={form.certNum}
          placeholder="예: 00000000000A"
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          합격일
        </label>
        <input
          type="date"
          name="passingDate"
          value={form.passingDate}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          만료일
        </label>
        <input
          type="date"
          name="expirationDate"
          value={form.expirationDate}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-xl bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-800"
        >
          저장
        </button>
      </div>
    </form>
  );
};

export default CertRegisterForm;
export type {CertRegisterFormValues};