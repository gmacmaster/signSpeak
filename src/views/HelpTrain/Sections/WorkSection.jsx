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
import LocationOn from "@material-ui/core/SvgIcon/SvgIcon";
import Card from "components/Card/Card.jsx";
import carouselStyle from "assets/jss/material-kit-react/views/componentsSections/carouselStyle.jsx";
import imagec1 from "assets/img/bg.jpg";
import imagec2 from "assets/img/bg2.jpg";
import imagec3 from "assets/img/bg3.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

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
  model = null;
  canvas = null;
  video = null;

  constructor(props){
    super(props);

    // Load model
    // eslint-disable-next-line no-undef
    handTrack.load(modelParams).then(lmodel => {
      this.setState({loadingModel: false});
      this.model = lmodel;
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
      seconds: 5,
      trainingSeconds: 10,
      showTimer: false,
      labeledImages: [],
    };
    this.timer = 0;
    this.traningTimer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.startTrainingTimer = this.startTrainingTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.countDownTrainingTimer = this.countDownTrainingTimer.bind(this);
    this.startTraining = this.startTraining.bind(this);
  }

  runDetection(content){
    if(this.model){
      this.model.detect(content).then(predictions =>{
        console.log(predictions);
        document.getElementById('imageToRun').remove();
        if(predictions.length > 0){
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            this.model.renderPredictions(predictions, canvas, context, content)
            const newImgSrc = canvas.toDataURL();
            const {labeledImages} = this.state;
            labeledImages.push(newImgSrc);
            this.setState({labeledImages});
        }
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
      this.model = lmodel;
    });
  }*/

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  startTrainingTimer() {
    if (this.traningTimer == 0 && this.state.trainingSeconds > 0) {
      this.traningTimer = setInterval(this.countDownTrainingTimer, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });
    if (seconds == 0) {
      clearInterval(this.timer);
      this.setState({seconds: 5, showTimer: false, trainingStarted: true}, () => {
        this.startTrainingTimer();
      });
      this.timer = 0;
    }
  }

  // 10 Second timer for training
  countDownTrainingTimer() {
    let seconds = this.state.trainingSeconds - 1;
    this.capture();
    this.setState({
      trainingSeconds: seconds,
    });
    if (seconds == 0) {
      clearInterval(this.traningTimer);
      this.setState({trainingSeconds: 10, trainingStarted: false})
      this.traningTimer = 0;
    }
  }

  startTraining(){
    console.log('Start training');
    this.setState({showTimer: true}, () => {this.startTimer()})
  }

  capture = () => {
    const obj =this;
    const imageSrc = this.webcam.getScreenshot();
    const image = document.createElement("IMG");
    image.src = imageSrc;
    image.id = 'imageToRun';
    image.style.display = 'none';
    document.getElementById('imageContainer').appendChild(image);
    setTimeout(function () {
      obj.runDetection(document.getElementById('imageToRun'));
    });
  };

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false
    };
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
        </div>*/}
        {this.state.showTimer ?
        <GridContainer>
          <GridItem
              xs={12}
              sm={12}
              md={12}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
          <h1 className={classes.title}>{this.state.seconds}</h1>
          </GridItem>
        </GridContainer> : null}
        {!this.state.trainingStarted && !this.state.loadingModel ?
        <GridContainer>
          <GridItem
              xs={12}
              sm={12}
              md={12}
              className={classes.textCenter + ' ' + classes.autoMargin}
          >
            <Button color="success" onClick={this.startTraining}>Start</Button>
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
        <canvas id='canvas' hidden/>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} className={classes.marginAuto}>
              <Card carousel>
                <Carousel className={'canvasCarousel'} infiniteLoop>
                    {this.state.labeledImages.map((imgSrc, index) => (
                        <div key={index}><img src={imgSrc} alt={'labeledImage-' + index}/></div>
                    ))}
                </Carousel>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object,
  helpVisible: PropTypes.bool
};

export default withStyles(workStyle)(WorkSection);
