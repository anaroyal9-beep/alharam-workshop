const PrintHeader = () => (
  <div className="hidden print:flex flex-col items-center border-b-2 border-foreground pb-3 mb-4">
    <h1 className="text-xl font-extrabold text-foreground leading-tight">
      ورشة الهرم المثالي للآلات والمعدات
    </h1>
    <div className="flex gap-6 mt-1 text-[9pt] text-muted-foreground font-semibold flex-wrap justify-center">
      <span>الرقم الضريبي: 311267825300003</span>
      <span>السجل التجاري: 2050064957</span>
      <span>هاتف: 0549701772</span>
    </div>
  </div>
);

export default PrintHeader;
