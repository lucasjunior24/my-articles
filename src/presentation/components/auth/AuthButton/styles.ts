/**
 * AuthButton — Estilos (Tailwind CSS classes)
 *
 * Como usamos Tailwind CSS, os estilos são aplicados diretamente
 * nos elementos via className. Este arquivo serve como documentação
 * centralizada das classes utilizadas, facilitando manutenção.
 */

export const container = "flex items-center gap-3";

export const loginButton =
  "flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold bg-dracula-pink text-dracula-bg rounded-xl hover:bg-dracula-pink/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dracula-pink focus-visible:ring-offset-2 focus-visible:ring-offset-dracula-bg shadow-lg shadow-dracula-pink/15 hover:shadow-dracula-pink/25";

export const loginButtonDisabled = "opacity-50 cursor-not-allowed";

export const googleIcon = "w-5 h-5";

export const loggedInContainer = "flex items-center gap-3";

export const userInfoContainer = "flex items-center gap-2.5";

export const userName =
  "text-sm font-medium text-dracula-fg hidden lg:block max-w-[120px] truncate";

export const logoutButton =
  "px-3.5 py-2 text-sm font-medium text-dracula-red bg-dracula-red/5 hover:bg-dracula-red/15 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dracula-red focus-visible:ring-offset-2 focus-visible:ring-offset-dracula-bg";

export const loadingSkeleton =
  "w-9 h-9 rounded-full bg-dracula-current animate-pulse";
