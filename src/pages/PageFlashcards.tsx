import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Helmet } from 'react-helmet';
import { Flashcard } from '../components/Flashcard';

export const PageFlashcards = () => {
	const { appTitle, adminIsLoggedIn, flashcards, handleDeleteFlashcard } =
		useContext(AppContext);

	return (
		<div className="page pageFlashcards">
			<Helmet>
				<title>{appTitle} - Flashcards</title>
			</Helmet>
			<h3>There are {flashcards.length} flashcards:</h3>
			<div className="flashcards">
				{flashcards.map((flashcard) => {
					return (
						<Flashcard key={flashcard.id} flashcard={flashcard} />
					);
				})}
			</div>
		</div>
	);
};
