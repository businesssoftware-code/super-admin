
import Cookies from 'js-cookie';


export const setCookies = (accessToken:string, refreshToken:string, name:string, empId:string, userId:string) => {
    const options = { expires: 3650, secure: true};

    Cookies.set("accessToken", accessToken, options);
    Cookies.set("refreshToken", refreshToken, options);
    Cookies.set("name", name, options);
    Cookies.set("empId", empId, options); 
    Cookies.set("userId", userId, options); 
      
}


export const getCookies = (token:string) => {
    
    return Cookies.get(token);
   
}