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

// handtrack.js
import * as handTrack from 'handtrackjs';

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';

import workStyle from "assets/jss/material-kit-react/views/landingPageSections/workStyle.jsx";

const modelParams = {
  flipHorizontal: true,   // flip e.g for video
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.79,    // confidence threshold for predictions.
};

class WorkSection extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loadingModel: true
    }
  }
  componentDidMount() {
    console.log('component mounted');
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGerUserMedia ||
        navigator.msGetUserMedia;
    // Get html elements
    const canvas = document.querySelector('#canvas');
    const video = document.querySelector('#video');
    const context = canvas.getContext('2d');
    let model;

    // eslint-disable-next-line no-undef
    handTrack.startVideo(video).then(status => {
      console.log(status);
      if(status){
        navigator.getUserMedia({video: {}}, stream =>{
              video.srcObject = stream;
              setInterval(runDetection, 1000)
            },
            error => {
              console.log(error);
            })
      }
    });

    function runDetection(){
      model.detect(video).then(predictions =>{
        console.log(predictions);
      })
    }

    // eslint-disable-next-line no-undef
    handTrack.load(modelParams).then(lmodel => {
      this.setState({loadingModel: false})
      model = lmodel
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <h2 className={classes.title}>Help Us Improve!</h2>
        <h4 className={classes.description}>
          Training a computer to be able to recognize sign language
          is no easy task. We need your help train our model. What this
          means is that we need people who know sign language to help!
          It's super simple and doesn't take long at all. Want to see
          the model in action? Click <a href="https://gmacmaster.github.io/visualizeModel/demo/" target="_blank">here</a>
        </h4>
        {this.state.loadingModel ?
            <React.Fragment>
              <h3 className={classes.title}>Loading Model:</h3>
              <div className="centeredText" style={{textAlign: 'center'}}>
                <CircularProgress />
              </div>
            </React.Fragment> : null}
        <div className="video-container">
          <video id='video'/>
          <canvas id='canvas'/>
        </div>
        <GridContainer>
          <GridItem
            xs={12}
            sm={12}
            md={4}
            className={classes.textCenter + ' ' + classes.autoMargin}
          >
            {this.props.helpVisible ? null : <Button color="primary" onClick={this.props.showHelp}>Show Demo</Button>}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object,
  helpVisible: PropTypes.bool
};

export default withStyles(workStyle)(WorkSection);
