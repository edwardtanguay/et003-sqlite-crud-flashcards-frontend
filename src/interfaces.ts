export interface IOriginalFlashcard {
	category: string;
	front: string;
	back: string;
}

export interface IRawFlashcard extends IOriginalFlashcard {
	id: number;
}

export interface IFlashcard extends IRawFlashcard {
	isOpen: boolean;
	backHtml: string;
	isBeingEdited: boolean;
	originalItem: IOriginalFlashcard;
}