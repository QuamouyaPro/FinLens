export type IconName =
  | "lens" | "menu" | "check" | "cross" | "arch" | "sun" | "moon" | "alert"
  | "split" | "list" | "grid" | "folder" | "dl" | "srch" | "tbl" | "shield"
  | "clock" | "plus" | "lock" | "sliders" | "bank" | "rocket" | "scale" | "star"
  | "chat" | "users" | "card" | "trash" | "restore" | "pin" | "doc" | "send" | "logout";

type IconProps = {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
};

export function Icon({ name, className, style }: IconProps) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}
