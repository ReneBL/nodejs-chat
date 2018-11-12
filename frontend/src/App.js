import React, { Component } from 'react';
import './App.css';
import ChatRoom from './chatroom/ChatRoom';
import { isAuthenticated } from './util/AuthManager';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Authentication from './auth/Authentication';

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router>
				<div className="App">
					<Route path="/login" component={Authentication} />
					<Route path="/register" component={Authentication} />
					<Route path="/chatroom" component={ChatRoom} />
					<Route exact path="/"
						render={() => isAuthenticated() ?
							<Redirect to="/chatroom" />
							: <Redirect to="/login" />} />
				</div>
			</Router>
		);
	}
}

export default App;
