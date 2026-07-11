import type { FC } from "react";
import type { AppUser } from "../../../../core/entities/User";
import {
  avatarContainer,
  avatarImage,
  avatarFallback,
  tooltipContainer,
  tooltipName,
  tooltipEmail,
  tooltipArrow,
} from "./styles";

interface UserAvatarProps {
  user: AppUser;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

const sizeMap: Record<
  NonNullable<UserAvatarProps["size"]>,
  { container: string; image: string; fallback: string; font: string }
> = {
  sm: {
    container: "w-8 h-8",
    image: "w-8 h-8",
    fallback: "w-8 h-8 text-xs",
    font: "text-xs",
  },
  md: {
    container: "w-10 h-10",
    image: "w-10 h-10",
    fallback: "w-10 h-10 text-sm",
    font: "text-sm",
  },
  lg: {
    container: "w-12 h-12",
    image: "w-12 h-12",
    fallback: "w-12 h-12 text-base",
    font: "text-base",
  },
};

/**
 * UserAvatar — Exibe a foto do usuário ou suas iniciais como fallback.
 *
 * Quando `showTooltip` está ativado, mostra um tooltip com nome e email
 * ao passar o mouse sobre o avatar.
 *
 * @example
 * ```tsx
 * <UserAvatar user={user} size="md" showTooltip />
 * <UserAvatar user={user} size="sm" />
 * ```
 */
export const UserAvatar: FC<UserAvatarProps> = ({
  user,
  size = "md",
  showTooltip = false,
  className = "",
}) => {
  const sizes = sizeMap[size];
  const initials = user.displayName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarContent = user.photoURL ? (
    <img
      src={user.photoURL}
      alt={user.displayName}
      className={`${avatarImage} ${sizes.image}`}
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className={`${avatarFallback} ${sizes.fallback}`}>{initials}</div>
  );

  if (!showTooltip) {
    return (
      <div className={`${avatarContainer} ${sizes.container} ${className}`}>
        {avatarContent}
      </div>
    );
  }

  return (
    <div className={`${avatarContainer} ${sizes.container} group ${className}`}>
      {avatarContent}

      {/* Tooltip */}
      <div className={tooltipContainer}>
        <p className={tooltipName}>{user.displayName}</p>
        {user.email && <p className={tooltipEmail}>{user.email}</p>}
        <div className={tooltipArrow} />
      </div>
    </div>
  );
};
