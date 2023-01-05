import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Helmet } from 'react-helmet';

export const PageWelcome = () => {
	const {
		appTitle,
		adminIsLoggedIn,
		flashcards,
		handleDeleteFlashcard,
	} = useContext(AppContext);

	return (
		<div className="page pageWelcome">
			<Helmet>
				<title>{appTitle} - Welcome</title>
			</Helmet>
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
