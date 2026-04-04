import banner from "@/assets/print-banner.png";

const PrintHeader = () => {
  return (
    <div className="hidden print:block -mx-[var(--print-margin,0px)] mb-2" style={{ margin: 0, padding: 0 }}>
      <img
        src={banner}
        alt="AL HARAM PERFECT WORKSHOP - ورشة الهرم المثالي"
        className="w-full h-auto block"
        style={{ display: 'block', width: '100%', maxWidth: '100%' }}
      />
    </div>
  );
};

export const PrintPolicyFooter = () => {
  return (
    <div className="hidden print:block mt-4 pt-3 border-t border-foreground/30 text-center text-[8pt] text-muted-foreground font-semibold">
      حد أقصى 30 يوم للاستلام — Maximum 30 days for collection
    </div>
  );
};

export default PrintHeader;
