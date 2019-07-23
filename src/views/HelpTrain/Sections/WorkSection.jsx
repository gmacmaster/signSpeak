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

//WebCam
import Webcam from "react-webcam";



//Signs
import * as Signs from '../Utils/Signs'

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
  setRef = webcam => {
    this.webcam = webcam;
  };
  testModel = null;
  canvas = null;
  video = null;

  constructor(props){
    super(props);

    // Load model
    // eslint-disable-next-line no-undef
    handTrack.load(modelParams).then(lmodel => {
      this.setState({loadingModel: false});
      this.testModel = lmodel;
    });

    const SignsLeft = Signs.default;
    const RandomIndex = Math.floor(Math.random()*SignsLeft.length);
    const CurrentSign = SignsLeft[RandomIndex];
    SignsLeft.splice(RandomIndex, 1);
    this.state = {
      loadingModel: true,
      SignsLeft,
      CurrentSign,
      trainingStarted: false,
    };

    this.startTraining = this.startTraining.bind(this);
  }

  runDetection(content){
    if(this.testModel){
      this.testModel.detect(content).then(predictions =>{
        console.log(predictions);
        document.getElementById('imageToRun').remove();
      })
    } else {
      console.log('Model not loaded yet')
    }
  }

 /* componentDidMount() {
    console.log('component mounted');
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGerUserMedia ||
        navigator.msGetUserMedia;
    // Get html elements
    const canvas = document.querySelector('#canvas');
    this.canvas = document.querySelector('#canvas');
    const video = document.querySelector('#video');
    this.video = document.querySelector('#video');
    const context = canvas.getContext('2d');
    let model;

    // eslint-disable-next-line no-undef
    handTrack.startVideo(video).then(status => {
      console.log(status);
      if(status){
        navigator.getUserMedia({video: {}}, stream =>{
              video.srcObject = stream;
              //setInterval(runDetection, 1000)
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
      this.setState({loadingModel: false});
      model = lmodel;
      this.testModel = lmodel;
    });
  }*/

  startTraining(){
    console.log('Start training');
  }

  capture = () => {
    const obj =this;
    const imageSrc = this.webcam.getScreenshot();
    const image = document.createElement("IMG");
    const a = document.createElement("A");
    a.href=imageSrc;
    a.download='test.jpeg';
    a.innerText='test';
    document.getElementById('imageContainer').appendChild(a);
    image.src = imageSrc;
    image.id = 'imageToRun';
    document.getElementById('imageContainer').appendChild(image);
    setTimeout(function () {
      obj.runDetection(document.getElementById('imageToRun'));
    });
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    const { classes } = this.props;
    return (
      <div className={classes.section} style={{paddingTop: '0px'}}>
        <GridContainer>
          <GridItem
              xs={12}
              sm={12}
              md={12}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
            {this.props.helpVisible ? null :         <GridContainer>
              <GridItem
                  xs={12}
                  sm={6}
                  md={6}
                  className={classes.textCenter + ' ' + classes.autoMargin}
              >
                <Button color="info" onClick={this.props.showHelp}>Show Demo</Button>
              </GridItem>
            </GridContainer>}
          </GridItem>
        </GridContainer>
        {this.state.loadingModel ?
            <React.Fragment>
              <h3 className={classes.title}>Loading Model:</h3>
              <div className="centeredText" style={{textAlign: 'center'}}>
                <CircularProgress />
              </div>
            </React.Fragment> :
            <GridContainer>
              <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  className={classes.textCenter + ' ' + classes.autoMargin}
              >
                <div className="video-container">
                  <Webcam
                    audio={false}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={1}
                    videoConstraints={videoConstraints}
                  />
                </div>
              </GridItem>
            </GridContainer>}
        {/*        <div className="video-container">
          <video id='video'/>
          <canvas id='canvas'/>
        </div>*/}
        {!this.state.trainingStarted ?
        <GridContainer>
          <GridItem
              xs={12}
              sm={12}
              md={12}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
            <Button color="success" onClick={this.capture}>Start</Button>
          </GridItem>
        </GridContainer> : null}
        {this.state.SignsLeft.length > 0 ?
        <GridContainer>
          <GridItem
              xs={12}
              sm={12}
              md={12}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
            <h1 className={classes.title}>Current Sign: {this.state.CurrentSign.Name}</h1>
          </GridItem>
        </GridContainer> : null }
        <GridContainer>
          <GridItem
              xs={12}
              sm={12}
              md={12}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
            <img src={this.state.CurrentSign.URL} alt={this.state.CurrentSign.Name}/>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem
              xs={12}
              sm={6}
              md={6}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
            <Button color="danger" onClick={this.props.showHelp}>Finish</Button>
          </GridItem>
        </GridContainer>
        <div id="imageContainer" />
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object,
  helpVisible: PropTypes.bool
};

export default withStyles(workStyle)(WorkSection);
