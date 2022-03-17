import React, { Component } from 'react'

export default class SearchResultList extends Component {

  render() {
      console.log("Inside search result");
      console.log(this.props.list);
    return (
        this.props.list.map(url => (
            <div class="search_result" id={url.id} key={url.id}>
                <a href={url.address}>{url.title}</a>
                <h6>{url.address}</h6>
                <p>{url.description}</p>
            </div>
          ))
    )
  }
}
