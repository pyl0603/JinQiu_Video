import React from 'react';
import {
  HashRouter as Router,
  Redirect
} from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Cookies from "js-cookie";
import { routes } from './router';
import '@bcstyles/global.scss';

// export default App;
class App extends React.Component {
  render() {
    return (
      <Router>
        {renderRoutes(routes)}
        {Cookies.get('token') ? null: <Redirect to="/login" />}
      </Router>
    );
  }
}

export default App;
