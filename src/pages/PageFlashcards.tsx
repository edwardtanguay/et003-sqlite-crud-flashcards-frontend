import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Helmet } from 'react-helmet';

export const PageFlashcards = () => {
	const {
		appTitle,
		adminIsLoggedIn,
		flashcards,
		handleDeleteFlashcard,
	} = useContext(AppContext);

	return (
		<div className="page pageFlashcards">
			<Helmet>
				<title>{appTitle} - Flashcards</title>
			</Helmet>
			<h3>There are {flashcards.length} flashcards:</h3>
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
