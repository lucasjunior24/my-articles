import { DomainError } from "./DomainError";

export class UnauthorizedError extends DomainError {
  constructor(message = "Acesso não autorizado") {
    super(message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}
