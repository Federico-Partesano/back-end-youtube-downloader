import { ITournament } from "../models/Tournament";
import { User } from "../models/user";

export const getStatisticsTournament = (
  tournament: Array<ITournament[]>,
  nicknameUser: string
) => {
  let goals = 0;
  let goalsForMatch: number[] = [];
  let matchPlayed = 0;
  let matchWon = 0;
  tournament.forEach((matches) => {
    matches.forEach(({ goalA, goalB, teamA, teamB, status }) => {
      teamA.nickname === nicknameUser &&
        ((goals += goalA), goalsForMatch.push(goalA));
      teamB.nickname === nicknameUser &&
        ((goals += goalB), goalsForMatch.push(goalB));
      ((teamA.nickname === nicknameUser && status !== "not_started") ||
        (teamB.nickname === nicknameUser && status !== "not_started")) &&
        (matchPlayed += 1);
      ((teamA.nickname === nicknameUser && goalA > goalB) ||
        (teamB.nickname === nicknameUser && goalB > goalA)) &&
        (matchWon += 1);
    });
  });

  const averageGoalForMatch = Number(
    (goalsForMatch.reduce((a, b) => a + b, 0) / goalsForMatch.length).toFixed(2)
  );
  const maxGoalsInMatch = Math.max(...goalsForMatch);

  return { goals, matchPlayed, averageGoalForMatch, matchWon, maxGoalsInMatch };
};

export const getBestStatitics = (
  users: (User & { id: string })[],
  tournament: Array<ITournament[]>
) => {
    const arrayUsers: ({statitics: ReturnType<typeof getStatisticsTournament>,nickname: string})[] = [];
  const nicknameUsers = new Set(users.map(({ nickname }) => nickname));
  console.log('nickname', nicknameUsers);
  
  nicknameUsers.forEach((nickname) => {
    arrayUsers.push({nickname, statitics: getStatisticsTournament(tournament, nickname)})
  });
  const {goals, matchPlayed, averageGoalForMatch, matchWon, maxGoalsInMatch} = arrayUsers.reduce((acc, arr) => ({
    goals: arr.statitics.goals > acc.goals.value ? {nickname: arr.nickname, value: arr.statitics.goals} : acc.goals,
    matchPlayed: arr.statitics.matchPlayed > acc.matchPlayed.value ? {nickname: arr.nickname, value: arr.statitics.matchPlayed} : acc.matchPlayed,
    averageGoalForMatch: arr.statitics.averageGoalForMatch > acc.averageGoalForMatch.value ? {nickname: arr.nickname, value: arr.statitics.averageGoalForMatch} : acc.averageGoalForMatch,
    matchWon: arr.statitics.matchWon > acc.matchWon.value ? {nickname: arr.nickname, value: arr.statitics.matchWon} : acc.matchWon,
    maxGoalsInMatch: arr.statitics.maxGoalsInMatch > acc.maxGoalsInMatch.value ? {nickname: arr.nickname, value: arr.statitics.maxGoalsInMatch} : acc.maxGoalsInMatch
  }), {
      goals: {nickname: "", value: -100},
      matchPlayed:  {nickname: "", value: -100},
      averageGoalForMatch:  {nickname: "", value: -100},
      matchWon:  {nickname: "", value: -100}, 
      maxGoalsInMatch:  {nickname: "", value: -100}
  });
  
  return { goals, matchPlayed, averageGoalForMatch, matchWon, maxGoalsInMatch };

};
