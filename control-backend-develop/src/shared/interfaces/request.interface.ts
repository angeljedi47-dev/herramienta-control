import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

export interface IReqCustom extends Request {
    headers: IncomingHttpHeaders;
    user_authenticated: IUserAuthenticated;
    files_moved_final: string[];
}
