import { QRCodeSVG } from "qrcode.react";

const LOCATION_URL = "https://maps.google.com/?q=26.4207,50.0888";
const ADDRESS_AR = "شارع الرازي، المنطقة الصناعية، الدمام 32442";
const ADDRESS_EN = "Al-Razi Street, Industrial Area, Dammam 32442";

const PrintFooter = () => {
  return (
    <div className="hidden print:block mt-4 pt-3 border-t border-foreground/30">
      <div className="flex items-center justify-center gap-3">
        <QRCodeSVG value={LOCATION_URL} size={48} level="M" />
        <div className="text-center text-[8pt] font-semibold text-muted-foreground leading-snug">
          <p>{ADDRESS_AR}</p>
          <p>{ADDRESS_EN}</p>
        </div>
      </div>
      <p className="text-center text-[7pt] text-muted-foreground font-semibold mt-1">
        حد أقصى 30 يوم للاستلام — Maximum 30 days for collection
      </p>
    </div>
  );
};

export default PrintFooter;
