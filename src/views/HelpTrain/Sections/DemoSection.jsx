/*!

=========================================================
* Material Kit React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import './custom.css';

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import workStyle from "assets/jss/material-kit-react/views/landingPageSections/workStyle.jsx";

class WorkSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem cs={12} sm={12} md={8}>
            <h2 className={classes.title}>The Process</h2>
            <p className={classes.description}>
              Training a computer to be able to recognize sign language
              is no easy task. We need your help train our model. What this
              means is that we need people who know sign language to help!
              It's super simple and doesn't take long at all. Want to see
              the model in action? Click <a href="https://gmacmaster.github.io/visualizeModel/demo/" target="_blank">here</a>
            </p>
            <p className={classes.description}>
              You will be walked through a series of signs to preform. With each sign
              you will be told what to sign and given a picture of what the sign looks like.
              When your are ready you will click the "Start" button.  A countdown will then appear.
              During this time start preforming the sign. You will then see a signal the camera has
              started recording. For the next <strong>10 seconds</strong> it is important to keep signing.
              After the time has finished you will see a notification the time has ended. You will then
              see a prompt to redo the sign or move on. We have about 24 letters you can
              do, but you may click finish at any time. The last step is to then <strong>email </strong>
              the downloaded file to <strong>Gordon.MacMaster@uvm.edu</strong>
            </p>
            {/*             <h3 className={classes.title}>Here is a quick demo</h3>
           <div className="iframe-container">
              <iframe src="//www.youtube.com/embed/CIjXUg1s5gc" allowFullScreen/>
            </div>*/}
            <h3 className={classes.title}>Click the button below to start!</h3>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={4}
                className={classes.textCenter + ' ' + classes.autoMargin}
              >
                <Button color="primary" onClick={this.props.startTraining}>{this.props.trainingVisible ? 'Hide Demo' : 'Get Started!'}</Button>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object,
  trainingVisible: PropTypes.bool,
};

export default withStyles(workStyle)(WorkSection);
