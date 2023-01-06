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
							{flashcard.categoryName.toUpperCase()}:
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
											type="text"
										/>
									</div>
								</div>
								<div className="row">
									<label>Front</label>
									<div className="control">
										<input
											value={flashcard.originalItem.front}
											type="text"
										/>
									</div>
								</div>
								<div className="row">
									<label>Back</label>
									<div className="control">
										<input
											value={flashcard.originalItem.back}
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
							<button>Save</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
