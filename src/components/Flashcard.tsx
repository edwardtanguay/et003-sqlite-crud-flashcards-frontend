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
		handleCancelEditFlashcard,
		handleSaveEditFlashcard,
		handleFlashcardFieldChange,
		adminIsLoggedIn,
	} = useContext(AppContext);

	return (
		<div className="flashcardWrapper">
			{!flashcard.isBeingEdited && (
				<div className="flashcard">
					<div
						className="front"
						onClick={() => handleToggleFlashcard(flashcard)}
					>
						<span className="category">
							{flashcard.category.toUpperCase()}:
						</span>{' '}
						{flashcard.front}
					</div>
					{flashcard.isOpen && (
						<div
							className="back"
							dangerouslySetInnerHTML={{
								__html: flashcard.backHtml,
							}}
						></div>
					)}
				</div>
			)}
			{adminIsLoggedIn && (
				<>
					{flashcard.isBeingEdited && (
						<div className="editArea">
							<form>
								<div className="row rowCategory">
									<label>Category</label>
									<div className="control">
										<input
											value={
												flashcard.originalItem.category
											}
											onChange={(e) =>
												handleFlashcardFieldChange(
													'category',
													flashcard,
													e.target.value
												)
											}
											type="text"
										/>
									</div>
								</div>
								<div className="row">
									<label>Front</label>
									<div className="control">
										<input
											value={flashcard.originalItem.front}
											onChange={(e) =>
												handleFlashcardFieldChange(
													'front',
													flashcard,
													e.target.value
												)
											}
											type="text"
										/>
									</div>
								</div>
								<div className="row">
									<label>Back</label>
									<div className="control">
										<input
											value={flashcard.originalItem.back}
											onChange={(e) =>
												handleFlashcardFieldChange(
													'back',
													flashcard,
													e.target.value
												)
											}
											type="text"
										/>
									</div>
								</div>
							</form>
						</div>
					)}
					{!flashcard.isBeingEdited && (
						<div className="adminArea">
							<button
								onClick={() => handleDeleteFlashcard(flashcard)}
							>
								Delete
							</button>
							<button
								onClick={() => handleEditFlashcard(flashcard)}
							>
								Edit
							</button>
						</div>
					)}
					{flashcard.isBeingEdited && (
						<div className="editAdminArea">
							<button
								onClick={() =>
									handleCancelEditFlashcard(flashcard)
								}
							>
								Cancel
							</button>
							<button
								onClick={() =>
									handleSaveEditFlashcard(flashcard)
								}
							>
								Save
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
