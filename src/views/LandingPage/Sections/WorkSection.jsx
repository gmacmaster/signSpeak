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

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import workStyle from "assets/jss/material-kit-react/views/landingPageSections/workStyle.jsx";

class WorkSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem cs={12} sm={12} md={8}>
            <h2 className={classes.title}>Help Us Improve!</h2>
            <h4 className={classes.description}>
              Training a computer to be able to recognize sign language
              is no easy task. We need your help train our model. What this
              means is that we need people who know sign language to help!
              It's super simple and doesn't take long at all.
            </h4>
            <h3 className={classes.title}>Click the button below to start!</h3>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={4}
                className={classes.textCenter + ' ' + classes.autoMargin}
              >
                <Button color="primary" href={process.env.PUBLIC_URL+'/#/helpTrain'}>Click Here!</Button>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

WorkSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(workStyle)(WorkSection);
