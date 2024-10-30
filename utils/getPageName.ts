const getPageName = (pathname: string | undefined) => {
	switch (pathname) {
		case 'my-tips':
			return 'Moje tipy';
		case 'leaderboard':
			return 'Žebříček';
		case 'help':
			return 'Pomoc';
		case 'manage-matches':
			return 'Správa zápasů';
		case 'manage-teams':
			return 'Správa týmů';
		case 'manage-scorers':
			return 'Správa střelců';
		case 'manage-players':
			return 'Správa hráčů';
		default:
			return 'Tabulka';
	}
};

export default getPageName;
