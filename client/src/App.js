import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResultList from './components/SearchResultList';
import { useEffect, useState } from 'react';
import { getDefaultNormalizer } from '@testing-library/react';
const axios = require("axios")


function App() {

  var [data, setData] = useState([]);
  var [page, setPage] = useState(1);
  var [results, setResults] = useState(10);
  var [searchItem, setsearchItem] = useState("");

  const changeSortOrder = (sortOrder) => {
    let urls = data;
    urls = urls.sort((u1, u2) => {
      if (sortOrder == 1)
        return (u1.title > u2.title ? 1 : -1);
      else if (sortOrder == 2)
        return (new Date(u2.lastVisited) - new Date(u1.lastVisited));
      else
        return u2.timesVisited - u1.timesVisited;
    })
    setData([...urls]);
  };

  const getData = () => {
    
    axios.post('http://localhost:5000/search/',{searchquery:searchItem}).then(response =>{
          console.log(response.data)
          setData(response.data);
    
      }).catch(console.log)
    // Can be used for testing the frontend
    // fetch('output.json', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   }
    // })
    // .then(result => result.json())
    // .then((urls) => {
    //   setData(urls);
    // })
    // .catch(console.log)
  };

  const changeResultCount = (rc) => {
    setResults(rc);
    changePage(1, rc);
  }

  const changePage = (page, results) => {
    let previous = document.getElementById("previous");
    let next = document.getElementById("next");
    previous.classList.remove("disabled");
    next.classList.remove("disabled");
    let last = data.length % results > 0 ? ((data.length - data.length % results)/ results) + 1 : data.length / results;
    if (page == 1) {
      previous.classList.add("disabled");
    }
    if (page === last) {
      next.classList.add("disabled");
    }
    setPage(page);
  }
  
  const getPages = () => {
    let pageTabs = [];
    let total = data.length % results > 0 ? ((data.length - data.length % results) / results) + 1 : data.length / results;
    for (let i = 1; i <= total; i++) {
      pageTabs.push(<li key={"page_"+i} className="page-item" onClick={() => changePage(i, results)}><a className="page-link" href="#" key={i}>{i}</a></li>)
    }
    return pageTabs;
  }

  const getSearchInputValue = (event) =>{

      const userValue = event.target.value;
      setsearchItem(userValue);
      // console.log("Input", userValue);
  };

  return (
    <div className='container mt-5'>
<div className='container mt-5'>
<div className="container-fluid">
      <div className="row">
          <div className="col-md-1">
              <img src="logo.jpeg" className="img" alt="..." width="100" height="100" />
              </div>
              <div className="col-md-6 mt-4">
                  <div className="input-group mb-3">
                  
                  <input id="search-focus" type="search" className="form-control" onChange={getSearchInputValue} placeholder="Search"/>
                  <div className="input-group-append">
                      <button type="button" className="btn btn-primary" onClick={() => getData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </button>
                  </div>
                </div>
              </div>
              <div className="col-md-2 mt-4">
                  <div className="btn-group">
                      <button type="button" className="btn btn-primary">Sort By</button>
                      <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="visually-hidden"></span>
                      </button>
                      <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#" onClick={() => changeSortOrder(1)}>Alphabetically</a></li>
                      <li><a className="dropdown-item" href="#" onClick={() => changeSortOrder(2)}>Most Recent</a></li>
                      <li><a className="dropdown-item" href="#" onClick={() => changeSortOrder(3)}>Most Visited</a></li>
                      </ul>
                  </div>
            </div>
            <div className="col-md-2 mt-4">
                  <div className="btn-group">
                      <button type="button" className="btn btn-primary">Results per page</button>
                      <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="visually-hidden"></span>
                      </button>
                      <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#" onClick={() => changeResultCount(10)}>10</a></li>
                      <li><a className="dropdown-item" href="#" onClick={() => changeResultCount(15)}>15</a></li>
                      <li><a className="dropdown-item" href="#" onClick={() => changeResultCount(20)}>20</a></li>
                      </ul>
                  </div>
            </div>
  </div>
          <hr/>
          <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-6" id="box">
                <SearchResultList list={data.slice((page - 1) * results, (page * results) > data.length ? data.length : (page * results))} />
              </div>
                <br/>
                <br/>
                  </div>
                  <hr/>
                  <div className="row">
                      <div className="col-md-1"></div>
                      <div className="col-md-6" id="box">
                  <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-center">
                        <li id="previous" className="page-item disabled">
                          <a className="page-link" onClick={() => changePage(page - 1, results)} href="#" tabIndex="-1">Previous</a>
                        </li>
                        {getPages()}
                        <li id="next" className="page-item">
                          <a className="page-link" onClick={() => changePage(page + 1, results)} href="#">Next</a>
                        </li>
                      </ul>
                    </nav>
              </div>
          </div>

      </div>
  </div>        
    </div>
  );
}

export default App;
