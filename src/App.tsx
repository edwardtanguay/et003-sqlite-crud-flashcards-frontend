import { useContext } from 'react';
import { AppContext } from './AppContext';
import './App.scss';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { PageFlashcards } from './pages/PageFlashcards';
import { PageLogin } from './pages/PageLogin';
import { PageLogout } from './pages/PageLogout';

function App() {
	const {
		appMessage,
		deleteAppMessage,
		adminIsLoggedIn,
		systemErrorExists,
		flashcards,
	} = useContext(AppContext);
	return (
		<div className="App">
			{adminIsLoggedIn ? (
				<h1 className="adminMode">&lt;ADMIN MODE&gt;</h1>
			) : (
				<h1>Learn Site</h1>
			)}
			{appMessage && (
				<div className="appMessage">
					<div className="inner">
						<div className="messageText">
							{appMessage}{' '}
							{systemErrorExists && (
								<span>
									Please <a href="/">try again</a> later.
								</span>
							)}
						</div>{' '}
						{!systemErrorExists && (
							<button onClick={deleteAppMessage}>X</button>
						)}
					</div>
				</div>
			)}

			{flashcards.length === 0 ? (
				<div>loading...</div>
			) : (
				<>
					{!systemErrorExists && (
						<>
							<nav>
								<NavLink to="/flashcards">Flashcards</NavLink>
								{adminIsLoggedIn ? (
									<NavLink to="/logout">Logout</NavLink>
								) : (
									<NavLink to="/login">Login</NavLink>
								)}
							</nav>

							<Routes>
								<Route
									path="/flashcards"
									element={<PageFlashcards />}
								/>
								{adminIsLoggedIn ? (
									<Route
										path="/logout"
										element={<PageLogout />}
									/>
								) : (
									<Route
										path="/login"
										element={<PageLogin />}
									/>
								)}
								<Route
									path="/"
									element={
										<Navigate to="/flashcards" replace />
									}
								/>
							</Routes>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default App;
