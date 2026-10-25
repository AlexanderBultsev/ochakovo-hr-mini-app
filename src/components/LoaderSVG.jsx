export const LoaderSVG = () => (
  <svg width="234" height="234" viewBox="0 0 234 234" xmlns="http://www.w3.org/2000/svg">
    {/* 1. Оборачиваем CSS в шаблонную строку */}
    <style>{`
      .brand-color { fill: #D50032; }
      .square-outline { stroke: #D50032; stroke-width: 14; fill: none; }
      .donut { animation: moveInSquare 4s ease-in-out infinite; }
      @keyframes moveInSquare {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-106px, 0); }
        50% { transform: translate(-106px, -106px); }
        75% { transform: translate(0, -106px); }
      }
    `}</style>
    <rect x="7" y="6" width="220" height="220" className="square-outline" />

    <path 
      className="brand-color donut" 
      fillRule="evenodd" // <- camelCase
      d="M 170 129 a 40 40 0 1 0 0.001 0 M 170 150 a 19 19 0 1 1 -0.001 0" 
    />
  </svg>
);