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
import School from "@material-ui/icons/School";
import Videocam from "@material-ui/icons/Videocam";
import Lock from "@material-ui/icons/Lock";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

class ProductSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section} style={{paddingBottom: '0px'}}>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <InfoArea
                title="Security"
                description="No identifying information is stored with your photos and we will not share them with anyone. We promise."
                icon={Lock}
                iconColor="danger"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <InfoArea
                title="Live Gesture Recognition"
                description="We use existing computer vision models to identify your hands and label the photos for training of our own models"
                icon={Videocam}
                iconColor="info"
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
