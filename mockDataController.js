const path = require('path');
const fs = require('fs');

const basePathToData = path.join(__dirname, 'mockdata');

const getJsonData = function (basePathToData, filename) {
  var filename = path.join(basePathToData, filename);
  return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

exports.getTeamsLeagueStandard = function (request, response) {
  var data = getJsonData(basePathToData, 'teams_league_standard.json');
  return response.send(data);
};

exports.getPlayersLeagueStandard = function (request, response) {
  var data = getJsonData(basePathToData, 'players_league_standard.json');
  return response.send(data);
};

exports.getLiveGames = function (request, response) {
  var data = getJsonData(basePathToData, 'games_live.json');
  return response.send(data);
};

exports.getSchedulesAndResults = function (request, response) {
  var data = getJsonData(basePathToData, 'games_league_standard_2019.json');
  return response.send(data);
};

exports.getStandings = function (request, response) {
  var data = getJsonData(basePathToData, 'standings_league_standard_2019.json');
  return response.send(data);
};

exports.getPlayerById = function (request, response) {
  var data = getJsonData(basePathToData, 'player_playerid_216.json');
  return response.send(data);
};

exports.getTeamsMappings = function (request, response) {
  var data = getJsonData(basePathToData, 'teams_league_standard.json');
  var teams = data.api.teams.reduce((map, team) => (map[team.teamId] = team.fullName, map), {})
  // var teams = data.api.teams.map(x => ({[x.teamId] : x.fullName})); // as array of {teamId: fullName} objects
  return response.send(teams);
};