import config from "../config/config.js";
import {AuthUtils} from "./auth-utils.js";
export class HttpUtils{
    static async request(url, method='GET', useAuth = true , body){
        const result ={
            error:false,
            response: null,
        }
        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }
        let token = null;
        if(useAuth){
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)
            if(token){
                params.headers['x-auth-token'] = token
            }
        }
        if(body){
            params.body = JSON.stringify(body)
        }
        let response = null;
        try{
            response = await fetch(config.api + url, params)
            result.response = await response.json()
        } catch (e) {
            result.error = true;
            return result;
        }
        if(response.status<200 || response.status>=300){
            result.error = true;
            if(!token){
                result.redirect = '/login'
            } else {
                const updateTokenResult = await AuthUtils.updateRefreshToken()
                if(updateTokenResult){
                    return this.request(url,method,useAuth,body)
                } else{
                    result.redirect = '/login'
                }
            }
        }
        return result;
    }
}