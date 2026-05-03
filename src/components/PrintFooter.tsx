import workshopQr from "@/assets/workshop-qr.png";

interface PrintFooterProps {
  variant?: "default" | "ledger";
}

const PrintFooter = ({ variant = "default" }: PrintFooterProps) => {
  return (
    <div className="hidden print:block mt-3 pt-2 border-t border-foreground/30">
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1 text-center">
          {variant === "default" && (
            <p className="text-[11pt] font-extrabold leading-snug">
              حد أقصى 30 يوم للاستلام — Maximum 30 days for collection
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[7pt] font-bold text-muted-foreground">Workshop Location / موقع الورشة</p>
          <img src={workshopQr} alt="Workshop Location QR" className="w-20 h-20 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default PrintFooter;
