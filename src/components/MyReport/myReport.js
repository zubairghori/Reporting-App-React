import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { CrimeSummary, CrimeReports } from '../../components'
import * as MUI from 'material-ui'
import { ReportMiddelware } from '../../store'
import Fingerprint from 'material-ui/svg-icons/action/fingerprint';
import RecordVoiceOver from 'material-ui/svg-icons/action/record-voice-over';
import ActionInfo from 'material-ui/svg-icons/action/info';
import { browserHistory } from 'react-router'

function mapStateToProps(state) {
    return {
        reportDetail: state.ReportReducer.myReportList,
        isAuthenticated: state.AuthReducer.isAuthenticated,
        isLoading: state.ReportReducer.isProcessing,
        authUser: state.AuthReducer.authUser,
    };
}
class myReport extends Component {
    constructor() {
        super();

        this.handleListItemClick = this.handleListItemClick.bind(this)
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
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

    handleListItemClick = (reportCity, reportId, reportType, reportss) => {
        console.log("Arsalan Sabir", reportType);
        if (reportType === "Complaint") {
            console.log(reportss)
            this.context.router.push({ pathname: "/reportItem/" + reportId, state: { reportCity: reportss } })

        }
        else {
            this.context.router.push({ pathname: "/reportItem/" + reportId, state: { reportCity: reportss } })


        }

    };
    renderList(reportType, iconComponent, data) {
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
                                onTouchTap={() => this.handleListItemClick(report.city, report.id, report.rType, report)}
                            />
                                <MUI.Divider /></div>)
                        })
                    })}

                </MUI.List>
            </div>
        );
    }
    render() {
        const { reportDetail } = this.props
        let complaint = reportDetail.map(arr => {
            return arr.filter(report => report.rType === "Complaint")
        })
        let missingReport = reportDetail.map(arr => {
            return arr.filter(report => report.rType === "Missing Report")
        })
        let crimeReport = reportDetail.map(arr => {
            return arr.filter(report => report.rType === "Crime Report")
        })
        console.log("Complaint:", complaint);
        console.log("Crime:", missingReport);
        console.log("Missing:", crimeReport);
        let comLen = complaint.map(arr => arr.length);
        let crimeLen = crimeReport.map(arr => arr.length);
        let missingLen = missingReport.map(arr => arr.length);

        return (<div>
            <MUI.Tabs>
                <MUI.Tab
                    label={"Crime"} >
                    {
                        (() => {
                            return crimeLen[0] > 0 ? this.renderList("Crime", <Fingerprint />, crimeReport)
                                : <div style={{ margin: 20 }}> No Crime Report</div>
                        })()
                    }
                </MUI.Tab>
                <MUI.Tab
                    label={"Missing Report"} >
                    {
                        (() => {
                            return missingLen[0] > 0 ? this.renderList("Crime", <Fingerprint />, missingReport)
                                : <div style={{ margin: 20 }}>No Missing Report </div>
                        })()
                    }
                </MUI.Tab>
                <MUI.Tab
                    label={"COMPLAINT"} >
                    {
                        (() => {
                            return comLen[0] > 0 ? this.renderList("Crime", <Fingerprint />, complaint)
                                : <div style={{ margin: 20 }}>No Missing Report </div>
                        })()
                    }
                </MUI.Tab>
            </MUI.Tabs>
        </div>)
    }
}

export default connect(mapStateToProps)(myReport)