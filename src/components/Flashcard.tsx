import { useContext } from 'react';
import { AppContext } from '../AppContext';

import { IFlashcard } from '../interfaces';

interface IProps {
	flashcard: IFlashcard;
}

export const Flashcard = ({ flashcard }: IProps) => {
	const { handleToggleFlashcard } = useContext(AppContext);

	return (
		<div className="flashcard">
			<div
				className="front"
				onClick={() => handleToggleFlashcard(flashcard)}
			>
				<span className="category">
					{flashcard.categoryName.toUpperCase()}:
				</span> {flashcard.front}
			</div>
			{flashcard.isOpen && (
				<div
					className="back"
					dangerouslySetInnerHTML={{ __html: flashcard.backHtml }}
				></div>
			)}
		</div>
	);
};