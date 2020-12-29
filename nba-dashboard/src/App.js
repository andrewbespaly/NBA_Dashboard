import React, { Component } from 'react';
import './App.css';
import Homepage from './components/homepage';
import Teams from './components/teams';
import Players from './components/players';
import Player from './components/player';
import Live from './components/live';
import Standings from './components/standings';
import Schedules from './components/schedules';
import Team from './components/team';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';


// function App() {
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: {},
    }
  }

  componentDidMount(){
    let loadResponse = async () => {
      await fetch("/api/team_stats")
      .then((res) => res.json())
      .then((team_data) => {

        function compare_team_names(a, b){
          let comparison = 0;
          if(a.Team > b.Team){
            comparison = 1;
          } else if(a.Team < b.Team) {
            comparison = -1;
          }
          return comparison;
        }

        team_data.team_stats.sort(compare_team_names);

        this.setState({ isLoaded: false, data: team_data })
    })
      .catch((err) => console.log("Request failed", err));

      await fetch('/api/team_info')
        .then((res) => res.json())
        .then((team_names) => {
          let temp_data = this.state.data;
          team_names.forEach(api_team => {
            let found_city = temp_data.team_stats.find(e => {
              if(e.Team === api_team.city){ return true}
              if(e.Team === "L.A. Clippers" && api_team.city === "LA"){return true}
              if(e.Team === "L.A. Lakers" && api_team.city === "Los Angeles"){return true}
              return false;
            });
            if(found_city !== undefined){
              for(const property in api_team) {
                found_city[property] = api_team[property];
              }
            }
          })

          this.setState({ isLoaded: true, data: temp_data })
        })
        .catch((err) => console.log("Request failed", err));

    // await fetch("http://localhost:8000/api/teams/league/standard")

    // await fetch("https://api-nba-v1.p.rapidapi.com/teams/league/standard",
    //   {"method": "GET",
    //    "headers":
    //    {
    //     "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    //     "x-rapidapi-key": process.env.REACT_APP_API_KEY,
    //     }
    //   })
    //   .then((res) => res.json())
    //   .then((team_names) => {
    //     let temp_data = this.state.data;
    //     team_names.api.teams.forEach(api_team => {
    //       //check if api_team name exists in temp data, then put it there if it does
    //       let found_city = temp_data.team_stats.find(e => {
    //         if(e.Team === api_team.city){ return true}
    //         if(e.Team === "L.A. Clippers" && api_team.city === "LA"){return true}
    //         if(e.Team === "L.A. Lakers" && api_team.city === "Los Angeles"){return true}
    //         return false;
    //       });
    //       if(found_city !== undefined){
    //         // found_city['team_info'] = api_team;
    //         //loop through api_team info and add each field individually into found city data
    //         for(const property in api_team) {
    //           found_city[property] = api_team[property];
    //         }
    //       }
    //     })

    //     this.setState({ isLoaded: true, data: temp_data })
    //   })

    // };
    }
    loadResponse();
  }
  

  render(){
    if(!this.state.isLoaded){
      return (
        <div>
            <h1>
              Loading...
            </h1>
        </div>
      )
    }
    else{
      return (
        <Router>
          {/* <li>
            <Link to="/about">About</Link>
          </li> */}
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => <Homepage all_data={this.state.data}/> }
            />
            <Route
              path="/teams"
              exact
              render={(props) => <Teams /> }
            />
            <Route
              path="/teams/teamId/:id"
              exact
              render={(props) => (
                <Team {...props} all_data={this.state.data}/>
              )}
            />
            <Route
              path="/players"
              exact
              render={(props) => <Players /> }
            />
            <Route
              path="/players/playerId/:id"
              exact
              render={(props) => (
                <Player {...props} />
              )}
            />
            <Route
              path="/live"
              exact
              render={(props) => <Live /> }
            />
            <Route
              path="/standings"
              exact
              render={(props) => <Standings all_data={this.state.data}/> }
            />
            <Route
              path="/schedules"
              exact
              render={(props) => <Schedules /> }
            />

            <Route render={()=> <Redirect to="/" />} />
          </Switch>
        </Router>  
      );
    }
  }
}

