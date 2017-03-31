import AuthActions from "./../actions/authActions";
import ReportMiddleware from "./../middleware/reportMiddelware";
import LocalStorageManager from '../../services/localStorageManager'
import * as firebase from 'firebase';
import {instance} from "../../config/server"
import queryString from "querystring"
export default class AuthMiddleware {

    /// Singup Functions start
    static signup(credentials) {
        console.log("test ",credentials);
        return (dispatch) => {
            dispatch(AuthActions.signup())
            AuthMiddleware.registerUser(dispatch,credentials);            
        }
    }

    static registerUser(dispatch,credentials){
        instance.post("/signup",{name:credentials.fullName,email:credentials.email,password:credentials.password,Role:true})
        .then(response => response.data)
        .then(body => {
            console.log(body);
            
            dispatch(AuthActions.signupupSuccessful());
            
        })
        .catch(error=>{
            console.log(error);
            dispatch(AuthActions.signupRejected(error));
        })

    }


    // Signin Functions Starts
    static signin(credentials) {
        console.log("test ",credentials);
        return (dispatch) => {
            dispatch(AuthActions.signin())
            AuthMiddleware.authenticateUser(dispatch,credentials);            
        }
    }

    static authenticateUser(dispatch,credentials){

        instance.post("/login",{email:credentials.email,password:credentials.password})
        .then(response => response.data)
        .then(body => {
            console.log(body)
            LocalStorageManager.setUser(body)
            // dispatch(ReportMiddleware.getMyReportList("Arsalan"));
            dispatch(AuthActions.signinSuccessful(body));
        })
        .catch(error =>{
            console.log(error)
            dispatch(AuthActions.signinRejected(error));
        })

    }

    // Signin Functions Ends


    // Logout Functions Starts
    static logout() {
        return (dispatch) => {
            dispatch(AuthActions.logout())
            //dispatch(ReportActions.getMyReportList())
            AuthMiddleware.logoutFromSystem(dispatch);            
        }
    }

    static logoutFromSystem(dispatch){
        LocalStorageManager.removeUser();
        dispatch(AuthActions.logoutSuccessful())
    }

    // Logout Functions Ends

    // isLoggedIn 
    static isLoggedIn() {
        return (dispatch) => {
            let user = LocalStorageManager.getUser();
            
            if(user){
                dispatch(AuthActions.signinSuccessful(user))
                dispatch(ReportMiddleware.getMyReportList(user.data.token));
            }
            else {
                console.log("not logged in ");
               // dispatch(AuthActions.signinSuccessful(user))
            }
        }
    }
}


    
