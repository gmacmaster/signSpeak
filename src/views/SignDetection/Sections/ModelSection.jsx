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
import * as tf from '@tensorflow/tfjs'
import { loadGraphModel } from '@tensorflow/tfjs-converter'
import '@tensorflow/tfjs-backend-wasm';

import * as signsToUse from '../Utils/Signs'

// @material-ui/icons
import CircularProgress from '@material-ui/core/CircularProgress';
import Learn from "@material-ui/icons/School";
import Play from "@material-ui/icons/VideogameAsset";
import Practice from "@material-ui/icons/DirectionsRun";


// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import pillsStyle from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";
import Dashboard from "@material-ui/core/SvgIcon/SvgIcon";

const MODEL_URL = 'https://raw.githubusercontent.com/gmacmaster/signSpeak/master/models/try6/model.json';
//try 5,6, 14 best so far
// model tries: 2, 3, 8


const STANDARD_COLORS = [
  'AliceBlue', 'Chartreuse', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque',
  'BlueViolet', 'BurlyWood',
  'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan',
  'DarkCyan', 'DarkGoldenRod', 'DarkOrange',
  'DarkOrchid', 'DarkSalmon', 'DarkSeaGreen', 'DarkTurquoise', 'DarkViolet',
  'DeepPink', 'DeepSkyBlue', 'DodgerBlue', 'FireBrick', 'FloralWhite',
  'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod',
  'Salmon', 'Tan', 'HoneyDew', 'HotPink', 'IndianRed', 'Ivory', 'Khaki',
  'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue',
  'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey',
  'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue',
  'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime',
  'LimeGreen', 'Linen', 'Magenta', 'MediumAquaMarine', 'MediumOrchid',
  'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen',
  'MediumTurquoise', 'MediumVioletRed', 'MintCream', 'MistyRose', 'Moccasin',
  'NavajoWhite', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed',
  'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed',
  'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple',
  'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Green', 'SandyBrown',
  'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue',
  'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'GreenYellow',
  'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White',
  'WhiteSmoke', 'Yellow', 'YellowGreen'
];

let WIDTH = 600;
let HEIGHT = 450;



class ModelSection extends React.Component {
  constructor(props){
    super(props);

    this.signs = signsToUse.default;

    this.state = {
      showTrainingSection: false,
      showHelpSection: true,
      resultWidth: 0,
      resultHeight: 0,
      videoRatio: 1,
      isVideoStreamReady:false,
      isModelReady: false,
      initFailMessage: '',
      word: '',
      currentLetter: '',
      currentSign: Math.floor(Math.random()*this.signs.length),
      activeTab: 0
    };

    this.canvas = React.createRef();
    this.video = React.createRef();

    this.detectObjects = this.detectObjects.bind(this);
    this.initWebcamStream = this.initWebcamStream.bind(this);
    this.loadCustomModel = this.loadCustomModel.bind(this);
    this.loadModelAndDetection = this.loadModelAndDetection.bind(this);
    this.renderPredictionBoxes = this.renderPredictionBoxes.bind(this);
    this.setResultSize = this.setResultSize.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.swichLetter = this.swichLetter.bind(this);
  }

  componentWillMount() {
    this.refs = {}
  }

  componentDidMount() {
    this.streamPromise = this.initWebcamStream();
    this.loadModelAndDetection();
    let width = document.getElementById("resultFrame").getBoundingClientRect().width;
    if(width < 600){
      WIDTH=width;
      HEIGHT=width*.75
    }
  }

  handleTabChange(activeTab){
    switch (activeTab) {
      case 2:
        this.setState({
          word: '',
          currentLetter: '',
          activeTab
        });
        break;
      default:
        const randSign = Math.floor(Math.random()*this.signs.length);
        this.setState({currentSign: randSign, activeTab});
        break;
    }
  }

  swichLetter(){
    const randSign = Math.floor(Math.random()*this.signs.length);
    this.setState({currentSign: randSign});
  }

  async detectObjects () {
    if (!this.state.isModelReady) return;
    let timeBegin = Date.now();


    const tfImg = tf.browser.fromPixels(document.getElementById('video'));

    //const tfImg = tf.browser.fromPixels(this.video);
    const smallImg = tf.image.resizeBilinear(tfImg, [300, 300]); // 600, 450
    const resized = tf.cast(smallImg, 'float32');
    const tf4d = tf.tensor4d(Array.from(resized.dataSync()), [1, 300, 300, 3]); // 600, 450
    let predictions = await this.model.executeAsync({ image_tensor: tf.cast(tf4d, 'int32') }, ['detection_boxes', 'num_detections', 'detection_classes', 'detection_scores']);
    let timeEnd = Date.now();
    this.fps = Math.round(1000 / (timeEnd - timeBegin));
    this.renderPredictionBoxes(predictions[0].dataSync(), predictions[1].dataSync(), predictions[2].dataSync(), predictions[3].dataSync());

    tfImg.dispose();
    smallImg.dispose();
    resized.dispose();
    tf4d.dispose();

    requestAnimationFrame(() => {
      this.detectObjects()
    })
  }

  initWebcamStream () {
    // if the browser supports mediaDevices.getUserMedia API
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    // if (navigator.getUserMedia) {
    //
    // } else {
    //   return Promise.reject(new Error('Your browser does not support mediaDevices.getUserMedia API'))
    // }
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user"
      }
    })
        .then(stream => {
          window.localStream = stream;
          // set <video> source as the webcam input
          const video = document.getElementById('video');
          //let video = this.video;
          try {
            //document.getElementById('video').srcObject = stream;

            video.srcObject = stream
          } catch (error) {
            console.log(error);
            // support older browsers
            //document.getElementById('video').src = window.URL.createObjectURL(stream);
            video.src = window.URL.createObjectURL(stream);
          }
          return new Promise((resolve, reject) => {
            // when video is loaded
            video.onloadedmetadata = () => {
              video.play();
              // calculate the video ratio
              this.state.videoRatio = video.offsetHeight / video.offsetWidth;
              // add event listener on resize to reset the <video> and <canvas> sizes
              window.addEventListener('resize', this.setResultSize);
              // set the initial size
              this.setResultSize();

              this.state.isVideoStreamReady = true;
              console.log('webcam stream initialized');
              resolve()
            }
          })
        })
        .catch(error => {
          console.log('failed to initialize webcam stream', error);
          throw (error)
        })
  }

  loadCustomModel() {
    let isModelReady = false;
    return loadGraphModel(MODEL_URL)
        .then((model) => {
          this.model = model;
          console.log('model loaded: ', model)
          this.setState({ isModelReady: true});
        })
        .catch((error) => {
          console.log('failed to load the model', error);
          this.setState({ isModelReady: false});
          throw (error)
        });
  }

  loadModelAndDetection(){
    tf.setBackend('wasm').then(() => {
      this.modelPromise = this.loadCustomModel();

      // wait for both stream and model promise finished then start detecting objects
      Promise.all([this.streamPromise, this.modelPromise])
          .then(() => {
            this.detectObjects()
          }).catch((error) => {
        console.log('Failed to init stream and/or model: ');
        this.initFailMessage = error
      })
    }).catch(() => {
      this.modelPromise = this.loadCustomModel();

      // wait for both stream and model promise finished then start detecting objects
      Promise.all([this.streamPromise, this.modelPromise])
          .then(() => {
            this.detectObjects()
          }).catch((error) => {
        console.log('Failed to init stream and/or model: ');
        this.initFailMessage = error
      })
    });

  }

  renderPredictionBoxes (predictionBoxes, totalPredictions, predictionClasses, predictionScores) {
    // get the context of canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw results
    for (let i = 0; i < totalPredictions[0]; i++) {
      const minY = predictionBoxes[i * 4] * HEIGHT;
      const minX = predictionBoxes[i * 4 + 1] * WIDTH;
      const maxY = predictionBoxes[i * 4 + 2] * HEIGHT;
      const maxX = predictionBoxes[i * 4 + 3] * WIDTH;
      const score = predictionScores[i] * 100;
      ctx.font = '14px Arial bold';

      if (score > 50) {
        ctx.beginPath();
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = STANDARD_COLORS[predictionClasses[i]-1];
        ctx.fillStyle = STANDARD_COLORS[predictionClasses[i]-1];
        ctx.stroke();
        ctx.font = '14px Arial bold';
        ctx.fillText(
            `${score.toFixed(1)} - ${this.signs[predictionClasses[i]-1].Sign}`,
            minX,
            minY > 10 ? minY - 5 : 10
        );
        const { activeTab } = this.state;
        switch (activeTab) {
          case 2:
            let currentLetter = this.state.currentLetter;
            if (currentLetter !== this.signs[predictionClasses[i]-1].Sign) {
              currentLetter = this.signs[predictionClasses[i]-1].Sign;
              this.setState({ word: this.state.word + currentLetter, currentLetter})
            }
            break;
          default:
            const letterSigned = this.signs[predictionClasses[i]-1].Sign;
            const { currentSign } = this.state;
            if(letterSigned === this.signs[currentSign].Sign){
              const randSign = Math.floor(Math.random()*this.signs.length);
              this.setState({currentSign: randSign});
            }
            break;
        }
      }
      // Write FPS to top left
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#0063FF';
      ctx.fillStyle = "#0063FF"; // "rgba(244,247,251,1)";
      ctx.font = "12px Arial";
      ctx.fillText("[FPS]: " + this.fps, 10, 20)
    }
  }

  setResultSize(){
    // get the current browser window size
    let clientWidth = document.documentElement.clientWidth;

    // set max width as 600
    this.state.resultWidth = Math.min(WIDTH, clientWidth);
    // set the height according to the video ratio
    this.state.resultHeight = this.state.resultWidth * this.state.videoRatio;

    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    video.width = WIDTH;
    canvas.width = WIDTH;
    video.height = HEIGHT;
    canvas.height = HEIGHT;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section} style={{paddingBottom: '0px'}}>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} style={{margin: '0 auto'}} id="vidContainer">
              {!this.state.isModelReady ?
                  <React.Fragment>
                    <h3 className={classes.title}>Loading Model:</h3>
                    <div className="centeredText" style={{textAlign: 'center'}}>
                      <CircularProgress />
                    </div>
                  </React.Fragment> :
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8} lg={6} style={{color: 'black', margin: '0 auto'}}>
                      <NavPills
                          handleTabChange={this.handleTabChange}
                          color="primary"
                          tabs={[
                            {
                              tabButton: "Learn",
                              tabIcon: Learn,
                              tabContent: (
                                <span>
                                  Sign the letter {this.signs[this.state.currentSign].Name}
                                  <img src={this.signs[this.state.currentSign].URL}
                                       alt={this.signs[this.state.currentSign].Name}
                                       style={{marginBottom: '10px', cursor: 'pointer'}}
                                       onClick={this.swichLetter}
                                  />
                                </span>
                              )
                            },
                            {
                              tabButton: "Practice",
                              tabIcon: Practice,
                              tabContent: (
                                <span>
                                  Sign the letter {this.signs[this.state.currentSign].Name}
                                  <br/>
                                  <a onClick={this.swichLetter} style={{cursor: 'pointer'}}>Switch</a>
                                </span>
                              )
                            },
                            {
                              tabButton: "Play",
                              tabIcon: Play,
                              tabContent: (
                                  <span>
                                <h3 className={classes.title} style={{marginTop: '0px'}}>Current Word: {this.state.word}</h3>
                                <Button color="primary" onClick={()=>this.setState({word: '', currentLetter: ''})}>Clear Word</Button>
                        </span>
                              )
                            }
                          ]}
                      />
                    </GridItem>
                  </GridContainer>
              }
              <div className="resultFrame" style={{display: 'grid', }} id={"resultFrame"}>
                <video id="video" ref={video => this.video} autoPlay style={{ gridArea: ' 1 / 1 / 2 / 2'}} controls={false} playsInline/>
                <canvas id={"canvas"} ref={canvas => this.canvas } width={this.state.resultWidth} height={this.state.resultHeight} style={{ gridArea: ' 1 / 1 / 2 / 2' }}/>
              </div>
              <br/>
              <br/>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

ModelSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(productStyle)(ModelSection);
