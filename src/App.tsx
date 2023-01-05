import { useContext } from 'react';
import { AppContext } from './AppContext';
import './App.scss';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { PageWelcome } from './pages/PageWelcome';
import { PageLogin } from './pages/PageLogin';
import { PageLogout } from './pages/PageLogout';

function App() {
	const { appMessage, deleteAppMessage, adminIsLoggedIn} =
		useContext(AppContext);
	return (
		<div className="App">
			{adminIsLoggedIn ? (
				<h1 className="adminMode">&lt;ADMIN MODE&gt;</h1>
			) : (
				<h1>Info Site</h1>
			)}
			{appMessage && (
				<div className="appMessage">
					<div className="inner">
						<div className="messageText">{appMessage}</div>{' '}
						<button onClick={deleteAppMessage}>X</button>
					</div>
				</div>
			)}
			<nav>
				<NavLink to="/welcome">Welcome</NavLink>
				{adminIsLoggedIn ? (
					<NavLink to="/logout">Logout</NavLink>
				) : (
					<NavLink to="/login">Login</NavLink>
				)}
			</nav>

			<Routes>
				<Route path="/welcome" element={<PageWelcome />} />
				{adminIsLoggedIn ? (
					<Route path="/logout" element={<PageLogout />} />
				) : (
					<Route path="/login" element={<PageLogin />} />
				)}
				<Route path="/" element={<Navigate to="/welcome" replace />} />
			</Routes>
		</div>
	);
}

export default App;
