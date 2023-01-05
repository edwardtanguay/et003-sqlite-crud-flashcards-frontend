import { useState, useEffect } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { IFlashcard } from './interfaces';

interface IAppContext {
	appTitle: string;
	loginAsAdmin: (callback: () => void) => void;
	logoutAsAdmin: () => void;
	password: string;
	setPassword: (password: string) => void;
	appMessage: string;
	deleteAppMessage: () => void;
	adminIsLoggedIn: boolean;
	flashcards: IFlashcard[];
	handleDeleteFlashcard: (flashcard: IFlashcard) => void;
}

interface IAppProvider {
	children: React.ReactNode;
}

const backendUrl = 'http://localhost:3515';

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
	const appTitle = 'Info Site';
	const [password, setPassword] = useState('');
	const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [flashcards, setFlashcards] = useState([]);

	useEffect(() => {
		(async () => {
			setFlashcards((await axios.get(`${backendUrl}/flashcards`)).data);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const user = (
					await axios.get(`${backendUrl}/currentuser`, {
						withCredentials: true,
					})
				).data;
				if (user === 'admin') {
					setAdminIsLoggedIn(true);
				}
			} catch (e: any) {
				if (e.code !== 'ERR_BAD_REQUEST') {
					const _appMessage = `Sorry, there was an unknown error (${e.code}).`;
					setAppMessage(_appMessage);
				}
			}
		})();
	}, []);

	const loginAsAdmin = async (callback: () => void) => {
		let _appMessage = '';
		try {
			await axios.post(
				`${backendUrl}/login`,
				{
					password,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			setAdminIsLoggedIn(true);
			callback();
		} catch (e: any) {
			switch (e.code) {
				case 'ERR_BAD_REQUEST':
					_appMessage =
						'Sorry, credentials were incorrect, please attempt login again.';
					break;
				case 'ERR_NETWORK':
					_appMessage =
						"Sorry, we aren't able to process your request at this time.";
					break;
				default:
					_appMessage = `Sorry, there was an unknown error (${e.code}).`;
					break;
			}
			setAdminIsLoggedIn(false);
		}
		setAppMessage(_appMessage);
		setPassword('');
	};

	const deleteAppMessage = () => {
		setAppMessage('');
	};

	const logoutAsAdmin = () => {
		(async () => {
			try {
				const user = (
					await axios.get(`${backendUrl}/logout`, {
						withCredentials: true,
					})
				).data;
				setAdminIsLoggedIn(false);
			} catch (e: any) {
				console.log(
					`There was a problem with the logout: ${e.message}`
				);
			}
		})();
	};


	const handleDeleteFlashcard = async (flashcard: IFlashcard) => {
		let _appMessage = '';
		try {
			await axios.delete(
				`${backendUrl}/flashcards/${flashcard.id}`,
				{
					withCredentials: true,
				}
			);
			const _flashcards = flashcards.filter((m: IFlashcard) => m.id !== flashcard.id);
			setFlashcards(_flashcards);
			setAppMessage('flashard deleted')
		} catch (e: any) {
			switch (e.code) {
				case 'ERR_BAD_REQUEST':
					_appMessage =
						'Sorry, you had been logged out when you tried to save the welcome message. Please log in again.';
					break;
				case 'ERR_NETWORK':
					_appMessage =
						"Sorry, we aren't able to process your request at this time.";
					break;
				default:
					_appMessage = `Sorry, there was an unknown error (${e.code}).`;
					break;
			}
			setAppMessage(_appMessage);
			setAdminIsLoggedIn(false);
		}
	}

	return (
		<AppContext.Provider
			value={{
				appTitle,
				loginAsAdmin,
				logoutAsAdmin,
				password,
				setPassword,
				appMessage,
				deleteAppMessage,
				adminIsLoggedIn,
				flashcards,
				handleDeleteFlashcard,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
