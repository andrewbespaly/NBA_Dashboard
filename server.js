const express = require('express')
const fetch = require('node-fetch');
const cheerio = require("cheerio");
const path = require("path");
cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

var mockDataController = require('./mockDataController');
var helperDataController = require('./helperDataController');

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

app.use(express.static(path.join(__dirname, 'nba-dashboard/build')));

app.get('/*', (req, res, next) => {
    if (!req.path.includes('api'))
        res.sendFile(path.join(__dirname, 'nba-dashboard/build', 'index.html'));
    else next();
});

app.get('/api/team_stats', (req, res) => {
  // fetch('https://basketball.realgm.com/nba/team-stats')
  fetch('https://basketball.realgm.com/nba/team-stats/2021/Averages/Team_Totals/Regular_Season')
    .then((res)=>res.text())
    .then((html) => {
      // console.log(html);
      const $ = cheerio.load(html);
      let all_data = {};
      let header_arr = [];
      let team_stats = [];

      $(".tablesaw").find("thead").first().find("th").each((i, col_header) => {
        header_arr.push($(col_header).text());
      })

      let glossary = {'#': 'Rank', 
      'Team': 'Team', 
      'GP': 'Games Played',
      'MPG': 'Minutes Per Game', 
      'FGM': 'Field Goals Made', 
      'FGA': 'Field Goals Attempted', 
      'FG%': 'Field Goal Percentage', 
      '3PM': 'Three-Point Field Goals Made', 
      '3PA': 'Three-Point Field Goals Attempted', 
      '3P%': 'Three-Point Field Goal Percentage', 
      'FTM': 'Free Throws Made', 
      'FTA' : 'Free Throws Attempted',
      'FT%': 'Free Throw Percentage', 
      'TOV': 'Turnovers', 
      'PF': 'Personal Fouls',
      'ORB': 'Offensive Rebounds', 
      'DRB': 'Defensive Rebounds', 
      'RPG': 'Rebounds Per Game', 
      'APG': 'Assists Per Game', 
      'SPG' : 'Steals Per Game', 
      'BPG': 'Blocks Per Game', 
      'PPG': 'Points Per Game',
      };
      
      all_data['glossary'] = glossary;

      $(".tablesaw").find("tbody").first().find("tr").each((i, row) => {
        
        let team_arr = {};
        
        $(row).find('td').each((i, item) => {
          team_arr[header_arr[i]] = $(item).text();
        })
        team_stats.push(team_arr);
      })
      all_data['team_stats'] = team_stats;

      res.json(all_data);
    })
    .catch((err) => console.log("Request failed", err));
  
}); 

app.get('/api/team_info', (req, res) => {
  fetch("https://api-nba-v1.p.rapidapi.com/teams/league/standard",
      {"method": "GET",
       "headers":
       {
        "x-rapidapi-host": process.env.REACT_APP_NONFREE_API_URL,
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
        }
      })
      .then((res) => res.json())
      .then((team_names) =>  {
        let team_name_arr = team_names.api.teams;

        res.json(team_name_arr);
      })
      .catch((err) => console.log("Request failed", err));
    
});

app.get('/api/teams/league/standard', mockDataController.getTeamsLeagueStandard);

app.get('/api/players/league/standard', mockDataController.getPlayersLeagueStandard);

app.get('/api/teams/mappings', mockDataController.getTeamsMappings);

// app.get('/api/games/live', mockDataController.getLiveGames);
app.get('/api/games/live', (req, res) => {
  fetch("https://api-nba-v1.p.rapidapi.com/games/live/",
      {"method": "GET",
       "headers":
       {
        "x-rapidapi-host": process.env.REACT_APP_NONFREE_API_URL,
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
        }
      })
      .then((res) => res.json())
      .then((live_games) => res.json(live_games))
      .catch((err) => console.log("Request failed", err));

})

app.get('/api/games/league/standard/2019', mockDataController.getSchedulesAndResults);

app.get('/api/standings/standard/2019', mockDataController.getStandings);

app.get('/api/players/playerId/216', mockDataController.getPlayerById);

app.get('/api/teams/mappings/:teamId', function (req, res) {
    return res.send(helperDataController.getTeamFullName(req.params.teamId));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

