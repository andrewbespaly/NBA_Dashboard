import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import Sidebar from './sidebar';
import Header from './header';
import './players.css';


export default class Players extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      teamsMappingsLoaded: false,
      data: {},
      teamsMappings: {}
    }
  }
  
  componentDidMount() {
    this.getAllPlayers()
      .then(res1 => this.load_data(res1)
        .then(res3 => this.setState({
          data: res3,
          isLoaded: true
        }))
      )
      .then(this.getTeamsMappings().then(res2 => this.setState({
        teamsMappings: res2,
        teamsMappingsLoaded: true
      })))
      .catch(err => console.log(err));
  }
  

  getAllPlayers = async () => {
    // const response = await fetch('http://localhost:8000/api/players/league/standard', 
    const response = await fetch('https://api-nba-v1.p.rapidapi.com/players/league/standard',
      {"method": "GET",
       "headers":
       {
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
        }
      });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
  
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
  
  goToPlayerPage = (id) => {
    window.location.assign('/players/playerId/'+id);
  }
  
  

  
  load_data = async (rawData) => {
  
    
    console.log(rawData.api.players.length)
    const dataRows = rawData.api.players.map((item, i) => {
      var currentRow = {};
      // const playerURL = "/players/playerId/" + item.playerId;
      const playerName = item.firstName + " " + item.lastName;
      
      currentRow["id"] = item.playerId;
      currentRow["name"] = playerName;
      currentRow["team"] = this.state.teamsMappings[item.teamId];
      currentRow["college"] = item.collegeName;
      currentRow["joined"] = item.startNba;
      currentRow["birthdate"] = item.dateOfBirth;
      currentRow["weight"] = item.weightInKilograms;
      currentRow["height"] = item.heightInMeters;
      
      currentRow["clickEvent"] = () => this.goToPlayerPage(item.playerId);
      
      return currentRow; 
    });
    
    const dataColumns = [
            {
              label: 'Id',
              field: 'id',
              sort: 'asc'
            },
            {
              label: 'Player Name',
              field: 'name',
              sort: 'asc'
            },
            {
              label: 'Current Team',
              field: 'team',
              sort: 'asc'
            },
            {
              label: 'College Team',
              field: 'college',
              sort: 'asc'
            },
            {
              label: 'Joined NBA',
              field: 'joined',
              sort: 'asc'
            },
            {
              label: 'Date of Birth',
              field: 'birthdate',
              sort: 'asc'
            },
            {
              label: 'Weight (kg)',
              field: 'weight',
              sort: 'asc'
            },
            {
              label: 'Height (m)',
              field: 'height',
              sort: 'asc'
            }
          ];
  
    const playerData = {
      columns: dataColumns,
      rows: dataRows
    };
       
    return playerData;
  }
    
  render() {
    if(!this.state.isLoaded || !this.state.teamsMappingsLoaded){
      return (
        <div>
            <h1>
              Loading players data ...
            </h1>
        </div>
      )
    }

    return (
      <div className="align-center">
          <Header />
          <h1>
            NBA Players
          </h1>
          <div className='container'>
            <div className='d-flex flex-wrap justify-content-around'>
              <MDBDataTable
                 striped
                 bordered
                 responsive
                 data={this.state.data}
              />
            </div>
          </div>

          <Sidebar />
      </div>
    );
  }

}