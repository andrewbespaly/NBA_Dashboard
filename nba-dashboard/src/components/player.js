import React, { Component } from 'react';
import Sidebar from './sidebar';
import Header from './header';

import './player.css';

export default class Player extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      playerDetailsLoaded: false,
      teamsMappingsLoaded: false,
      playerDetails: {},
      teamsMappings: {}
    }
  }
  
  componentDidMount() {
      
      this.getPlayerDetails(this.props.match.params.id)
        .then(res1 => this.setState({ 
          playerDetails: res1.api.players[0],
          playerDetailsLoaded: true
        }))
        .then(this.getTeamsMappings()
          .then(res2 => this.setState({ 
            teamsMappings: res2,
            teamsMappingsLoaded: true,
          })))
        .catch(err => console.log(err));
        
  }
  
  getPlayerDetails = async (id) => {
      const response = await fetch('https://api-nba-v1.p.rapidapi.com/players/playerId/' + id,
      // const response = await fetch('http://localhost:8000/api/players/playerId/216', 
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
  
  load_data = () => {
    const playerImageURL = "https://nba-players.herokuapp.com/players/" + this.state.playerDetails.lastName + "/" + this.state.playerDetails.firstName;
    const playerImageALT = "Headshot image of Nba Player " + this.state.playerDetails.firstName + " " + this.state.playerDetails.lastName;
    return(
      <div>
        <div>
        <img src={playerImageURL} alt={playerImageALT}/>
        </div>
        <div className="player-info">
           <h1>{this.state.playerDetails.firstName} {this.state.playerDetails.lastName}</h1>
           <h5>{this.state.teamsMappings[this.state.playerDetails.teamId]} | No. {this.state.playerDetails.leagues.standard.jersey}</h5>
           <h6>Weight (kg): {this.state.playerDetails.weightInKilograms}</h6>
           <h6>Height (m): {this.state.playerDetails.heightInMeters}</h6>
           <h6>Birthdate: {this.state.playerDetails.dateOfBirth}</h6>
           <h6>College Team: {this.state.playerDetails.collegeName}</h6>
           <h6>Affiliation: {this.state.playerDetails.affiliation}</h6>
           <h6>Position: {this.state.playerDetails.leagues.standard.position}</h6>
        </div>
      </div>
       )
       

  }
    
  render() {
    if(!this.state.playerDetailsLoaded || !this.state.teamsMappingsLoaded){
      return (
        <div>
            <h1>
              Loading player details data ...
            </h1>
        </div>
      )
    }

    return (
      <div>
      <Header />
      <div className="align-center">
          {this.load_data(this.state.data)}
          <Sidebar />
      </div>
      </div>
    );
  }

}