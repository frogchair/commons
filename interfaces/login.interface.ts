import { Player } from "../../models/Player";
import { HTTPError, HTTPErrorCode } from "./error.interface";

export enum AuthenticationError {
    ACCESS_TOKEN_MISSING = "ACCESS_TOKEN_MISSING",
    ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED",
    GOOGLE_AUTH_EXPIRED = "GOOGLE_AUTH_EXPIRED", 
    USER_NOT_FOUND = "USER_NOT_FOUND",
    ERROR_CODE = 400
}
export interface Login {
    success: boolean,
    message: AuthenticationError | Player,    
    token: string | null
}