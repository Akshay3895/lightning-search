import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResultList from './components/SearchResultList';
import { useEffect, useState } from 'react';
import { getDefaultNormalizer } from '@testing-library/react';



function App() {

  var [data, setData] = useState([]);

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
    fetch('output.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(result => result.json())
    .then((urls) => {
      setData(urls);
    })
    .catch(console.log)
  };
  
  return (
    <div className='container mt-5'>
<div className='container mt-5'>
<div class="container-fluid">
      <div class="row">
          <div class="col-md-1">
              <img src="logo.jpeg" class="img" alt="..." width="100" height="100" />
              </div>
              <div class="col-md-6 mt-4">
                  <div class="input-group mb-3">
                  
                  <input id="search-focus" type="search" class="form-control" placeholder="Search"/>
                  <div class="input-group-append">
                      <button type="button" class="btn btn-primary" onClick={() => getData()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </button>
                  </div>
                </div>
              </div>
              <div class="col-md-2 mt-4">
                  <div class="btn-group">
                      <button type="button" class="btn btn-primary">Sort By</button>
                      <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="visually-hidden"></span>
                      </button>
                      <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" onClick={() => changeSortOrder(1)}>Alphabetically</a></li>
                      <li><a class="dropdown-item" href="#" onClick={() => changeSortOrder(2)}>Most Recent</a></li>
                      <li><a class="dropdown-item" href="#" onClick={() => changeSortOrder(3)}>Most Visited</a></li>
                      </ul>
                  </div>
          </div>
  </div>
          <hr/>
          <div class="row">
              <div class="col-md-1"></div>
              <div class="col-md-6" id="box">
                <SearchResultList list={data} />
              </div>
                <br/>
                <br/>
                  </div>
                  <hr/>
                  <div class="row">
                      <div class="col-md-1"></div>
                      <div class="col-md-6" id="box">
                  <nav aria-label="Page navigation example">
                      <ul class="pagination justify-content-center">
                        <li class="page-item disabled">
                          <a class="page-link" href="#" tabIndex="-1">Previous</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                          <a class="page-link" href="#">Next</a>
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
