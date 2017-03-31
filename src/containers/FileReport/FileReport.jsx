import React, { Component,PropTypes } from 'react';
import styles from './FileReportStyles';
import * as MUI from 'material-ui'
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { ReportMiddelware } from '../../store'
import firebase from "firebase"
import FileUploader from 'react-firebase-file-uploader';

function mapStateToProps(state) {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated,
        authUser: state.AuthReducer.authUser,
        cityList : state.ReportReducer.cityList,
        isLoading: state.ReportReducer.isProcessing,
        reportCounts : state.ReportReducer.reportCounts,
        isReportSubmited : state.ReportReducer.isReportSubmited
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fileReport : (reportObj,reportCounts,token)=>dispatch(ReportMiddelware.fileReport(reportObj,reportCounts,token)) 
        //logout: () => dispatch(AuthMiddleware.logout())
    };
}

class FileReport extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props){
    super();
    console.log("component props ",props);
    this.state = {
      reportType : "",
      city:"",
      title:"",
      description:"",
      picture:"none",
      fullName:"",
      address:"",
      avatar: '',
      isUploading: false,
      progress: 0,
      identification:"",
      contactNo:"",
      ///age:0,
      dateSinceMissing:new Date(),
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeInDate = this.handleChangeInDate.bind(this);
  }


  componentWillUpdate(){
    console.log("test>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    setTimeout(()=> {
      if(this.props.isReportSubmited){
        console.log("isReportSubmited true >>>>>>>>>>>>>>>>>>>>>");
          this.context.router.push("/dashboard");
      }
    },0);
  }
  handleReportChange = (event, index, value) => {
    this.setState({reportType:value});
  }

  handleCityChange = (event, index, value) => this.setState({city:value});
  //handleChange = (event, index, value) => this.setState({bloodGroupValue:value});

  handleChangeInput(e){
    this.setState({[e.target.name]:e.target.value});
  }

  handleChangeInDate(e,newDate){
    this.setState({dateSinceMissing:newDate});
  }


  handleSave(){
    var reportObj = {
      reportType: this.state.reportType,
      city: this.state.city,
      contact:this.state.contactNo,
      userId: this.props.authUser.data.id,
      picture:this.state.picture
    };

    if(this.state.reportType==="Complaint" || this.state.reportType==="Crime Report") {
      reportObj.title = this.state.title;
      reportObj.description = this.state.description;
    }

    if(this.state.reportType==="Missing Report"){
       reportObj.title = this.state.title;
      reportObj.description = this.state.description;
    }
    this.props.fileReport(reportObj,this.props.reportCounts,this.props.authUser.data.token);
  }
 handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
      this.setState({isUploading: false});
      console.error(error);
  }
  handleUploadSuccess = (filename) => {
      this.setState({avatar: filename, progress: 100, isUploading: false});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({picture: url}));
  };

  renderPictureUploadField(){
    return (<div><img src={this.state.picture} style={{width:"300px"}} /><br />
    <FileUploader
            accept="image/*"
            name="avatar"
            randomizeFilename
            storageRef={firebase.storage().ref('images')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            required
          />
          </div>
        )
  }

  renderReportSpecificFields(reportType){
    if(reportType!=="Missing Report") {
      const fields = (
        <div>
          <MUI.TextField
              ref="title"
              name="title"
              hintText="Title"
              floatingLabelText="Title"
              value={this.state.title}
              onChange={this.handleChangeInput}
              fullWidth={true}
              required={true}
            />
          <MUI.TextField
              ref="description"
              name="description"
              hintText="Description"
              floatingLabelText="Description"
              value={this.state.description}
              onChange={this.handleChangeInput}
              fullWidth={true}
            /> <br />
            {reportType==="Crime Report"?this.renderPictureUploadField():null}
        </div>
      );
      return fields;
    }
    else {
      return this.renderMissingPersonFields();
    }
  }

  renderMissingPersonFields(){
    const fields = (
      <div>
         <MUI.TextField
              ref="title"
              name="title"
              hintText="Title"
              floatingLabelText="Title"
              value={this.state.title}
              onChange={this.handleChangeInput}
              fullWidth={true}
              required={true}
            />
          <MUI.TextField
              ref="description"
              name="description"
              hintText="Description"
              floatingLabelText="Description"
              value={this.state.description}
              onChange={this.handleChangeInput}
              fullWidth={true}
            /> <br />

          {this.renderPictureUploadField()}
      </div>
    );

    return fields;    
  }

  render() {
    return (
      <div style={styles.fileReportContainer}>
    <MUI.Paper style={styles.paper}>
          <h3 style={styles.title}>File A Report</h3>
          <MUI.Divider/>
          <form>

            <MUI.SelectField
              ref="reportType"
              floatingLabelText="Report Type"
              value={this.state.reportType}
              fullWidth={true}
              autoWidth={true}
              onChange={this.handleReportChange.bind(this)}>
                <MUI.MenuItem key="complaint" value="Complaint" primaryText="Complaint"/>
                <MUI.MenuItem key="crime" value="Crime Report" primaryText="Crime"/>
                <MUI.MenuItem key="missingperson" value="Missing Report" primaryText="Missing Person"/>
            </MUI.SelectField>
            <MUI.SelectField
              ref="city"
              floatingLabelText="City"
              value={this.state.city}
              fullWidth={true}
              autoWidth={true}
              onChange={this.handleCityChange.bind(this)}>
                {
                  this.props.cityList.map(city=>{
                    return <MUI.MenuItem key={city} value={city} primaryText={city}/>
                  })
                }
            </MUI.SelectField>
             <MUI.TextField
             type="number"
            ref="contactNo"
            name="contactNo"
            hintText="contactNo"
            floatingLabelText="contactNo"
            value={this.state.contactNo}
            onChange={this.handleChangeInput}            
            fullWidth={true}
          />

            {this.renderReportSpecificFields(this.state.reportType)}
          
          <div style={styles.buttons}>
            <Link to="/">
              <MUI.RaisedButton label="Cancel"/>
            </Link>

            <MUI.RaisedButton label="Save"
                          style={styles.saveButton}
                          onTouchTap={this.handleSave}
                          primary={true}/>
          </div>
        </form>

          <div style={styles.clear}/>
        </MUI.Paper>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FileReport);