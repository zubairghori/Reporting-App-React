import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {white, grey800,yellow800} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';

class InfoBox extends React.Component {

  render() {
    const {color, title, value, Icon} = this.props;

    const styles = {
      paper : {
        minWidth: 270,
        maxWidth: 270,
      },
      content: {
        padding: '5px 10px',
        marginLeft: 90,
        height: 80
      },
      number: {
        display: 'block',
        fontWeight: typography.fontWeightMedium,
        fontSize: 18,
          color: white,
          backgroundColor:color,
        fontWeight:"bold",
        position:"relative",
      },
      text: {
        fontSize: 20,
        fontWeight: typography.fontWeightLight,
        color: white,
        fontWeight:"bold",
        display:"block",
        position:"relative"
      },
      iconSpan: {
        float: 'left',
        height: 110,
        width: "100%",
        textAlign: 'center',
        backgroundColor: color
      },
      icon: {
        height: 40,
        width: 40,
        marginTop: 10,
        maxWidth: '100%'
      }
    };

    return (
      <Paper style={styles.paper}>
        <span style={styles.iconSpan}>
          <Icon color={white}
                style={styles.icon}
          />
           <span style={styles.text}>{title}</span>
          <span style={styles.number}>{value}</span>
        </span>

        {/*<div style={styles.content}>
          <span style={styles.text}>{title}</span>
          <span style={styles.number}>{value}</span>
        </div>*/}
      </Paper>
      );
  }
}

InfoBox.propTypes = {
  Icon: PropTypes.any,
  color: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.number
};

export default InfoBox;
