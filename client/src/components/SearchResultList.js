import React, { Component } from 'react'
const axios = require("axios")

export default class SearchResultList extends Component {

    render() {

      const updateURL = (url) =>{
          
          axios.get('http://localhost:5000/updateurl/',{params: {address: url }}).then(response =>{
          console.log(response.data)
          
          // To update the url information without having to refresh page 
          let newArr = this.props.currdata.map(obj => {
            if (obj.address === url) {
              return {...obj, timesVisited: obj.timesVisited+1, lastVisited:response.data["lastVisited"]};
            }
          
            return obj;
          });
          this.props.currfunc([...newArr])
          
      });
    }
    
    // console.log("Inside search result");
    // console.log(this.props.list);
    return (
        this.props.list.map(url => (
            <div className="search_result" id={url.id} key={url.id}>
                <a href={url.address} target="_blank" onClick={() => updateURL(url.address)}>{url.title} </a>
                <h6>{url.address}</h6>
                <p>{url.description}</p>
            </div>
          ))
    )
  }
}
