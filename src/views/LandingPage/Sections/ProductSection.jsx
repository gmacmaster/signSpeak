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

// @material-ui/icons
import AccessibilityNew from "@material-ui/icons/AccessibilityNew";
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
import School from "@material-ui/icons/School";
import Videocam from "@material-ui/icons/Videocam";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

class ProductSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>Coming Soon: Translate in Live Time!</h2>
            <h5 className={classes.description}>
              Our computer vision model allows users to translate sign language
              in real time. Whether you're chatting with your friends, ordering a
              coffee, or teaching someone a new skill, we help bring understanding
              to everyone. At this time we are still building out our model. In the
              mean time we need help training our model! Please click{' '}
              <a href="/helpTrain">here</a> if you want to help.
            </h5>
          </GridItem>
        </GridContainer>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title="Accessibility"
                description="Making conversation accessible for everyone by allowing anyone to understand sign language."
                icon={AccessibilityNew}
                iconColor="success"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title="Live Translation"
                description="Access live translations through your browser or on your phone with AI. Our computer vision model has been trained to recognize {number of signs} signs on thousands of images."
                icon={Videocam}
                iconColor="info"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title="Learning"
                description="As our app grows, our translations will become more and more accurate as we get more user input, improve our model, and add more signs."
                icon={School}
                iconColor="danger"
                vertical
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

ProductSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(productStyle)(ProductSection);
