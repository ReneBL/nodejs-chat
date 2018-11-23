import React, { Component } from 'react';
import './App.css';
import ChatRoom from './chatroom/ChatRoom';
import * as AuthManager from './util/AuthManager';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Authentication from './auth/Authentication';
import PrivateRoute from './util/PrivateRoute';

class App extends Component {

	render() {
		return (
			<Router>
				<div className="App">
					<Route path="/login" component={Authentication} />
					<Route path="/register" component={Authentication} />
					<PrivateRoute path="/chatroom" component={ChatRoom} />
					<Route exact path="/"
						render={() => AuthManager.isAuthenticated() ?
							<Redirect to="/chatroom" />
							: <Redirect to="/login" />} />
				</div>
			</Router>
		);
	}
}

export default App;
