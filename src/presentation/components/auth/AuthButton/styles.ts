/**
 * AuthButton — Estilos (Tailwind CSS classes)
 *
 * Como usamos Tailwind CSS, os estilos são aplicados diretamente
 * nos elementos via className. Este arquivo serve como documentação
 * centralizada das classes utilizadas, facilitando manutenção.
 */

export const container = "flex items-center gap-3";

export const loginButton =
  "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dracula-pink focus-visible:ring-offset-2 focus-visible:ring-offset-dracula-bg";

export const loginButtonDisabled = "opacity-50 cursor-not-allowed";

export const googleIcon = "w-4 h-4";

export const loggedInContainer = "flex items-center gap-3";

export const userInfoContainer = "hidden sm:flex items-center gap-2";

export const userName =
  "text-sm text-dracula-fg hidden lg:block max-w-[120px] truncate";

export const logoutButton =
  "px-3 py-1.5 text-sm font-medium text-dracula-red hover:bg-dracula-red/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dracula-red focus-visible:ring-offset-2 focus-visible:ring-offset-dracula-bg";

export const loadingSkeleton =
  "w-8 h-8 rounded-full bg-dracula-current animate-pulse";
