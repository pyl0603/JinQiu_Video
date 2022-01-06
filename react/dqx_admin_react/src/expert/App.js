import React from 'react';
import {
  HashRouter as Router,
  Redirect
} from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Cookies from "js-cookie";
import { routes } from '@exsrc/router';
import '@exstyles/global.scss';
import './styles/config.less'

// export default App;
class App extends React.Component {
  render() {
    return (
      <Router>
        {renderRoutes(routes)}
      </Router>
    );
  }
}

export default App;
