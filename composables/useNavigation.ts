export const useNavigation = (tournamentId: number) => {
  const backToTournaments = '/tournaments/';
  const baseUrl = `/tournaments/${tournamentId}`;

  const items = [
    { link: backToTournaments, text: 'Zpět na tipovačky' },
    { link: baseUrl, text: 'Tabulka' },
    { link: `${baseUrl}/my-tips`, text: 'Moje tipy' },
    { link: `${baseUrl}/leaderboard`, text: 'Žebříček' },
    { link: `${baseUrl}/help`, text: 'Pomoc' },
  ]

  const adminItems = [
    { link: `${baseUrl}/manage-matches`, text: 'Spravovat zápasy' },
    { link: `${baseUrl}/manage-teams`, text: 'Spravovat týmy' },
    { link: `${baseUrl}/manage-scorers`, text: 'Spravovat střelce' },
    { link: `${baseUrl}/manage-players`, text: 'Spravovat hráče' },
  ]

  return {
    items,
    adminItems
  }
};