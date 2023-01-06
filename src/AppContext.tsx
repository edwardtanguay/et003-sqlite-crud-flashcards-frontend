import { useState, useEffect } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { IFlashcard, IRawFlashcard } from './interfaces';
import * as tools from './tools';

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
	systemErrorExists: boolean;
	handleToggleFlashcard: (flashcard: IFlashcard) => void;
}

interface IAppProvider {
	children: React.ReactNode;
}

const backendUrl = 'http://localhost:3515';

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
	const appTitle = 'Learn Site';
	const [password, setPassword] = useState('');
	const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
	const [systemErrorExists, setSystemErrorExists] = useState(false);

	const handleGeneralApiErrors = (currentAction: string, e: any) => {
		let _appMessage = '';
		switch (e.code) {
			case 'ERR_NETWORK':
				_appMessage = `Sorry, the site data is currently not available.`;
				setSystemErrorExists(true);
				break;
			default:
				_appMessage = `Sorry, the site is currently experiencing difficulties.`;
				setSystemErrorExists(true);
				break;
		}
		setAppMessage(_appMessage);
		console.log(`ERROR "${currentAction}": ${e.code}`);
	};

	useEffect(() => {
		(async () => {
			try {
				(async () => {
					const _flashcards: IFlashcard[] = [];
					const rawFlashcards = (
						await axios.get(`${backendUrl}/flashcards`)
					).data;
					rawFlashcards.forEach((rawFlashcard: IRawFlashcard) => {
						const _flashcard: IFlashcard = {
							...rawFlashcard,
							isOpen: false,
							backHtml: tools.convertMarkdownToHtml(
								rawFlashcard.back
							),
						};
						_flashcards.push(_flashcard);
					});
					setFlashcards(_flashcards);
				})();
			} catch (e: any) {
				handleGeneralApiErrors('loading flashcards', e);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const user = (
					await axios.get(`${backendUrl}/get-current-user`, {
						withCredentials: true,
					})
				).data;
				if (user === 'admin') {
					setAdminIsLoggedIn(true);
				}
			} catch (e: any) {
				handleGeneralApiErrors('checking current user', e);
			}
		})();
	}, []);

	const loginAsAdmin = async (callback: () => void) => {
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
			// setAppMessage('Sorry, credentials were incorrect, please attempt login again.');
			setAdminIsLoggedIn(true);
			callback();
		} catch (e: any) {
			handleGeneralApiErrors('attemping admin login', e);
			setAdminIsLoggedIn(false);
		}
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
				handleGeneralApiErrors('attemping logout', e);
			}
		})();
	};

	const handleDeleteFlashcard = async (flashcard: IFlashcard) => {
		let _appMessage = '';
		try {
			await axios.delete(`${backendUrl}/flashcards/${flashcard.id}`, {
				withCredentials: true,
			});
			const _flashcards = flashcards.filter(
				(m: IFlashcard) => m.id !== flashcard.id
			);
			setFlashcards(_flashcards);
			setAppMessage('flashard deleted');
		} catch (e: any) {
			switch (e.code) {
				case 'ERR_BAD_REQUEST':
					setAppMessage(
						'Sorry, you had been logged out. Please log in again.'
					);
					break;
				default:
					handleGeneralApiErrors(
						'attemping delection of flashcard',
						e
					);
					break;
			}
			setAdminIsLoggedIn(false);
		}
	};

	const handleToggleFlashcard = (flashcard: IFlashcard) => {
		flashcard.isOpen = !flashcard.isOpen;
		setFlashcards([...flashcards]);
	};

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
				systemErrorExists,
				handleToggleFlashcard,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
