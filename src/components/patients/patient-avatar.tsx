import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { PatientSex } from "@/types";

const DEFAULT_AVATAR: Record<PatientSex, string> = {
  female: "👧",
  male: "👦",
  unspecified: "🧒",
};

export function PatientAvatar({
  sex,
  avatarUrl,
  className = "h-16 w-16",
}: {
  sex: PatientSex;
  avatarUrl?: string | null;
  className?: string;
}) {
  if (!avatarUrl?.trim()) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border bg-muted text-[40px] leading-none`}
        role="img"
        aria-label={
          sex === "female"
            ? "Girl"
            : sex === "male"
              ? "Boy"
              : "Child"
        }
      >
        {DEFAULT_AVATAR[sex]}
      </div>
    );
  }

  return (
    <Avatar className={className}>
      <AvatarImage
        src={avatarUrl}
        alt=""
        className="object-cover"
      />
      <AvatarFallback className="text-[40px] leading-none">
        {DEFAULT_AVATAR[sex]}
      </AvatarFallback>
    </Avatar>
  );
}