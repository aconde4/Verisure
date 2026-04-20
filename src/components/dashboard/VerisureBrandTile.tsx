export function VerisureBrandTile() {
  return (
    <div className="w-[180px] rounded-[28px] border border-white/18 bg-white/10 p-4 shadow-[0_24px_50px_-30px_rgba(67,20,29,0.8)] backdrop-blur-sm">
      <div className="overflow-hidden rounded-[24px] bg-[#ff0a46] p-4">
        <div className="flex aspect-square items-center justify-center rounded-[20px]">
          <svg viewBox="0 0 160 160" className="h-[104px] w-[104px]" aria-hidden="true">
            <g transform="translate(80 80)">
              <g fill="#ffffff">
                <circle cx="0" cy="-46" r="21" />
                <circle cx="39.8" cy="-23" r="21" />
                <circle cx="39.8" cy="23" r="21" />
                <circle cx="0" cy="46" r="21" />
                <circle cx="-39.8" cy="23" r="21" />
                <circle cx="-39.8" cy="-23" r="21" />
                <circle cx="0" cy="0" r="35" />
              </g>
              <circle cx="0" cy="0" r="27" fill="#f5f5f5" stroke="#ff0a46" strokeWidth="2" />
            </g>
          </svg>
        </div>
        <div className="mt-3 text-center text-[2rem] font-semibold tracking-tight text-white">
          verisure
        </div>
      </div>
    </div>
  );
}
