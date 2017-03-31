import React, { Component } from 'react';
import styles from './CrimeSummaryStyles';
import InfoBox from '../InfoBox/InfoBox'
import Face from 'material-ui/svg-icons/action/face';
import Person from 'material-ui/svg-icons/social/person-add';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Fingerprint from 'material-ui/svg-icons/alert/warning';
import RecordVoiceOver from 'material-ui/svg-icons/action/record-voice-over';
import {cyan600, pink600, purple600, orange600,green800,blueGrey700} from 'material-ui/styles/colors';

class CrimeSummary extends Component {
  

  getFormatedCounts(cityNameOrTotal){
    const {reportCounts} = this.props;
    var totalCounts = {
      total: 0,
      complaints:0,
      crimes: 0,
      missingPersons: 0
    }
   
    totalCounts.crimes = reportCounts && reportCounts[cityNameOrTotal]? reportCounts[cityNameOrTotal].crimes:0;
    totalCounts.missingPersons = reportCounts && reportCounts[cityNameOrTotal]? reportCounts[cityNameOrTotal].missingPersons:0;
    totalCounts.complaints = reportCounts && reportCounts[cityNameOrTotal]? reportCounts[cityNameOrTotal].complaints:0;
    totalCounts.total = totalCounts.crimes 
                        + totalCounts.missingPersons 
                        + (this.props.isAuthenticated?totalCounts.complaints:0)
    return totalCounts;
  }
  //user-default

  renderComplaintsIfAuthenticated(totalCounts){
    let listings = this.props.myReportList.map(arr => {
      return (arr.filter(arr => arr.rType === "Complaint"))
    })
    let counting = listings.map(arr => {
      return arr.length
    }) 
    console.log()
    let complaintsEle = (
        <div style={styles.infoBoxDiv}>
          <InfoBox Icon={RecordVoiceOver}
                    color={orange600}
                    title="Complaints"
                    value={counting[0]}
            />
        </div>);
    if(this.props.isAuthenticated){
      return complaintsEle;
    }
  }

  render() {
    console.log(this.props.reportCounts);
    console.log(this.props.authUser);
    const totalCounts = this.props.reportCounts;
    return (
      <div style={styles.crimeSummaryContainer}>
        <div style={styles.infoBoxDiv}>
          <InfoBox Icon={Assessment}
                    color={blueGrey700}
                    title="Total"
                    value={totalCounts.Total}
            />
        </div>
        <div style={styles.infoBoxDiv}>
          <InfoBox Icon={Fingerprint}
                    color={pink600}
                    title="Crime Report"
                    value={totalCounts.crime}
            />
        </div>
        <div style={styles.infoBoxDiv}>
          <InfoBox Icon={Person}
                    color={green800}
                    title="Missing Persons"
                    value={totalCounts.Missing}
            />
        </div>
        {this.renderComplaintsIfAuthenticated(totalCounts)}
        <div style={styles.clear}/>
      </div>
    );
  }
}

export default CrimeSummary
