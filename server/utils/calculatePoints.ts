export const calculatePoints = (userHomeScore: number, userAwayScore: number, homeScore: number, awayScore: number) => {
	if (userHomeScore === homeScore && userAwayScore === awayScore) return 3;

	const predictedOutcome = Math.sign(userHomeScore - userAwayScore);
	const actualOutcome = Math.sign(homeScore - awayScore);

	return predictedOutcome === actualOutcome ? 1 : 0;
};
