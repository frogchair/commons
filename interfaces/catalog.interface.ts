import { CatalogFighter } from "./fighter.interface";
import { ErrorMessage } from "./general.interface";
export interface CatalogPage {
  success: boolean,
  message: ErrorMessage | CatalogFighter[],
  lastPage: number
}
