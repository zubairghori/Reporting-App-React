import React, { Component, PropTypes } from 'react';
import * as MUI from 'material-ui'
import styles from './CrimeReportsStyles';
import Face from 'material-ui/svg-icons/social/person-add';
import Fingerprint from 'material-ui/svg-icons/alert/warning';
import RecordVoiceOver from 'material-ui/svg-icons/action/record-voice-over';
import ActionInfo from 'material-ui/svg-icons/action/info';
import {cyan600, pink600, purple600, orange600,green800,blueGrey700} from 'material-ui/styles/colors';


class CrimeReports extends Component {


  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = { complaint: "" }
    this.handleListItemClick = this.handleListItemClick.bind(this)
  }

  displayPrimaryTextBasedOnReportType(report) {

    if (report.rType === "Crime" || report.rType === "Complaint") {
      return report.description
    }
    else {
      return report.description;
    }
  }
  // componentDidMount(){
  //   this.setState({
  //     complaint:this.props.myReportList
  //   })
  // }
  displaySecondyTextBasedOnReportType(report) {
    if (report.reportType === "Crime" || report.reportType === "Complaint") {
      return report.city;
    }
    else {
      return report.city;
    }
  }
  /*
    handleListItemClick = (reportCity,reportId) => {
      console.log("test in >>>>>>>>><<<<<<<<<<<<<<")
      this.context.router.push("/reportItem/"+reportId);
    }*/

  //handleListItemClick = (reportId) =>this.context.router.push("/reportItem/"+reportId);
  handleListItemClick = (reportCity, reportId, reportType,reportss) => {
    console.log("Arsalan Sabir", reportType);
    if (reportType === "Complaint") {
      console.log(reportss)
      this.context.router.push({ pathname: "/reportItem/" + reportId, state: { reportCity: reportss } })
    }
    else {
      const reportList =  this.props.reportList;
      reportList.map(data => {
        data.data.filter(reports => reports.id == reportId).map(reports => {
          this.context.router.push({ pathname: "/reportItem/" + reportId, state: { reportCity: reports } })
        })
      })
    }

  };
  renderList(reportType, iconComponent, data) {
    // const reportList = this.props.showSelfReports ? this.props.myReportList : this.props.reportList;
    // data.map(arr=>{
    //   arr.map(datas => console.log(datas))
    // })
    return (
      <div>
        <MUI.List>
          {data.map(reports => {
            return reports.map(report => {
              return (<div> <MUI.ListItem key={report.id}
                leftAvatar={<MUI.Avatar icon={iconComponent} />}
                rightIcon={<ActionInfo />}
                primaryText={this.displayPrimaryTextBasedOnReportType(report)}
                secondaryText={this.displaySecondyTextBasedOnReportType(report)}
                onTouchTap={() => this.handleListItemClick(report.city, report.id, report.rType,report)}

              />
                <MUI.Divider /></div>)
            })
          })}

        </MUI.List>
      </div>


    );
  }


  renderComplaintsTabIfAuthenticated() {
    const reportList = this.props.myReportList;
    let listings = reportList.map(arr => {
      return (arr.filter(arr => arr.rType === "Complaint" && arr.city === this.props.city))
    })
   
    console.log(listings)

    let complaintsEle = (

      <MUI.Tab
       style={{backgroundColor:blueGrey700}}
        icon={<RecordVoiceOver />}
        label="Complaints">
        {
          (() => {
            return listings.map(arr => arr.length) > 0 ? this.renderList("Complaint", <Face />, listings)
              :
              <div style={{ margin: 20 }}>Luckly No Complaint Report for this city</div>

          })()
        }
      </MUI.Tab>);
    if (this.props.isAuthenticated) {
      return complaintsEle;
    }
  }

 
  render() {
    let reportLists = this.props.reportList.map(data => { return data });
    console.log(reportLists)
    let reporting = reportLists.map(data => {
      return (data.data)
    })
    let cityFilter = reporting.map(report => { return report.filter(arr => arr.city === this.props.city) })
    let hello = cityFilter.map(report => { return report.filter(type => type.rType === "Missing Report") })
    console.log(hello.length)
    return (
      <div style={styles.crimeReportsContainer}>
        <MUI.Tabs>
          <MUI.Tab
          style={{backgroundColor:blueGrey700}}
            icon={<Fingerprint />}
            label="Crimes">
            {
              (() => {
                var list = cityFilter.map(report => { return report.filter(type => type.rType === "Crime Report") })
                return list.map(arr => arr.length) > 0 ? this.renderList("Crime", <Fingerprint />, list)
                  :
                  <div style={{ margin: 20 }}>Luckly No Crime Report for this city</div>
              })()
            }
          </MUI.Tab>
          <MUI.Tab
            icon={<Face />}
             style={{backgroundColor:blueGrey700}}
            label="Missing Persons">
            {
              (() => {
                var list = cityFilter.map(report => { return report.filter(type => type.rType === "Missing Report") })
                return list.map(arr => arr.length) > 0 ? this.renderList("Missing Person", <Face />, list)
                  :
                  <div style={{ margin: 20 }}>Luckly No Missing Person Report for this city</div>
              })()
            }
          </MUI.Tab>
          {this.props.isAuthenticated ? this.renderComplaintsTabIfAuthenticated() : ""}
        </MUI.Tabs>
      </div>
    );
  }
}

export default CrimeReports


