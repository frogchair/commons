export enum HTTPErrorCode {
    SUCCESS = 200,
    SERVER_ERROR = 500,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409
}

export class HTTPError {
    static readonly FATAL_ERROR  = new HTTPError('FATAL_ERROR', HTTPErrorCode.SERVER_ERROR);
    static readonly DATABASE_ERROR = new HTTPError('DATABASE_ERROR', HTTPErrorCode.SERVER_ERROR);
    static readonly ROUTE_NOT_FOUND = new HTTPError('ROUTE_NOT_FOUND', HTTPErrorCode.NOT_FOUND);
    static readonly WRONG_FIELD_TYPE  = new HTTPError('WRONG_FIELD_TYPE', HTTPErrorCode.BAD_REQUEST);
    static readonly INCOMPLETE_FORM = new HTTPError('INCOMPLETE_FORM', HTTPErrorCode.BAD_REQUEST);
    static readonly ID_NOT_EMPTY = new HTTPError('ID_NOT_EMPTY', HTTPErrorCode.CONFLICT);
    static readonly ID_NOT_PROVIDED = new HTTPError('ID_NOT_PROVIDED', HTTPErrorCode.BAD_REQUEST);

    // private to disallow creating other instances of this type
    private constructor(public readonly message: string, public readonly code: HTTPErrorCode) {
    }
}

//console.log(HTTPError.WRONG_FIELD_TYPE)
//console.log(HTTPError.WRONG_FIELD_TYPE.message)
//console.log(HTTPError.WRONG_FIELD_TYPE.code)