/**
 * ProtectedRoute — Estilos (Tailwind CSS classes)
 *
 * Como usamos Tailwind CSS, os estilos são aplicados diretamente
 * nos elementos via className. Este arquivo serve como documentação
 * centralizada das classes utilizadas, facilitando manutenção.
 */

export const loadingContainer = "flex items-center justify-center min-h-[60vh]";

export const errorContainer = "flex items-center justify-center min-h-[60vh]";

export const errorCard =
  "text-center p-8 rounded-2xl bg-dracula-current/30 border border-dracula-current/50 max-w-md";

export const errorIcon = "w-16 h-16 mx-auto mb-4 text-dracula-red";

export const errorTitle = "text-xl font-bold text-dracula-fg mb-2";

export const errorMessage = "text-sm text-dracula-comment mb-6";

export const errorLink =
  "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors";
