export interface Team {
	id: number;
	name: string;
	groupName: string;
}

export interface Group {
	name: string;
}

export interface Country {
	name: string;
	code: string;
	group: number;
}