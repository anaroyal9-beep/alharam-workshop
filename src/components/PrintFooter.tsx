import workshopQr from "@/assets/workshop-qr.png";

const ADDRESS_AR = "شارع الرازي، المنطقة الصناعية، الدمام 32442";
const ADDRESS_EN = "Al-Razi Street, Industrial Area, Dammam 32442";

const PrintFooter = () => {
  return (
    <div className="hidden print:block mt-4 pt-3 border-t border-foreground/30">
      <div className="flex items-end justify-between">
        <div className="text-center text-[8pt] font-semibold text-muted-foreground leading-snug flex-1">
          <p>{ADDRESS_AR}</p>
          <p>{ADDRESS_EN}</p>
          <p className="text-[7pt] mt-1 font-semibold">
            حد أقصى 30 يوم للاستلام — Maximum 30 days for collection
          </p>
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
