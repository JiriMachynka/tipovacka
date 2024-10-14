export const capitalize = (value: string) => {
	if (!value.length) return '';
	return `${value[0].toUpperCase()}${value.slice(1)}`;
};
