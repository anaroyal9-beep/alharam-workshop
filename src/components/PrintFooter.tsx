import workshopQr from "@/assets/workshop-qr.png";

interface PrintFooterProps {
  variant?: "default" | "ledger";
}

const PrintFooter = ({ variant = "default" }: PrintFooterProps) => {
  return (
    <div className="hidden print:block mt-1 pt-1 border-t border-foreground/30">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          {variant === "default" && (
            <p className="text-[7pt] font-bold leading-tight m-0">
              حد أقصى 30 يوم للاستلام — Maximum 30 days for collection
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-0 leading-none">
          <p className="text-[6pt] font-bold text-muted-foreground m-0">Workshop Location / موقع الورشة</p>
          <img src={workshopQr} alt="Workshop Location QR" className="w-16 h-16 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default PrintFooter;
