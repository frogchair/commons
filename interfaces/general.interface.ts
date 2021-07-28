export interface APIResponse {
    success: boolean,
    message: ErrorMessage | Object
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
    SERVER_ERROR = 500,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409
}

export enum ErrorMessage {
    FATAL_ERROR = 'FATAL_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
    WRONG_FIELD_TYPE = 'WRONG_FIELD_TYPE',
    INCOMPLETE_FORM = 'INCOMPLETE_FORM',
    ID_NOT_EMPTY = 'ID_NOT_EMPTY',
    ID_NOT_PROVIDED = 'ID_NOT_PROVIDED',
    ID_NOT_VALID = 'ID_NOT_VALID'
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
    static readonly ID_NOT_VALID = new HTTPError(ErrorMessage.ID_NOT_VALID, 
                                                 HTTPCode.BAD_REQUEST);
    // private constructor disallows future modifications
    private constructor(public readonly message: string, public readonly code: HTTPCode) {
    }
}