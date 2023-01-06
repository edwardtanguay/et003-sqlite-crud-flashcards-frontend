import { useContext } from 'react';
import { AppContext } from '../AppContext';

import { IFlashcard } from '../interfaces';

interface IProps {
	flashcard: IFlashcard;
}

export const Flashcard = ({ flashcard }: IProps) => {
	const {
		handleToggleFlashcard,
		handleDeleteFlashcard,
		handleEditFlashcard,
		adminIsLoggedIn,
	} = useContext(AppContext);

	return (
		<div className="flashcardWrapper">
			<div className="flashcard">
				<div
					className="front"
					onClick={() => handleToggleFlashcard(flashcard)}
				>
					<span className="category">
						{flashcard.categoryName.toUpperCase()}:
					</span>{' '}
					{flashcard.front}
				</div>
				{flashcard.isOpen && (
					<div
						className="back"
						dangerouslySetInnerHTML={{ __html: flashcard.backHtml }}
					></div>
				)}
			</div>
			{adminIsLoggedIn && (
				<div className="adminArea">
					<button onClick={() => handleDeleteFlashcard(flashcard)}>
						Delete
					</button>
					<button onClick={() => handleEditFlashcard(flashcard)}>
						Edit
					</button>
				</div>
			)}
		</div>
	);
};
