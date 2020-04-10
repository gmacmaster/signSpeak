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
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

// Sections for this page
import DemoSection from "./Sections/DemoSection.jsx";
import ProductSection from "./Sections/ProductSection.jsx";
import ModelSection from "./Sections/ModelSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";

const dashboardRoutes = [];

class SignDetection extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showTrainingSection: false,
      showHelpSection: true
    };
    this.showHelp = this.showHelp.bind(this);
    this.startTraining = this.startTraining.bind(this);
  }
  startTraining(){
    this.setState({showTrainingSection: true, showHelpSection: false})
  }
  showHelp(){
    this.setState({showHelpSection: true})
  }
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="SngSpeak, Sign Language Translation"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 100,
            color: "white"
          }}
          {...rest}
        />
        <Parallax filter image={require("assets/img/landing-bg.jpg")} small>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h2 className={classes.title}>Try Out Our Model!</h2>
                <h4>
                  So far the model is very limited in its accuracy. We continue to
                  work to make improvements and will update this page as they come.
                  If you want to help make the model better, visit <a href={'/#/helpTrain'} target={'_blank'}>this</a> page!
                </h4>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <ModelSection />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

SignDetection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPageStyle)(SignDetection);
