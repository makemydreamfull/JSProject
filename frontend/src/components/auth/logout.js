import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
export class Logout{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.exitPageElement = document.querySelector('.exit')
        document.getElementById('exit').addEventListener('click', this.logout.bind(this))
        document.getElementById('user').addEventListener('click',this.logout.bind(this))
    }
    async logout(){
        await HttpUtils.request('/logout','POST',false,{
            refreshToken: AuthUtils.getAuthInfo((AuthUtils.refreshTokenKey))
        })
        AuthUtils.removeAuthInfo()
        this.exitPageElement.setAttribute( 'style','display: none !important')
        this.openNewRoute('/login')
    }
}