export interface APIResponse {
    success: boolean,
    message: ErrorMessage | Object | null,
    token: string | null
}

export enum HTTPVerb {
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    GET = "GET",
    DELETE = "DELETE"
}

export enum HTTPCode {
    SUCCESS = 200,
    CREATED = 201,
    NO_CONTENT = 204,    
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    NOT_ALLOWED = 405,
    CONFLICT = 409,
    SERVER_ERROR = 500
}

export enum ErrorMessage {
    FATAL_ERROR = 'FATAL_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
    WRONG_FIELD_TYPE = 'WRONG_FIELD_TYPE',
    INCOMPLETE_FORM = 'INCOMPLETE_FORM',
    ID_NOT_EMPTY = 'ID_NOT_EMPTY',
    ID_NOT_PROVIDED = 'ID_NOT_PROVIDED',
    ID_NOT_FOUND = 'ID_NOT_FOUND',
    ACCESS_TOKEN_MISSING = "ACCESS_TOKEN_MISSING",
    ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED",
    GOOGLE_AUTH_EXPIRED = "GOOGLE_AUTH_EXPIRED", 
    USER_NOT_FOUND = "USER_NOT_FOUND"
}

/**
 * Class that guarantees every HTTPErrorMessage is consistently 
 * associated to a single HTTPErrorCode.
 */
export class HTTPError {
    static readonly FATAL_ERROR  = new HTTPError(ErrorMessage.FATAL_ERROR, 
                                                 HTTPCode.SERVER_ERROR);
    static readonly DATABASE_ERROR = new HTTPError(ErrorMessage.DATABASE_ERROR, 
                                                   HTTPCode.SERVER_ERROR);
    static readonly ROUTE_NOT_FOUND = new HTTPError(ErrorMessage.ROUTE_NOT_FOUND, 
                                                    HTTPCode.NOT_FOUND);
    static readonly WRONG_FIELD_TYPE  = new HTTPError(ErrorMessage.WRONG_FIELD_TYPE, 
                                                      HTTPCode.BAD_REQUEST);
    static readonly INCOMPLETE_FORM = new HTTPError(ErrorMessage.INCOMPLETE_FORM, 
                                                    HTTPCode.BAD_REQUEST);
    static readonly ID_NOT_EMPTY = new HTTPError(ErrorMessage.ID_NOT_EMPTY, 
                                                 HTTPCode.CONFLICT);
    static readonly ID_NOT_PROVIDED = new HTTPError(ErrorMessage.ID_NOT_PROVIDED, 
                                                    HTTPCode.BAD_REQUEST);
    static readonly ID_NOT_FOUND = new HTTPError(ErrorMessage.ID_NOT_FOUND, 
                                                 HTTPCode.NOT_FOUND);
    static readonly ACCESS_TOKEN_MISSING = new HTTPError(ErrorMessage.ACCESS_TOKEN_MISSING,
                                                         HTTPCode.UNAUTHORIZED);
    static readonly ACCESS_TOKEN_EXPIRED = new HTTPError(ErrorMessage.ACCESS_TOKEN_EXPIRED,
                                                         HTTPCode.UNAUTHORIZED);
    static readonly GOOGLE_AUTH_EXPIRED = new HTTPError(ErrorMessage.GOOGLE_AUTH_EXPIRED,
                                                        HTTPCode.UNAUTHORIZED);
    static readonly USER_NOT_FOUND = new HTTPError(ErrorMessage.USER_NOT_FOUND,
                                                   HTTPCode.UNAUTHORIZED);
    // private constructor disallows future modifications
    private constructor(public readonly message: string, public readonly code: HTTPCode) {
    }
}
