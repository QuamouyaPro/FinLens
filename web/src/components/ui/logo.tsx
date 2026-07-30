import { Icon } from "./icon";

/** La loupe est le repère de marque : elle reprend le motif de la puce de citation. */
export function Logo({ size = 17.5, lensColor }: { size?: number; lensColor?: string }) {
  return (
    <span className="logo" style={{ fontSize: size }}>
      <Icon
        name="lens"
        className="lens"
        style={lensColor ? { color: lensColor } : undefined}
      />
      FinLens
    </span>
  );
}
