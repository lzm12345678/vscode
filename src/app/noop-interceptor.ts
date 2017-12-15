/**
 * @author gyjlovelh
 * @createTime 2017/10/8
 */
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
    /**
     * 拦截器  给请求设置 authorization 的头
     * @param {HttpRequest<any>} req
     * @param {HttpHandler} next
     * @description
     * @returns {Observable<HttpEvent<any>>}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let token = sessionStorage.getItem('authorization');
        let authReq = null;
        if (token) {
            authReq = req.clone({setHeaders: {Authorization: token}});
        }
        return next.handle(authReq || req);
    }
}
