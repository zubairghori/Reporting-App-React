import React, { Component } from 'react';
import * as MUI from 'material-ui'
import styles from './ReportDetailStyles';
import Person from 'material-ui/svg-icons/social/person';
import { ReportMiddelware } from '../../store'
import { connect } from 'react-redux';
import Moment from 'react-moment';

function mapStateToProps(state) {
    return {
        reportDetail: state.ReportReducer.reportDetail,
        isAuthenticated: state.AuthReducer.isAuthenticated,
        isLoading: state.ReportReducer.isProcessing,
        authUser: state.AuthReducer.authUser,
        adminStatus: state.ReportReducer.adminStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getReportDetial: (reportCity,reportId)=> dispatch(ReportMiddelware.getReportDetial(reportCity,reportId)),
        updateStatus: (reportObj,newStatus,token)=> dispatch(ReportMiddelware.updateReportStatus(reportObj,newStatus,token)),
        getStatus: (reportObj,token)=> dispatch(ReportMiddelware.getStatus(reportObj,token)),

    };
}

class ReportDetail extends Component {
  componentWillMount() {
    this.props.getReportDetial(this.props.location.state.reportCity,this.props.params.id);
    {this.props.isAuthenticated?this.props.getStatus(this.props.location.state.reportCity,this.props.authUser.data.token):""}
  }


  renderReportBasedOnType(reportDetail){
    var date = new Date();
    if(reportDetail.dateSinceMissing) {
      date = new Date(reportDetail.dateSinceMissing);
    }
    var missingPersonEle = (
      <div>
          <div>Contatct No. : {reportDetail.no}</div>
          <div>Address : {reportDetail.description}</div>
          <div>Report Type. : {reportDetail.rType}</div>
      </div>
    );
    var complaints = (
      <div>
          <div>Title : {reportDetail.title}</div>
          <div>Description : {reportDetail.description}</div>
          <div>Contatct No. : {reportDetail.no}</div>
          <div>Report Type. : {reportDetail.rType}</div>
      </div>
    );

    var crimes = (
      <div>
          {complaints}
      </div>
    );

    if(reportDetail.rType==="Missing Person"){
      return missingPersonEle;
    }
    else if(reportDetail.rType==="Crime"){
      return crimes;
    }
    else {
      return complaints;
    }
  }

  handleSave (){
    //alert(this.refs.status.getValue());
    this.props.updateStatus(this.props.reportDetail,this.refs.status.getValue(),this.props.authUser.data.token);
  }
  renderStatusUpdateBoxForAdmin(){
    var statusUpdate = (
      <div>
        <MUI.Divider/>
        <MUI.Card>
          <MUI.CardText >
            <MUI.TextField
              ref="status"
              name="status"
              hintText="Status Updat"
              floatingLabelText="Status Update"
              fullWidth={true}
              required={true}
            />
            <MUI.RaisedButton label="Update"
                          primary={true}
                          onTouchTap={this.handleSave.bind(this)}
                          />
          </MUI.CardText>
        </MUI.Card>
        
      </div>
    );
    if(this.props.isAuthenticated && !this.props.authUser.data.user.Role){
      return statusUpdate;
    }

    
  }
  renderStatusList(reportDetail){
    var statusListKeys=[]
    
    // if(reportDetail.statuslist){
    //   statusListKeys = Object.keys(reportDetail.statuslist);
    // }
    var statusEle = (
      <div>
        <div style={{margin:20}}>
          Status Updates From Admin
        </div>
        {this.props.isLoading?<MUI.CircularProgress size={40} thickness={5} style={{marginLeft:"40%"}}/>:<MUI.Card>
                <MUI.CardText >
                  {this.props.adminStatus}
                </MUI.CardText>
              </MUI.Card>}
         
        
      </div>
    );
    return statusEle;
  }
  //user-default
  render() {
    console.log("test in reporit detail>>>>>>>>>>>>>>>>>>>.....",this.props);
    const {reportDetail} = this.props;
    //const date = new Date();
    const reportType = reportDetail.rType;
    //<div>Date Of Birth : {date.toString()}</div>
    return (
      <div style={styles.reportDetailContainer}>
        <MUI.Card>
          <MUI.CardHeader
            title={reportType==="Missing Person"?reportDetail.fullName:reportDetail.title}
            subtitle={reportDetail.city}
            avatar={<a href={reportDetail.image} ><MUI.Avatar src={reportDetail.image} /></a>}
          />
          <MUI.CardText >
            {this.renderReportBasedOnType(reportDetail)}
          </MUI.CardText>
        </MUI.Card>
        <MUI.Divider />
        
        {this.props.isAuthenticated?this.renderStatusList(reportDetail):""}
        
        {this.renderStatusUpdateBoxForAdmin(reportDetail)}
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ReportDetail)
