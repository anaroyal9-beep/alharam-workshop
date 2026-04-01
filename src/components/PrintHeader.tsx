const LOGO_PATH = "/lovable-uploads/f431f402-2a1d-4b58-8f0e-258c4285db2d.png";

const PrintHeader = () => (
  <div className="hidden print:flex items-center justify-between border-b-2 border-foreground pb-4 mb-4 gap-4">
    {/* English side (left) */}
    <div className="text-left flex-1">
      <h2 className="text-[13pt] font-extrabold tracking-wide leading-tight text-foreground">
        AL HARAM PERFECT WORKSHOP
      </h2>
      <p className="text-[9pt] font-semibold text-muted-foreground mt-0.5">
        For Machinery &amp; Equipment
      </p>
    </div>

    {/* Logo center */}
    <div className="flex flex-col items-center shrink-0">
      <img
        src={LOGO_PATH}
        alt="شعار ورشة الهرم المثالي"
        className="w-20 h-20 object-contain"
      />
    </div>

    {/* Arabic side (right) */}
    <div className="text-right flex-1">
      <h2 className="text-[14pt] font-extrabold leading-tight text-foreground">
        ورشة الهرم المثالي
      </h2>
      <p className="text-[9pt] font-semibold text-muted-foreground mt-0.5">
        للآلات والمعدات
      </p>
    </div>
  </div>
);

export const PrintSubHeader = () => (
  <div className="hidden print:flex justify-center gap-8 text-[8pt] text-muted-foreground font-semibold mb-4 -mt-3">
    <span>الرقم الضريبي: 311267825300003</span>
    <span>السجل التجاري: 2050064957</span>
    <span>هاتف: 0549701772</span>
  </div>
);

export const PrintPolicyFooter = () => (
  <div className="hidden print:block mt-6 pt-3 border-t border-foreground/30 text-center text-[9pt] text-muted-foreground font-semibold">
    حد أقصى 30 يوم للاستلام
  </div>
);

export default PrintHeader;
