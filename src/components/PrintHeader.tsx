import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.jpg";

const PrintHeader = () => {
  const { lang } = useLanguage();

  return (
    <div className="hidden print:flex items-start justify-between border-b-2 border-foreground pb-3 mb-3 gap-4">
      {/* English side (left) */}
      <div className="text-left flex-1">
        <h2 className="text-[12pt] font-extrabold tracking-wide leading-tight text-foreground">
          AL HARAM PERFECT WORKSHOP
        </h2>
        <p className="text-[8pt] font-semibold text-muted-foreground mt-0.5">
          For Machinery &amp; Equipment
        </p>
        <div className="mt-1 text-[7pt] text-muted-foreground font-semibold leading-relaxed">
          <p>Phone: 0549701772</p>
          <p>VAT: 311267825300003</p>
          <p>CR: 2050064957</p>
        </div>
      </div>

      {/* Logo center */}
      <div className="flex flex-col items-center shrink-0">
        <img
          src={logo}
          alt="شعار ورشة الهرم المثالي"
          className="w-[72px] h-[72px] object-contain"
        />
      </div>

      {/* Arabic side (right) */}
      <div className="text-right flex-1">
        <h2 className="text-[13pt] font-extrabold leading-tight text-foreground">
          ورشة الهرم المثالي
        </h2>
        <p className="text-[8pt] font-semibold text-muted-foreground mt-0.5">
          للآلات والمعدات
        </p>
        <div className="mt-1 text-[7pt] text-muted-foreground font-semibold leading-relaxed">
          <p>هاتف: 0549701772</p>
          <p>الرقم الضريبي: 311267825300003</p>
          <p>السجل التجاري: 2050064957</p>
        </div>
      </div>
    </div>
  );
};

export const PrintPolicyFooter = () => {
  const { lang } = useLanguage();
  return (
    <div className="hidden print:block mt-4 pt-3 border-t border-foreground/30 text-center text-[8pt] text-muted-foreground font-semibold">
      {lang === "ar" ? "حد أقصى 30 يوم للاستلام" : "Maximum 30 days for collection"}
    </div>
  );
};

export default PrintHeader;
