import React, { Component } from 'react';
import { getMainColor, getFullName, getSecondaryColor } from 'nba-color';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Label, ResponsiveContainer
} from 'recharts';


const CustomTooltip = ({ active, payload, label, glossary, all_data, all_needed_stats, type} ) => {

  let fill_data = () => {
    if(type === 'doublebar'){
      return(
        <div>
          <p>{`${glossary[all_needed_stats[0]]}: ${payload[0].value} `}</p>
          <p>{`${glossary[all_needed_stats[1]]}: ${payload[1].value} `}</p>
          <p>{`${glossary[all_needed_stats[2]]}: ${(team[all_needed_stats[2]] * 100).toFixed(1)}% `}</p>
        </div>
      )
    } else if (type === 'bar'){
      return(
        <div>
          <p>{`${glossary[all_needed_stats]}: ${payload[0].value} `}</p>
        </div>
      )
    } else if (type === 'singlebar'){
      return(
        <div>
          <p>{`Win Percentage: ${(payload[0].value * 100).toFixed(1)}% `}</p>
          <p>{`Rank in Conference: ${team.conference.rank} `}</p>
        </div>
      )
    } 
    
  }

  let team = all_data.find(obj => {
    return obj.fullName === label
  })

  if (active) {
    return (
      <div className="custom-tooltip" style={{backgroundColor: '#f5f5f5ee', padding: "10px", borderRadius: "5px"}}>
        <h5 className="label">{`${label}`} 
          <img className="img-fluid" src={team.logo} alt="teamlogo" style={{width: 70, height: 'auto', marginLeft: '1rem'}}/>
        </h5>
        
        {fill_data()}
        
      </div>
    );
  }

  return null;
};

function processGraph(all_data, all_team_data, team_mappings, type_of_graph, stat_to_graph){

  if(type_of_graph === "doublebar"){
    let stats=stat_to_graph.split(" ");
    return(
      <ResponsiveContainer width={"97%"} height={600}>
        <BarChart
          data={all_team_data.team_stats}
        >
          <XAxis type="category" interval={0} dataKey={"fullName"} xAxisId={0} tickLine={false} hide/>
          <XAxis type="category" dataKey={"fullName"} xAxisId={1} tickLine={false} hide/>
          <YAxis interval="preserveStartEnd" />
          <Tooltip content={<CustomTooltip glossary={all_team_data.glossary} all_data={all_team_data.team_stats} all_needed_stats={stats} type={type_of_graph}/>} animationEasing="ease-in-out" />
          <CartesianGrid />
          <Bar dataKey={stats[0]} 
            animationDuration={2000}
            barSize={20}
            barGap={0}
            xAxisId={0}
          >
          {
            all_team_data.team_stats.map((entry, index) => {
              //sets the background color of each bar to the main team color, and secondary color to font and border color
              return <Cell fill={getMainColor(entry.shortName).hex} stroke={"black"} key={index}/>;
            })
          }
            <LabelList dataKey="shortName" position='top' />
          </Bar>

          <Bar dataKey={stats[1]}
            animationDuration={2000}
            barSize={20}
            barGap={0}
            xAxisId={1}
          >
          {
            all_team_data.team_stats.map((entry, index) => {
              //sets the background color of each bar to the main team color, and secondary color to font and border color
              return <Cell fill={getSecondaryColor(entry.shortName).hex} stroke={"black"} key={index}/>;
            })
          }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if(type_of_graph === "bar"){
    return(
      <ResponsiveContainer width={"97%"} height={600}>
        <BarChart
          data={all_team_data.team_stats}
        >
          <XAxis type="category" dataKey={"fullName"} tickLine={false} hide/>
          <YAxis interval="preserveStartEnd" />
          {/* <YAxis interval="preserveStartEnd" type="number" domain={['dataMin', 'dataMax']} /> */}
          <CartesianGrid />
          <Tooltip content={<CustomTooltip glossary={all_team_data.glossary} all_data={all_team_data.team_stats} all_needed_stats={stat_to_graph} type={type_of_graph}/>} animationEasing="ease-in-out" />
          <Bar dataKey={stat_to_graph} 
          animationDuration={2000}
          >
          {
            all_team_data.team_stats.map((entry, index) => {
              //sets the background color of each bar to the main team color, and secondary color to font and border color
              return <Cell fill={getMainColor(entry.shortName).hex} stroke={getSecondaryColor(entry.shortName).hex} key={index}/>;
            })
          }
            <LabelList dataKey="shortName" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if(type_of_graph === "singlebar"){
    return(
      <ResponsiveContainer width={"80%"} height={500}>
        <BarChart
          data={all_team_data}
        >
          <XAxis type="category" dataKey={'fullName'} tickLine={false} hide/>
          <YAxis interval="preserveStartEnd" />
          <CartesianGrid />
          <Tooltip content={<CustomTooltip all_data={all_team_data} all_needed_stats={stat_to_graph} type={type_of_graph}/>} animationEasing="ease-in-out" />
          <Bar dataKey={stat_to_graph} 
          animationDuration={2000}
          >
          {
            all_team_data.map((entry, index) => {
              //sets the background color of each bar to the main team color, and secondary color to font and border color
              return <Cell key={index} fill={getMainColor(entry.shortName).hex} stroke={getSecondaryColor(entry.shortName).hex} />;
            })
          }
          <LabelList dataKey="shortName" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

}

export default class GraphCreation extends Component {

    render() {
        return(
          processGraph(this.props.all_data, this.props.all_team_data, this.props.team_mappings, this.props.type_of_graph, this.props.stat_to_graph)
        )
    }

}