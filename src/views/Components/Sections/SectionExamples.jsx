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
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import exampleStyle from "assets/jss/material-kit-react/views/componentsSections/exampleStyle.jsx";

import landing from "assets/img/landing.jpg";
import profile from "assets/img/profile.jpg";

class SectionExamples extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <Link to="landing-page" className={classes.link}>
                <img
                  src={landing}
                  alt="..."
                  className={
                    classes.imgRaised +
                    " " +
                    classes.imgRounded +
                    " " +
                    classes.imgFluid
                  }
                />
                <Button color="primary" size="lg" simple>
                  View landing page
                </Button>
              </Link>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Link to="profile-page" className={classes.link}>
                <img
                  src={profile}
                  alt="..."
                  className={
                    classes.imgRaised +
                    " " +
                    classes.imgRounded +
                    " " +
                    classes.imgFluid
                  }
                />
                <Button color="primary" size="lg" simple>
                  View profile page
                </Button>
              </Link>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

SectionExamples.propTypes = {
  classes: PropTypes.object
};

export default withStyles(exampleStyle)(SectionExamples);
