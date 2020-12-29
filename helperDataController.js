const path = require('path');
const fs = require('fs');

const basePathToData = path.join(__dirname, 'helperdata');

const getJsonData = function (basePathToData, filename) {
  var filename = path.join(basePathToData, filename);
  return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

exports.getTeamFullName = function (teamId) {
  var data = getJsonData(basePathToData, 'teams_mappings.json');
  return data[teamId];
};
