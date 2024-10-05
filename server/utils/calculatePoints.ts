export const calculatePoints = (userHomeScore: number, userAwayScore: number, homeScore: number, awayScore: number) => {
  const draw = userHomeScore === userAwayScore && homeScore === awayScore;
  const homeWin = userHomeScore > userAwayScore && homeScore > awayScore;
  const awayWin = userHomeScore < userAwayScore && homeScore < awayScore;

  const exactDraw = userHomeScore === homeScore && userHomeScore === userAwayScore && homeScore === awayScore;
  const exactHomeWin = userHomeScore === homeScore && userAwayScore === awayScore && homeScore > awayScore;
  const exactAwayWin = userHomeScore === homeScore && userAwayScore === awayScore && homeScore < awayScore;

  if (exactDraw || exactHomeWin || exactAwayWin) return 3;
  if (draw || homeWin || awayWin) return 1;
  return 0;
};