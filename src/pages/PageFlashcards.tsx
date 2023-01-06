import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Helmet } from 'react-helmet';
import { Flashcard } from '../components/Flashcard';

export const PageFlashcards = () => {
	const {
		appTitle,
		adminIsLoggedIn,
		flashcards,
		newFlashcard,
		flashcardIsBeingAdded,
		handleAddFlashcardFieldChange,
		handleCancelAddFlashcard,
		handleAddFlashcard,
	} = useContext(AppContext);

	return (
		<div className="page pageFlashcards">
			<Helmet>
				<title>{appTitle} - Flashcards</title>
			</Helmet>

			{flashcardIsBeingAdded && (
				<>
					<h3 className="newFlashcard">New flashcard:</h3>
					<div className="addFlashcardArea">
						<form>
							<div className="row rowCategory">
								<label>Category</label>
								<div className="control">
									<input
										value={newFlashcard.category}
										onChange={(e) =>
											handleAddFlashcardFieldChange(
												'category',
												newFlashcard,
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
										value={newFlashcard.front}
										onChange={(e) =>
											handleAddFlashcardFieldChange(
												'front',
												newFlashcard,
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
										value={newFlashcard.back}
										onChange={(e) =>
											handleAddFlashcardFieldChange(
												'back',
												newFlashcard,
												e.target.value
											)
										}
										type="text"
									/>
								</div>
							</div>
						</form>
					</div>

					<div className="newFlashcardAdminArea">
						<button
								onClick={handleCancelAddFlashcard}
						>
							Cancel
						</button>
						<button
						>
							Save	
						</button>
					</div>
				</>
			)}

			<div className="headerArea">
				<h3>There are {flashcards.length} flashcards:</h3>
				{adminIsLoggedIn && !flashcardIsBeingAdded && (
					<button onClick={handleAddFlashcard}>Add Flashcard</button>
				)}
			</div>
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
