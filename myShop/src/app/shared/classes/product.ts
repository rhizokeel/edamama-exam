export interface Product {
	id?: number;
	name?: string;
	slug?: string;
	price?: number;
	stock?: number;
	new?: boolean;
	short_desc?: boolean;
	category?: Array<{
		name?: string;
		slug?: string;
	}>;
	pictures?: Array<{
		width?: number;
		height?: number;
		url: number;
	}>;
	sm_pictures?: Array<{
		width?: number;
		height?: number;
		url?: number;
	}>
}