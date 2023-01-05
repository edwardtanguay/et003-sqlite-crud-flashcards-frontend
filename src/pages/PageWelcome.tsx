import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Helmet } from 'react-helmet';

export const PageWelcome = () => {
	const {
		appTitle,
		welcomeMessage,
		setWelcomeMessage,
		handleSaveWelcomeMessage,
		adminIsLoggedIn,
		turnOnWelcomeMessageEditMode,
		isEditingWelcomeMessage,
		flashcards,
		handleDeleteFlashcard,
	} = useContext(AppContext);

	return (
		<div className="pageWelcome">
			<Helmet>
				<title>{appTitle} - Welcome</title>
			</Helmet>
			<p>
				<>
					{!isEditingWelcomeMessage && <span>{welcomeMessage}</span>}
					{adminIsLoggedIn && (
						<>
							{!isEditingWelcomeMessage ? (
								<>
									{' '}
									<button
										onClick={turnOnWelcomeMessageEditMode}
									>
										Edit
									</button>
								</>
							) : (
								<>
									<input
										className="theWelcomeMessage"
										type="text"
										autoFocus
										onChange={(e) =>
											setWelcomeMessage(e.target.value)
										}
										value={welcomeMessage}
									/>{' '}
									<button onClick={handleSaveWelcomeMessage}>
										Save
									</button>
								</>
							)}
						</>
					)}
				</>
			</p>

			<div className="flashcards">
				{flashcards.map((flashcard) => {
					return (
						<div className="flashcard" key={flashcard.id}>
							<div className="front">{flashcard.front}</div>
							<div className="back">{flashcard.back}</div>
							{adminIsLoggedIn && (
								<button
									onClick={() =>
										handleDeleteFlashcard(flashcard)
									}
								>
									Delete
								</button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
