import { createContext } from "react";
import type { Container } from "../../di/types";

export interface DIContextValue {
  container: Container | null;
  isLoading: boolean;
  error: string | null;
}

export const DIContext = createContext<DIContextValue | null>(null);
