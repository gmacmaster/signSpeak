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

import * as signsToUse from '../Utils/Signs'

// @material-ui/icons
import CircularProgress from '@material-ui/core/CircularProgress';


import Webcam from "react-webcam";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

const MODEL_URL = 'https://raw.githubusercontent.com/gmacmaster/signSpeak/master/models/firstTry/model.json';

const modelParams = {
  flipHorizontal: true,
  outputStride: 16,
  imageScaleFactor: 0.7,
  maxNumBoxes: 1,
  iouThreshold: 0.5,
  scoreThreshold: 0.99,
  modelType: "ssdmobilenetv2"
};

const STANDARD_COLORS = [
  'AliceBlue', 'Chartreuse', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque',
  'BlanchedAlmond', 'BlueViolet', 'BurlyWood', 'CadetBlue', 'AntiqueWhite',
  'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan',
  'DarkCyan', 'DarkGoldenRod', 'DarkGrey', 'DarkKhaki', 'DarkOrange',
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



class ModelSection extends React.Component {
  constructor(props){
    console.log(STANDARD_COLORS.length);
    super(props);

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
      currentLetter: ''
    };

    let streamPromise = null;
    let modelPromise = null;
    let model = null;

    let fps = 0;

    this.signs = signsToUse.default;

    this.canvas = React.createRef();
    this.video = React.createRef();

    this.detectObjects = this.detectObjects.bind(this);
    this.initWebcamStream = this.initWebcamStream.bind(this);
    this.loadCustomModel = this.loadCustomModel.bind(this);
    this.loadModelAndDetection = this.loadModelAndDetection.bind(this);
    this.renderPredictionBoxes = this.renderPredictionBoxes.bind(this);
    this.setResultSize = this.setResultSize.bind(this);
  }

  componentWillMount() {
    this.refs = {}
  }

  componentDidMount() {
    this.streamPromise = this.initWebcamStream();
    this.loadModelAndDetection();
  }

  async detectObjects () {
    if (!this.state.isModelReady) return;
    let timeBegin = Date.now();


    const tfImg = tf.browser.fromPixels(document.getElementById('video'));
    //const tfImg = tf.browser.fromPixels(this.video);
    const smallImg = tf.image.resizeBilinear(tfImg, [600, 450]); // 600, 450
    const resized = tf.cast(smallImg, 'float32');
    const tf4d = tf.tensor4d(Array.from(resized.dataSync()), [1, 600, 450, 3]); // 600, 450
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
    if (navigator.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({
        audio: false, // don't capture audio
        video: { facingMode: 'environment' } // use the rear camera if there is
      })
          .then(stream => {
            // set <video> source as the webcam input
            let video = document.getElementById('video');
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

            /*
              model.detect uses tf.fromPixels to create tensors.
              tf.fromPixels api will get the <video> size from the width and height attributes,
                which means <video> width and height attributes needs to be set before called model.detect

              To make the <video> responsive, I get the initial video ratio when it's loaded (onloadedmetadata)
              Then addEventListener on resize, which will adjust the size but remain the ratio
              At last, resolve the Promise.
            */
            return new Promise((resolve, reject) => {
              // when video is loaded
              video.onloadedmetadata = () => {
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
    } else {
      return Promise.reject(new Error('Your browser does not support mediaDevices.getUserMedia API'))
    }
  }

  loadCustomModel() {
    let isModelReady = false;
    return loadGraphModel(MODEL_URL)
        .then((model) => {
          this.model = model;
          this.setState({ isModelReady: true})
          console.log('model loaded: ', model)
        })
        .catch((error) => {
          console.log('failed to load the model', error);
          throw (error)
        })
  }

  loadModelAndDetection(){
    this.modelPromise = this.loadCustomModel();

    // wait for both stream and model promise finished then start detecting objects
    Promise.all([this.streamPromise, this.modelPromise])
        .then(() => {
          this.detectObjects()
        }).catch((error) => {
      console.log('Failed to init stream and/or model: ');
      this.initFailMessage = error
    })
  }

  renderPredictionBoxes (predictionBoxes, totalPredictions, predictionClasses, predictionScores) {
    // get the context of canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw results
    for (let i = 0; i < totalPredictions[0]; i++) {
      const minY = predictionBoxes[i * 4] * 450;
      const minX = predictionBoxes[i * 4 + 1] * 600;
      const maxY = predictionBoxes[i * 4 + 2] * 450;
      const maxX = predictionBoxes[i * 4 + 3] * 600;
      const score = predictionScores[i] * 100;
      ctx.font = '14px Arial bold';

      if (score > 50) {
        ctx.beginPath();
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = STANDARD_COLORS[predictionClasses[i]-1];
        ctx.fillStyle = STANDARD_COLORS[predictionClasses[i]-1];
        ctx.stroke();
        ctx.font = '14px Arial bold';
        ctx.fillText(
            `${score.toFixed(1)} - ${this.signs[predictionClasses[i]-1].Sign}`,
            minX,
            minY > 10 ? minY - 5 : 10
        )
        let currentLetter = this.state.currentLetter;
        if (currentLetter !== this.signs[predictionClasses[i]-1].Sign) {
          currentLetter = this.signs[predictionClasses[i]-1].Sign;
          this.setState({ word: this.state.word + currentLetter, currentLetter})
        }
      }
      // Write FPS to top left
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#0063FF';
      ctx.fillStyle = "#0063FF"; // "rgba(244,247,251,1)";
      ctx.font = "bold 12px Arial";
      ctx.fillText("[FPS]: " + this.fps, 10, 20)
    }
  }

  setResultSize(){
    // get the current browser window size
    let clientWidth = document.documentElement.clientWidth;

    // set max width as 600
    this.state.resultWidth = Math.min(600, clientWidth);
    // set the height according to the video ratio
    this.state.resultHeight = this.state.resultWidth * this.state.videoRatio;

    // set <video> width and height
    /*
      Doesn't use vue binding :width and :height,
        because the initial value of resultWidth and resultHeight
        will affect the ratio got from the initWebcamStream()
    */
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    //let video = this.video;
    // video.width = this.state.resultWidth;
    // canvas.width = this.state.resultWidth;
    // video.height = this.state.resultHeight;
    // canvas.height = this.state.resultHeight;
    video.width = 600;
    canvas.width = 600;
    video.height = 450;
    canvas.height = 450;
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    const { classes } = this.props;
    return (
      <div className={classes.section} style={{paddingBottom: '0px'}}>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} style={{margin: '0 auto'}}>
              {!this.state.isModelReady ?
                  <React.Fragment>
                    <h3 className={classes.title}>Loading Model:</h3>
                    <div className="centeredText" style={{textAlign: 'center'}}>
                      <CircularProgress />
                    </div>
                  </React.Fragment> :
                  <React.Fragment>
                    <h3 className={classes.title} style={{marginTop: '0px'}}>Current Word: {this.state.word}</h3>
                    <Button color="primary" onClick={()=>this.setState({word: '', currentLetter: ''})}>Clear Word</Button>
                  </React.Fragment>
              }
              <div className="resultFrame" style={{display: 'grid', }}>
                <video id="video" ref={video => this.video} autoPlay style={{ gridArea: ' 1 / 1 / 2 / 2'}}/>
                <canvas id={"canvas"} ref={canvas => this.canvas } width={this.state.resultWidth} height={this.state.resultHeight} style={{ gridArea: ' 1 / 1 / 2 / 2'}}/>
              </div>
              <div className="video-container">

                {/*<Webcam*/}
                {/*    audio={false}*/}
                {/*    ref={this.video}*/}
                {/*    screenshotFormat="image/jpeg"*/}
                {/*    screenshotQuality={1}*/}
                {/*    videoConstraints={videoConstraints}*/}
                {/*/>*/}
              </div>
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
