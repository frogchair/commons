export interface Response {
    success: boolean,
    message: HTTPErrorMessage | JSON
}

export enum HTTPErrorCode {
    SUCCESS = 200,
    SERVER_ERROR = 500,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409
}

export enum HTTPErrorMessage {
    FATAL_ERROR = 'FATAL_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
    WRONG_FIELD_TYPE = 'WRONG_FIELD_TYPE',
    INCOMPLETE_FORM = 'INCOMPLETE_FORM',
    ID_NOT_EMPTY = 'ID_NOT_EMPTY',
    ID_NOT_PROVIDED = 'ID_NOT_PROVIDED'
}

/**
 * Class that guarantees every HTTPErrorMessage is consistently 
 * associated to a single HTTPErrorCode.
 */
export class HTTPError {
    static readonly FATAL_ERROR  = new HTTPError(HTTPErrorMessage.FATAL_ERROR, 
                                                 HTTPErrorCode.SERVER_ERROR);
    static readonly DATABASE_ERROR = new HTTPError(HTTPErrorMessage.DATABASE_ERROR, 
                                                   HTTPErrorCode.SERVER_ERROR);
    static readonly ROUTE_NOT_FOUND = new HTTPError(HTTPErrorMessage.ROUTE_NOT_FOUND, 
                                                    HTTPErrorCode.NOT_FOUND);
    static readonly WRONG_FIELD_TYPE  = new HTTPError(HTTPErrorMessage.WRONG_FIELD_TYPE, 
                                                      HTTPErrorCode.BAD_REQUEST);
    static readonly INCOMPLETE_FORM = new HTTPError(HTTPErrorMessage.INCOMPLETE_FORM, 
                                                    HTTPErrorCode.BAD_REQUEST);
    static readonly ID_NOT_EMPTY = new HTTPError(HTTPErrorMessage.ID_NOT_EMPTY, 
                                                 HTTPErrorCode.CONFLICT);
    static readonly ID_NOT_PROVIDED = new HTTPError(HTTPErrorMessage.ID_NOT_PROVIDED, 
                                                    HTTPErrorCode.BAD_REQUEST);
    // private constructor disallows future modifications
    private constructor(public readonly message: string, public readonly code: HTTPErrorCode) {
    }
}