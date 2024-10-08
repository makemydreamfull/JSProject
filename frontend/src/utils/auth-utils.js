import config from "../config/config.js";

export class AuthUtils {
    static accessTokenKey = 'accessToken'
    static refreshTokenKey = 'refreshToken'
    static userInfoTokenKey = 'userInfo'

    static setAuthInfo(accessTokenKey, refreshTokenKey, userInfo = null) {
        if(accessTokenKey && refreshTokenKey){
            localStorage.setItem(this.accessTokenKey, accessTokenKey)
            localStorage.setItem(this.refreshTokenKey, refreshTokenKey)
        }

        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo))
        }

    }
    static removeAuthInfo(){
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
        localStorage.removeItem(this.userInfoTokenKey)
    }
    static  getAuthInfo(key = null){
        if(key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)){
            return localStorage.getItem(key)
        } else{
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }
    static async updateRefreshToken(){
        let result = false
        const refreshToken = this.getAuthInfo(this.refreshTokenKey)
        console.log(refreshToken)
        if(refreshToken){
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })
            console.log(response)
            if(refreshToken && response.status ===200){
                const tokens = await response.json()
                if(tokens && !tokens.error){
                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken, tokens.tokens.userInfoTokenKey)
                    result = true
                }
            }
            if(!result){
                this.removeAuthInfo()
            }
        }
        return result
    }
}