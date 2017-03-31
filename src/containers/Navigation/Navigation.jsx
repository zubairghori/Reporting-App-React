import React, { Component , PropTypes} from 'react';
import './Navigation.css';
import * as MUI from 'material-ui'
import {Link} from 'react-router';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Web from 'material-ui/svg-icons/av/web';
import { AuthMiddleware } from '../../store'
import Crime from "../../images/01.jpg"
import {blueGrey700} from 'material-ui/styles/colors';



function mapStateToProps(state) {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated,
        authUser: state.AuthReducer.authUser
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(AuthMiddleware.logout())
    };
}

class Navigation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }



  
  handelLogout() {
    this.props.logout();
    this.context.router.push("/")
  }

  renderAuthenticatedUserMenu(){
    const menu = (
      <div>
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="File A Report"
              leftIcon={<Web/>}
              containerElement={<Link to="/filereport"/>}
          />
          <MUI.MenuItem
            className="navigation-menuItem"
            primaryText="View My Reports"
            leftIcon={<Web/>}
            containerElement={<Link to="/myreports"/>}
          />
      </div>
    );
    return menu;
  }

  drawerMenu(){
    const {data} = this.props.authUser
    return (
      <div>
          <div className="navigation-avatar-div">
            {this.props.isAuthenticated?
            <Avatar src="https://img0bm.b8cdn.com/images/uploads/user_photos/92/17808492_20150627113405.jpg"
                    size={50}
                    className="navigation-icon"/>:""}
            <span className="navigation-span">{this.props.isAuthenticated?data.user.name:"Not Logged In"}</span>
            <span className="navigation-span">{this.props.isAuthenticated?data.user.Role?"User":"Admin":""}</span>
          </div>
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="Dashboard"
              leftIcon={<Assessment/>}
              containerElement={<Link to="/dashboard"/>}
            />
          {
            this.props.isAuthenticated?this.props.authUser.data.user.Role?this.renderAuthenticatedUserMenu():null:null}  
      <div>
        <img src={Crime} width="100%" style={{position:"fixed",bottom:0}}/>
        </div>
      </div>
    );
  }

  renderActionButtons(){

    const signup_signin_btn = (
            <div>
              <MUI.RaisedButton style={{marginRight:10}} label="Sign In" onTouchTap={()=>this.context.router.push("/login")}/>
              <MUI.RaisedButton label="Sign Up" onTouchTap={()=>this.context.router.push("/signup")}/>
            </div>);

    const signout = (
            <div>
              <MUI.RaisedButton label="Sign out" onTouchTap={this.handelLogout.bind(this)}/>
            </div>
            )

    if(this.props.isAuthenticated){
      return signout;
    }
    else {
      return signup_signin_btn;
    }
  }
  render() {

    return (
      <div className="navigation-container">
        <MUI.AppBar style={this.props.styles} title="Crime Reporting System"
        style={{backgroundColor:blueGrey700}}
              onLeftIconButtonTouchTap={this.props.drawerToggle}
              iconElementRight={this.renderActionButtons()}
              />
              
        <MUI.Drawer open={this.props.drawerOpen} docked={false}
            onRequestChange={this.props.drawerToggle}>
          {this.drawerMenu()}
        </MUI.Drawer>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navigation);
