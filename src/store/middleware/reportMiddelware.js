import ReportActions from "./../actions/reportActions";
import AuthMiddleware from "./authMiddleware";
import * as firebase from 'firebase';
import { instance } from "../../config/server"
import queryString from "querystring"
import LocalStorageManager from '../../services/localStorageManager'
export default class ReportMiddleware {

    static fileReport(reportObj, reportCounts,token) {
        console.log("fileReport ", reportObj,token);
        return (dispatch) => {
            dispatch(ReportActions.fileReport())
            
            ReportMiddleware.addReport(dispatch, reportObj, reportCounts,token);
        }
    }

    static addReport(dispatch, reportObj, reportCounts,token) {
        instance.post("/submitReport", { rType: reportObj.reportType, city: reportObj.city, image: reportObj.picture, no: reportObj.contact, description: reportObj.description },instance.defaults.headers.token=token)
            .then(response => response.data)
            .then(body => {
                console.log(body)
                dispatch(ReportActions.fileReportSuccessful());
            })
            .catch(error => {
                dispatch(ReportActions.fileReportRejected(error));
            })

    }
    static getStatus(reportObj,token) {
        console.log("fileReport ", reportObj,token);
        return (dispatch) => {
            dispatch(ReportActions.getStatus())
            ReportMiddleware.getStatusFromDatabase(dispatch,reportObj,token);
        }
    }
    static getStatusFromDatabase(dispatch,report,token)
    {
        console.log("StatusARaslasnas ", token)
        instance.post("/getStatus",{rid:report.id})
        .then(response => response.data)
        .then(data => {
            console.log(data)
            dispatch(ReportActions.getStatusSuccess(data.message))
            
        })
        .catch(error => {
            console.log(error)
        })
    }
   
    //Get Report Counts
    static getReportCounts() {
        console.log("getReportCounts");
        return (dispatch) => {
            dispatch(ReportActions.getReportCounts())
            ReportMiddleware.getReportCount(dispatch);
        }
    }

    static getReportCount(dispatch) {
        
        instance("/getCrimeAndMissing")
        .then(response => response.data)
        .then(body => {
            let obj = {crime:0,Missing:0, Total:body.data.length};
            body.data.map(datas=>{
                switch(datas.rType)
                {
                    case "Crime Report":
                    obj.crime = obj.crime + 1;
                    console.log("counting");
                    break;
                    case "Missing Report":
                    obj.Missing = obj.Missing + 1 ;
                    break;
                    default:
                    console.log("Not Match")
                } 
            })
            console.log(obj)
            dispatch(ReportActions.getReportCountsSuccessful(obj));
        })
        .catch(error => {
            console.log(error)
        })
        

    }

    // Get Report List By City or Total
    static getReportList(cityNameOrTotal) {
        console.log("getReportList ", cityNameOrTotal);
        return (dispatch) => {
            dispatch(ReportActions.getReportList())
            ReportMiddleware.getReportLists(dispatch, cityNameOrTotal);
        }
    }

    static getReportLists(dispatch, cityNameOrTotal) {
        
        instance("/getCrimeAndMissing")
        .then(response => response.data)
        .then(body => {
              dispatch(ReportActions.addReportToList(body));
            console.log(body);
        })
        .catch(error => {
            console.log(error);
        })
    }

    //My Report List
    static getMyReportList(userId) {
        console.log("getMyReportList ", userId);
        return (dispatch) => {
            dispatch(ReportActions.getMyReportList());
            ReportMiddleware.getMyReportLists(dispatch, userId);
        }
    }

    static getMyReportLists(dispatch, userId) {
        instance("/getAllReports",instance.defaults.headers.token=userId)
        .then(response => response.data)
        .then(body => {
            dispatch(ReportActions.addMyReportToList(body.data))
        })
        .catch(error => {
            console.log(error.code)
            dispatch(AuthMiddleware.logout())
        })
    }

    //Get Report Detail
    static getReportDetial(reportCity, reportId) {
        console.log("getReportDetial ", reportId , reportCity);
        return (dispatch) => {
            dispatch(ReportActions.getReportDetail())
            ReportMiddleware.getReportDetials(dispatch, reportCity, reportId);
        }
    }

    static getReportDetials(dispatch, reportCity, reportId) {
        dispatch(ReportActions.getReportDetailSuccessful(reportCity))
       

    }


    static updateReportStatus(reportObj, newStatus,token) {
        console.log("fileReport ", reportObj);
        console.log("token ", token);
        return (dispatch) => {
            dispatch(ReportActions.updateReportStatus())
            ReportMiddleware.updateReportStatuss(dispatch, reportObj, newStatus,token);
        }
    }

    static updateReportStatuss(dispatch, reportObj, newStatus,token) {
        instance.post("/SubmitStatus",{uid:reportObj.user,rid:reportObj.id,status:newStatus},instance.defaults.headers.token = token )
        .then(response => response.data)
        .then(data => {
            console.log(data)
            dispatch(ReportActions.updateReportStatusSuccessful())
            ReportMiddleware.getStatusFromDatabase(dispatch,reportObj,token);
        })
        .catch(error=>{
            console.log(error)
            dispatch(ReportActions.updateReportStatusRejected(error))
        })

    }


    //Get Cities List
    static getListOfCities() {
        console.log("getListOfCities ");
        return (dispatch) => {
            dispatch(ReportActions.getListOfCities())
            ReportMiddleware.getCitiesList(dispatch);
        }
    }


    static getCitiesList(dispatch) {
        var citiesObj = ["Anchorage","Boston","Chicago","Huntsville","Livingston","Miami","Oxford","Pensacola","Phoenix","Portland"]
        dispatch(ReportActions.getListOfCitiesSuccessful(citiesObj));
    }
}