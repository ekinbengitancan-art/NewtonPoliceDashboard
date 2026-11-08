
type Props = {
  size?: number;
  withText?: boolean;
  variant?: "gradient" | "blue" | "mono";
  className?: string;
};

export default function Logo({
  size = 32,
  withText = true,
  className,
}: Props) {
  return (
    <span
      className={`logo logo-mark ${className ?? ""}`}
      aria-label="Newton Police Department"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <img
        src="https://cdn.discordapp.com/icons/1524894549636288604/a_b8d9f35179a43eb0a2d59a4ede64603c.gif?size=512"
        alt="Newton Police Station 13F"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />

      {withText && (
        <span className="logo-mark-wordmark">
          NEWTON<span className="logo-mark-accent">PD</span>
        </span>
      )}
    </span>
  );
}
