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
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

class ProductSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section} style={{paddingBottom: '0'}}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>The Project</h2>
            <h5 className={classes.description}>
              This project was created as a senior thesis for the University
              of Vermont's Honors College class of 2020. Over the past several
              years there have been incredible advancements in machine learning
              and object detection. They’re now being used in everything from
              security systems to self-driving cars, to automated sorting
              facilities. One area that has had little benefit from the
              advancements in breaking down the communication barriers between
              the Deaf and those who are unable to understand sign language.
              A project that was initially designed as a translation tool
              took on took an unexpected turn that looked deeper
              at the differences and challenges among various object detection
              algorithms, how computing power affects how fast and efficiently
              code can run, and how difficult it can be to work with people.
              Read the full paper <a href={"https://gmacmaster.github.io/signSpeak/Thesis.pdf"} target={"_blank"}>here</a>.
            </h5>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

ProductSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(productStyle)(ProductSection);
