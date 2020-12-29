import React, { Component } from 'react';
import './live.css';
import ball_logo from '../assets/basketball_logo_t.png';

export default class Live extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      liveGamesLoaded: false,
      teamsMappingsLoaded: false,
      liveGames: {},
      teamsMappings: {}
    }
  }
  

  componentDidMount() {
    
    this.getLiveGames()
      .then(res1 => this.setState({ 
        liveGames: res1,
        liveGamesLoaded: true
      }))
      .then(this.getTeamsMappings()
        .then(res2 => this.setState({ 
          teamsMappings: res2,
          teamsMappingsLoaded: true,
        })))
      .catch(err => console.log(err));
    
  }


getLiveGames = async () => {
    const response = await fetch('/api/games/live', 
      {"method": "GET",
       "headers":
       {
        "x-rapidapi-host": process.env.REACT_APP_NONFREE_API_URL,
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
        }
      });
      
      const body = await response.json();
      
      if (response.status !== 200) {
        return {}; 
      }
      
      return body;

}

getTeamsMappings = async () => {
    const response = await fetch('/api/teams/mappings', 
      {"method": "GET",
       "headers":
       {
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
        }
      });
      
      const body = await response.json();
      
      if (response.status !== 200) {
        return {}; 
      }
      
      return body;

}

colorScore = (score, status) => {
  if(status === 'win'){return <h3 className='text-success' style={{fontSize:"1.4vw", backgroundColor: 'black', border: '2px solid gray'}}>{score}</h3>}
  if(status === 'lose'){return <h3 className='text-danger' style={{fontSize:"1.4vw", backgroundColor: 'black', border: '2px solid gray'}}>{score}</h3>}
  if(status === 'tie'){return <h3 className='text-warning' style={{fontSize:"1.4vw", backgroundColor: 'black', border: '2px solid gray'}}>{score}</h3>}
}

calcScores = (home_score, away_score) => {
  let score_arr = [];
  if(home_score > away_score){
      score_arr.push(this.colorScore(home_score, 'win'));
      score_arr.push(this.colorScore(away_score, 'lose'));
  }
  else if(home_score < away_score){
      score_arr.push(this.colorScore(home_score, 'lose'));
      score_arr.push(this.colorScore(away_score, 'win'));
  }
  else{
      score_arr.push(this.colorScore(home_score, 'tie'));
      score_arr.push(this.colorScore(away_score, 'tie'));
  }
  return score_arr;
}


load_data = () => {
  return(
        <div className="container live_games" id="liveGames">
          <div className='row header' >
            <div className='col-6 '>
                <h4 style={{fontSize:"1.5vw"}}>HOME</h4>
            </div>
            <div className='col-6 '>
              <h4 style={{fontSize:"1.5vw"}}>AWAY</h4>
            </div>
          </div>

         {this.state.liveGames.api.games.map((item, i) => {
           const homeTeamId = item.hTeam.teamId;
           const awayTeamId = item.vTeam.teamId;
           const homeTeamScore = item.hTeam.score.points;
           const awayTeamScore = item.vTeam.score.points;
           const homeTeamName = this.state.teamsMappings[homeTeamId];
           const awayTeamName = this.state.teamsMappings[awayTeamId];
           const homeObj = this.props.all_data.team_stats.find(obj => {
             return obj.fullName === homeTeamName
           })
           let homeLogo=ball_logo;
           if(homeObj !== undefined){homeLogo=homeObj.logo}

           const awayObj = this.props.all_data.team_stats.find(obj => {
            return obj.fullName === awayTeamName
           })
           let awayLogo=ball_logo;
           if(awayObj !== undefined){awayLogo=awayObj.logo}

           const scoreColors = this.calcScores(homeTeamScore, awayTeamScore)
      
            return (
            <div className="single_game" key={i}>

              <div className='row' >
                <div className='col-6'>
                  <img className='img-fluid' src={homeLogo} alt={(homeTeamName+' logo')} width="80px" height="auto" />
                </div>
                <div className='col-6'>
                  <img className='img-fluid' src={awayLogo} alt={(awayTeamName+' logo')} width="80px" height="auto" />
                </div>
              </div>

              <div className='row' >
                <div className='col-6'>
                    <h4 style={{fontSize:"1.1vw"}}>{homeTeamName}</h4>
                </div>
                <div className='col-6'>
                  <h4 style={{fontSize:"1.1vw"}}>{awayTeamName}</h4>
                </div>
              </div>

              <div className='row'>
                <div className='col-6'>
                  {scoreColors[0]}
                </div>
                <div className='col-6'>
                  {scoreColors[1]}
                </div>
              </div>

            </div>
              
            )
        })}
       </div>

     )

}
    
  render() {
    if(!this.state.liveGamesLoaded || !this.state.teamsMappingsLoaded){
      return (
        <div>
            <h1>
              Loading Live Game Data ...
            </h1>
        </div>
      )
    }

    return (
      <div className="align-center live_box">
          <h1 style={{fontSize:"2vw"}}>
            Live Games 
            <nobr className="reddot">🔴</nobr>
          </h1>    
          <br></br>
          {this.load_data(this.state.data)}
      </div>
    );
  }
}
