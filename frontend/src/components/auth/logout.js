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
        // document.getElementById('categories').children[0].style.color = 'rgb(255, 255, 255)';
        // document.getElementById('categories').children[0].style.backgroundColor = 'rgb(13, 110, 253)';
        // document.getElementById('user').innerHTML = `<a href="/login" class="d-flex">
        //                 <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
        //                      xmlns="http://www.w3.org/2000/svg"
        //                      class="m-3">
        //                     <circle cx="18" cy="18" r="18" fill="#D9D9D9"/>
        //                     <path d="M18 18C19.0609 18 20.0783 17.5786 20.8284 16.8284C21.5786 16.0783 22 15.0609 22 14C22 12.9391 21.5786 11.9217 20.8284 11.1716C20.0783 10.4214 19.0609 10 18 10C16.9391 10 15.9217 10.4214 15.1716 11.1716C14.4214 11.9217 14 12.9391 14 14C14 15.0609 14.4214 16.0783 15.1716 16.8284C15.9217 17.5786 16.9391 18 18 18ZM20.6667 14C20.6667 14.7072 20.3857 15.3855 19.8856 15.8856C19.3855 16.3857 18.7072 16.6667 18 16.6667C17.2928 16.6667 16.6145 16.3857 16.1144 15.8856C15.6143 15.3855 15.3333 14.7072 15.3333 14C15.3333 13.2928 15.6143 12.6145 16.1144 12.1144C16.6145 11.6143 17.2928 11.3333 18 11.3333C18.7072 11.3333 19.3855 11.6143 19.8856 12.1144C20.3857 12.6145 20.6667 13.2928 20.6667 14ZM26 24.6667C26 26 24.6667 26 24.6667 26H11.3333C11.3333 26 10 26 10 24.6667C10 23.3333 11.3333 19.3333 18 19.3333C24.6667 19.3333 26 23.3333 26 24.6667ZM24.6667 24.6613C24.6653 24.3333 24.4613 23.3467 23.5573 22.4427C22.688 21.5733 21.052 20.6667 18 20.6667C14.9467 20.6667 13.312 21.5733 12.4427 22.4427C11.5387 23.3467 11.336 24.3333 11.3333 24.6613H24.6667Z"
        //                           fill="#6C757D"/>
        //                 </svg>
        //                 <span id="user-name" class="d-flex align-items-center ">Пользователь</span>
        //             </a>`
        this.exitPageElement.setAttribute( 'style','display: none !important')
        this.openNewRoute('/login')
    }
}