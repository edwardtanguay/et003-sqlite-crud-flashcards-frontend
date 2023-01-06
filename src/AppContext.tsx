import { useState, useEffect } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { IFlashcard, IOriginalFlashcard, IRawFlashcard } from './interfaces';
import * as tools from './tools';
import { toast } from 'react-toastify';

interface IAppContext {
	appTitle: string;
	loginAsAdmin: (onSuccess: () => void, onFailure: () => void) => void;
	logoutAsAdmin: () => void;
	password: string;
	setPassword: (password: string) => void;
	appMessage: string;
	adminIsLoggedIn: boolean;
	flashcards: IFlashcard[];
	handleDeleteFlashcard: (flashcard: IFlashcard) => void;
	systemErrorExists: boolean;
	handleToggleFlashcard: (flashcard: IFlashcard) => void;
	handleEditFlashcard: (flashcard: IFlashcard) => void;
	handleCancelEditFlashcard: (flashcard: IFlashcard) => void;
	handleSaveEditFlashcard: (flashcard: IFlashcard) => void;
	handleFlashcardFieldChange: (
		fieldIdCode: string,
		flashcard: IFlashcard,
		value: string
	) => void;
}

interface IAppProvider {
	children: React.ReactNode;
}

const backendUrl = 'http://localhost:3515';
const notify = (message: string) => toast(message);

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
							isBeingEdited: false,
							originalItem: {
								category: rawFlashcard.category,
								front: rawFlashcard.front,
								back: rawFlashcard.back,
							},
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

	const loginAsAdmin = async (
		onSuccess: () => void,
		onFailure: () => void
	) => {
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
			onSuccess();
		} catch (e: any) {
			switch (e.code) {
				case 'ERR_BAD_REQUEST':
					notify(
						'Sorry, password was not correct. Please try again.'
					);
					onFailure();
					break;
				default:
					handleGeneralApiErrors('attemping admin login', e);
					break;
			}
			setAdminIsLoggedIn(false);
		}
		setPassword('');
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
		try {
			await axios.delete(`${backendUrl}/flashcard/${flashcard.id}`, {
				withCredentials: true,
			});
			const _flashcards = flashcards.filter(
				(m: IFlashcard) => m.id !== flashcard.id
			);
			setFlashcards(_flashcards);
			notify('Flashcard was deleted.');
		} catch (e: any) {
			switch (e.code) {
				case 'ERR_BAD_REQUEST':
					notify(
						'Sorry, you had been logged out. Flashcard was not deleted.'
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

	const handleEditFlashcard = (flashcard: IFlashcard) => {
		flashcard.isBeingEdited = true;
		setFlashcards([...flashcards]);
	};

	const handleCancelEditFlashcard = (flashcard: IFlashcard) => {
		flashcard.isBeingEdited = false;
		setFlashcards([...flashcards]);
	};

	const handleSaveEditFlashcard = async (flashcard: IFlashcard) => {
		try {
			// save in backend
			await axios.put(
				`${backendUrl}/flashcard/${flashcard.id}`,
				{
					flashcard: {
						category: flashcard.originalItem.category,
						front: flashcard.originalItem.front,
						back: flashcard.originalItem.back,
					},
				},
				{
					withCredentials: true,
				}
			);
			// if it saved in backend, then update in frontend
			flashcard.category = flashcard.originalItem.category;
			flashcard.front = flashcard.originalItem.front;
			flashcard.back = flashcard.originalItem.back;
			flashcard.backHtml = tools.convertMarkdownToHtml(
				flashcard.originalItem.back
			);
			setFlashcards([...flashcards]);
			flashcard.isBeingEdited = false;
			notify('Flashcard was saved.');
		} catch (e: any) {
			switch (e.code) {
				case 'ERR_BAD_REQUEST':
					notify(
						'Sorry, you had been logged out. Flashcard changes were not saved.'
					);
					break;
				default:
					handleGeneralApiErrors(
						'attemping to save changes to flashcard',
						e
					);
					break;
			}
			setAdminIsLoggedIn(false);
		}
	};

	const handleFlashcardFieldChange = (
		fieldIdCode: string,
		flashcard: IFlashcard,
		value: string
	) => {
		flashcard.originalItem[fieldIdCode as keyof IOriginalFlashcard] = value;
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
				adminIsLoggedIn,
				flashcards,
				handleDeleteFlashcard,
				systemErrorExists,
				handleToggleFlashcard,
				handleEditFlashcard,
				handleCancelEditFlashcard,
				handleSaveEditFlashcard,
				handleFlashcardFieldChange,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
