import React, { Component } from 'react'
import axios from 'axios';

export default class SearchBar extends Component {
  
    componentDidMount(){
    axios.post('http://localhost:5000/search/',{searchquery:"cat",sortalpha:false}).then(response =>{
        console.log(response.data)
    })
  }


  render() {
    return (
        <div style={{textAlign:"center"}}>
            <form>
                <div className="mb-3"> 
                    <input  type="text"
                        required
                        className="form-control"
                    />
                </div>
                <div>
                    <input type="submit" value="Search" className="btn btn-primary" />
                </div>
            </form>
        </div>

    )
  }
}
