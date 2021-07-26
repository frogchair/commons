import { Player } from "../../models/Player";

export enum AuthenticationError {
    ACCESS_TOKEN_MISSING = "ACCESS_TOKEN_MISSING",
    ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED",
    GOOGLE_AUTH_EXPIRED = "GOOGLE_AUTH_EXPIRED", 
    USER_NOT_FOUND = "USER_NOT_FOUND",    
}
export interface Login {
    success: boolean,
    message: AuthenticationError | Player,    
    token: string | null
}