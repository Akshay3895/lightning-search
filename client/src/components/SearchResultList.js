import React, { Component } from 'react'
const axios = require("axios")

export default class SearchResultList extends Component {

  // This would run once the component loads and used to check if the API works
  // componentDidMount(){
  //   console.log("MOUNTED")
  //   // axios.post('http://localhost:5000/search/',{searchquery:"cats",sortalpha:false}).then(response =>{
  //   //     console.log(response.data)
  //   // })
  // //   axios.get('http://localhost:5000/updateurl/',{params: {address: "https://www.rottentomatoes.com/m/cats_2019" }}).then(response =>{
  // //     console.log(response.data)
  // // })
  //   axios.get('http://localhost:5000/record/').then(response =>{
  //     console.log(response.data)
  // })
  // }

    render() {

      const updateURL = (url) =>{
          
          axios.get('http://localhost:5000/updateurl/',{params: {address: url }}).then(response =>{
          console.log(response.data)
          
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
