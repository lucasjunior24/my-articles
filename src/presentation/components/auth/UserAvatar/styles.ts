/**
 * UserAvatar — Estilos (Tailwind CSS classes)
 *
 * Como usamos Tailwind CSS, os estilos são aplicados diretamente
 * nos elementos via className. Este arquivo serve como documentação
 * centralizada das classes utilizadas, facilitando manutenção.
 */

export const avatarContainer =
  "relative inline-flex items-center justify-center shrink-0";

export const avatarImage = "rounded-full object-cover";

export const avatarFallback =
  "rounded-full bg-dracula-current flex items-center justify-center text-dracula-cyan font-bold select-none";

export const tooltipContainer =
  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-dracula-bg border border-dracula-current shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap";

export const tooltipName = "text-sm font-medium text-dracula-fg";

export const tooltipEmail = "text-xs text-dracula-comment";

export const tooltipArrow =
  "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dracula-current";
