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
      userHasStarted: false,
      loadingModel: true,
      SignsLeft,
      CurrentSign,
      trainingStarted: false,
      seconds: 5,
      trainingSeconds: 10,
      showTimer: false,
      labeledImages: [],
      imageSrc: [],
      currentSignImageSrc: [],
      completedPredictions: [],
      currentSignPredictions: [],
      showCamera: true,
      carouselIndex: 0,
    };
    this.timer = 0;
    this.traningTimer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.startTrainingTimer = this.startTrainingTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.countDownTrainingTimer = this.countDownTrainingTimer.bind(this);
    this.startTraining = this.startTraining.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.redoSign = this.redoSign.bind(this);
    this.nextSign = this.nextSign.bind(this);
    this.renderPredictions = this.renderPredictions.bind(this);
    this.carouselSwitch = this.carouselSwitch.bind(this);
    this.movePrediction = this.movePrediction.bind(this);
  }

  redoSign(){
      // eslint-disable-next-line no-restricted-globals
      const confirmRedo = confirm('Are you sure you want to redo this sign? All data for THIS sign will be lost');
      if(confirmRedo) {
        this.setState({
            labeledImages: [],
            currentSignImageSrc: [],
            currentSignPredictions: []
        }, () => {this.startTraining()});
    }
  }

  nextSign(){
      // eslint-disable-next-line no-restricted-globals
      const confirmNext = confirm('Ready to move on? You will no longer be able to edit the signs for this sign');
      if(confirmNext) {
        console.log(this.state.CurrentSign);
        const { SignsLeft, currentSignImageSrc, currentSignPredictions } = this.state;
          const RandomIndex = Math.floor(Math.random()*SignsLeft.length);
          const newSign = SignsLeft[RandomIndex];
          SignsLeft.splice(RandomIndex, 1);
          this.setState({
              SignsLeft,
              CurrentSign: newSign,
              labeledImages: [],
              imageSrc: this.state.imageSrc.concat(currentSignImageSrc),
              currentSignImageSrc: [],
              currentSignPredictions: [],
              completedPredictions: this.state.completedPredictions.concat(currentSignPredictions),
              userHasStarted: false,
              showCamera: true,
          })
    }
  }

  renderPredictions(predictions, content){
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      this.model.renderPredictions(predictions, canvas, context, content);
      const newImgSrc = canvas.toDataURL();
      return newImgSrc;
  }

  runDetection(content){
    if(this.model){
      this.model.detect(content).then(predictions =>{
        document.getElementById('imageToRun').remove();
        if(predictions.length === 1){
            const {labeledImages, currentSignPredictions} = this.state;
            const newImgSrc = this.renderPredictions(predictions, content);
            labeledImages.push(newImgSrc);
            currentSignPredictions.push(predictions);
            this.setState({labeledImages, currentSignPredictions});
        }
      })
    } else {
      console.log('Model not loaded yet')
    }
  }

  movePrediction(direction) {
      console.log(this.state);
      const { carouselIndex, currentSignPredictions, currentSignImageSrc, labeledImages } = this.state;
      const currentPrediction = currentSignPredictions[carouselIndex];
      console.log(currentPrediction[0].bbox[1]);
      switch (direction) {
        case 'up':
          currentPrediction[0].bbox[1] = currentPrediction[0].bbox[1] - 10;
            break;
        case 'down':
          currentPrediction[0].bbox[1] = currentPrediction[0].bbox[1] + 10;
          break;
        case 'left':
          currentPrediction[0].bbox[0] = currentPrediction[0].bbox[0] - 10;
          break;
        case 'right':
          currentPrediction[0].bbox[0] = currentPrediction[0].bbox[0] + 10;
          break;
        case 'bigger':
          currentPrediction[0].bbox[2] = currentPrediction[0].bbox[2] * 1.05;
          currentPrediction[0].bbox[3] = currentPrediction[0].bbox[3] * 1.05;
          break;
        default:
          currentPrediction[0].bbox[2] = currentPrediction[0].bbox[2] * .95;
          currentPrediction[0].bbox[3] = currentPrediction[0].bbox[3] * .95;
          break;
      }
      currentSignPredictions[carouselIndex] = currentPrediction;
      const image = document.createElement("IMG");
      image.src = currentSignImageSrc[carouselIndex];
      image.id = 'imageToRun';
      image.style.display = 'none';
      document.getElementById('imageContainer').appendChild(image);
      const newImgSrc = this.renderPredictions(currentSignPredictions[carouselIndex], document.getElementById('imageToRun'));
      document.getElementById('imageToRun').remove();
      console.log(newImgSrc);
      labeledImages[carouselIndex] = newImgSrc;
      this.setState({carouselIndex, currentSignPredictions, labeledImages})
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
      this.setState({seconds: 5, showTimer: false, trainingStarted: true, userHasStarted: true}, () => {
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
      this.setState({trainingSeconds: 10, trainingStarted: false, showCamera: false});
      this.traningTimer = 0;
    }
  }

  startTraining(){
    console.log('Start training');
    this.setState({showTimer: true, showCamera: true}, () => {this.startTimer()})
  }

  capture = () => {
    const obj =this;
    const imageSrc = this.webcam.getScreenshot();
    const { currentSignImageSrc } = this.state;
    currentSignImageSrc.push(imageSrc);
    this.setState({currentSignImageSrc});
    const image = document.createElement("IMG");
    image.src = imageSrc;
    image.id = 'imageToRun';
    image.style.display = 'none';
    document.getElementById('imageContainer').appendChild(image);
    setTimeout(function () {
      obj.runDetection(document.getElementById('imageToRun'));
    });
  };

  carouselSwitch(index){
    this.setState({carouselIndex: index})
  }

  removeImage(){
    const {labeledImages, carouselIndex} = this.state;
    labeledImages.splice(carouselIndex, 1);
    this.setState({labeledImages, carouselIndex: 0});
  }

  render() {
      console.log(this.state);
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
              {this.state.showCamera?
                <div className="video-container">
                  <Webcam
                    audio={false}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={1}
                    videoConstraints={videoConstraints}
                  />
                </div> :
                  (this.state.labeledImages.length > 0 ? <Card carousel>
                  Please Review these photos.
                  <Carousel selectedItem={this.state.carouselIndex} className={'canvasCarousel'} infiniteLoop onChange={this.carouselSwitch}>
                  {this.state.labeledImages.map((imgSrc, index) => (
                      <div key={index}><img src={imgSrc} alt={'labeledImage-' + index}/></div>
                  ))}
                </Carousel>
                  <div>
                    <Button color="info" onClick={() => this.movePrediction('up')} size="sm">Up</Button><br/>
                    <Button color="info" onClick={() => this.movePrediction('left')} size="sm">Left</Button>
                    <Button color="info" onClick={() => this.movePrediction('right')} size="sm">Right</Button><br/>
                    <Button color="info" onClick={() => this.movePrediction('down')} size="sm">Down</Button>
                  </div>
                  <div>
                    <Button color="info" onClick={() => this.movePrediction('smaller')} size="sm">Smaller</Button>
                    <Button color="info" onClick={() => this.movePrediction('bigger')} size="sm">Bigger</Button>
                  </div>
                  <div><Button color="danger" onClick={this.removeImage} size="sm" className="removeButton">Remove</Button></div>
                  </Card> : null)
              }
              </GridItem>
            </GridContainer>}
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
        {!this.state.trainingStarted && !this.state.loadingModel && !this.state.userHasStarted ?
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
        {!this.state.trainingStarted && !this.state.loadingModel && this.state.userHasStarted ?
          <GridContainer>
              <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  className={classes.textCenter + ' ' + classes.autoMargin}
              >
                  <Button color="warning" onClick={this.redoSign}>Redo Sign</Button>
                  <Button color="success" onClick={this.nextSign}>Next Sign</Button>
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
            <Button color="warning" onClick={this.props.showHelp}>Finish</Button>
          </GridItem>
        </GridContainer>
        <div id="imageContainer" />
        <canvas id='canvas' hidden/>
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object,
  helpVisible: PropTypes.bool
};

export default withStyles(workStyle)(WorkSection);
