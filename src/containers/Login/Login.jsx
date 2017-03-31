import React, { Component, PropTypes } from 'react';
//import styles from './Login-css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as MUI from 'material-ui'
import AppTheme from '../../app-theme';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Help from 'material-ui/svg-icons/action/help';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import './Login.css';
import { grey500 } from 'material-ui/styles/colors';
import { AuthMiddleware, ReportMiddelware } from '../../store'
import Crime from "../../images/01.jpg"
function mapStateToProps(state) {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    authUser: state.AuthReducer.authUser,
    isLoading: state.AuthReducer.isProcessing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signin: (credentials) => dispatch(AuthMiddleware.signin(credentials)),
    getMyReportList: (userId) => dispatch(ReportMiddelware.getMyReportList(userId)),

  };
}

class Login extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.handelSignin = this.handelSignin.bind(this);
    this.handelCancel = this.handelCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      if (this.props.isAuthenticated) {
        console.log("Authenticated true in signup");
        this.props.getMyReportList(this.props.authUser.data.token);
        this.context.router.push("/dashboard");

      }
    }, 0);
  }

  handelSignin() {
    this.props.signin(
      {
        "email": this.refs.email.getValue(),
        "password": this.refs.password.getValue()
      });
  }
  handelCancel() {
    this.context.router.push("/")
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={AppTheme}>
        <div>
          {this.props.isLoading ? <MUI.CircularProgress size={80} thickness={5} style={{ marginLeft: "50%", marginTop: "140px" }} /> : <div className="long-loginContainer">
            <MUI.Paper className="long-paper">
              <div className="title">
                <img src={Crime} width="100%" />
                <center><h1>USER LOGIN </h1></center>
              </div>
              <form>
                <MUI.TextField
                  ref="email"
                  hintText="E-mail"
                  floatingLabelText="E-mail"
                  fullWidth={true}
                />
                <MUI.TextField
                  ref="password"
                  hintText="Password"
                  floatingLabelText="Password"
                  fullWidth={true}
                  type="password"
                />
                <div className="long-buttonsDiv">
                  <Link to="/signup">
                    <MUI.FlatButton
                      label="Not A User ?"
                      className="long-flatButton"
                      icon={<PersonAdd />}
                    />
                  </Link>
                  
                </div>
                <div>

                  <MUI.RaisedButton label="Login"
                    secondary={true}
                    style={{ marginLeft: "10px" }}
                    className="long-loginBtn"
                    onTouchTap={this.handelSignin} />
                  <MUI.RaisedButton label="Cancel"
                    secondary={true}
                    className="long-loginBtn"
                    onTouchTap={this.handelCancel} />

                </div>
                <br />

              </form>
            </MUI.Paper>




          </div>}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
