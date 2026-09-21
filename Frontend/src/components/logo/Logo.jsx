import "./logo.scss";

/**
 * Inline SVG logo mark + wordmark, so branding needs no binary asset.
 * The mark is a heritage-style arch (haveli jharokha) framing a home.
 * `tone` switches the tile color for use on dark/green backgrounds.
 */
const Logo = ({ size = 40, showText = true, tone = "dark" }) => {
  const light = tone === "light";

  return (
    <span className={`ag-logo ag-logo--${tone}`}>
      <svg
        viewBox="0 0 48 52"
        width={size}
        height={(size * 52) / 48}
        className="ag-logo__mark"
        aria-hidden="true"
      >
        {/* Arch tile */}
        <path
          d="M6 50 V24 C6 10.7 14.1 2.5 24 2.5 C33.9 2.5 42 10.7 42 24 V50 Z"
          fill={light ? "#FFFFFF" : "#332316"}
        />
        <path
          d="M6 50 V24 C6 10.7 14.1 2.5 24 2.5 C33.9 2.5 42 10.7 42 24 V50 Z"
          fill="none"
          stroke={light ? "#332316" : "#B07C39"}
          strokeWidth="2"
        />
        {/* Sun above the roof */}
        <circle cx="36.5" cy="12.5" r="3" fill="#C08E42" />
        {/* Roof */}
        <path d="M15 28 L24 19.5 L33 28 Z" fill={light ? "#332316" : "#C08E42"} />
        {/* House body */}
        <rect x="16.5" y="28" width="15" height="11.5" rx="1.5" fill={light ? "#332316" : "#F7EFE2"} />
        {/* Door */}
        <path d="M21.5 39.5 V33.6 A2.5 2.5 0 0 1 26.5 33.6 V39.5 Z" fill={light ? "#C0923F" : "#96682B"} />
        {/* Ground line */}
        <rect x="9" y="43" width="30" height="2.2" rx="1.1" fill={light ? "#332316" : "#C08E42"} opacity="0.55" />
      </svg>
      {showText && (
        <span className="ag-logo__text">
          Apna <b>Ghar</b>
        </span>
      )}
    </span>
  );
};

export default Logo;