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
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { HashRouter, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.7.0";

// pages for this product
import AboutUs from "views/AboutUs/AboutUs";
import Components from "views/Components/Components.jsx";
import HelpTrain from "views/HelpTrain/HelpTrain";
import SignDetection from "src/views/SignDetection/SignDetection";
import Test from "views/Test/HelpTrain";
import ImageChecking from "views/ImageChecking/ImageChecking";
import LandingPage from "views/LandingPage/LandingPage.jsx";
import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";

var hist = createBrowserHistory();

ReactDOM.render(
  <HashRouter history={hist} basename="/signSpeak">
    <Switch>
      <Route path="/aboutUs" component={AboutUs} />
      <Route path="/components" component={Components} />
      <Route path="/helpTrain" component={HelpTrain} />
      <Route path="/ImageChecking" component={ImageChecking} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/SignDetection" component={SignDetection} />
      <Route path="/test" component={Test} />
      <Route path="/" component={LandingPage} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
