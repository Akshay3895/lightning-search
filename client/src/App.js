import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResultList from './components/SearchResultList';
import { useEffect, useState } from 'react';
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
      pageTabs.push(<li key={"page_"+i} className="page-item" onClick={() => changePage(i, results)}><a className="page-link" href="#" 
  key={i}>{i}</a></li>)
    }
    return pageTabs;
  }

  const getSearchInputValue = (event) =>{
      var arr=["alibaba", "aliexpress", "youtube","facebook","whatsapp","netflix","spider","roblox","amazon","hotmail","zoom",
               "google","gmail","olympics","andrewCuomo","cute spider","godzilla vs kong","macy’s","bestbuy","macy",
               "kohls","amc","Spider","cuba","ondrive","outlook","oops!","ooad","ooa","ooak",
               "ooama","oats","utd","apple","airbnb","apartments","alert","orange","otama","oden","ball","bone"]

      const userValue = event.target; /*return the element that triggered the event*/
      var currentFocus = -1;
      setsearchItem(event.target.value);
      
     /*function executed when input changes*/
      userValue.addEventListener("input", function(e) {
         var divCreate,b,i,
         fieldVal = this.value;

         closeAllLists();
         if (!fieldVal) 
         {
            currentFocus = -1;
            return false;
         }
         
         /*DIV element for storing values*/

         var rowCreate = document.createElement("div")
         rowCreate.setAttribute("class","row")
         rowCreate.style.position = "absolute";
         rowCreate.style.zIndex = 7;

         var divCreate = document.createElement("div")
         divCreate.setAttribute("id", this.id + "autocomplete-list");
         divCreate.setAttribute("class","col-md-6 autocomplete-items")
         divCreate.style.width = "100%"
         rowCreate.appendChild(divCreate)

         this.parentNode.parentNode.appendChild(rowCreate); // We want col-md-6 mt-4 as the parent 
         
         for (var i = 0; i <arr.length; i++) 
         { /*check for elements that start with the same element as the target element*/
            if ( arr[i].substr(0, fieldVal.length).toLowerCase() == fieldVal.toLowerCase() ) 
            {
              /*For every matching element create a DIV element and highlight the matching characters*/
               b = document.createElement("div");
               b.innerHTML = "<strong>" + arr[i].substr(0, fieldVal.length) + "</strong>";
               b.innerHTML += arr[i].substr(fieldVal.length);
               b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              //  b.position = "relative"
               b.setAttribute("class","autocomplete")
               
               b.addEventListener("click", function(e) 
                {
                 /*complete the required statement or word when a suggestion is clicked*/
                  userValue.value = this.getElementsByTagName("input")[0].value;
                  closeAllLists();
                });
               divCreate.appendChild(b);
            }
         }
      });
    /*Choosing among the given suggestions using keyboard arrows*/
    userValue.addEventListener("keydown", function(e) {
         var autocomplete = document.getElementById(
            this.id + "autocomplete-list"
         );
         if (autocomplete){
            autocomplete = autocomplete.getElementsByTagName("div");
            // console.log(autocomplete) 
          }
         if (e.keyCode == 40) { /*Down arrow */
            currentFocus++;
            addActive(autocomplete);
         }
         else if (e.keyCode == 38) { /*Up arrow*/
            currentFocus--;
            addActive(autocomplete);
         }
         else if (e.keyCode == 13) { /*Enter*/
            e.preventDefault();
            if (currentFocus > -1) {
               if (autocomplete) {
                 autocomplete[currentFocus].click();
                 var focusedValue = autocomplete[currentFocus].children[1].value
                 setsearchItem(event.target.value);
                 
               }
            }
         }
      });
    
    function addActive(autocomplete) {
         if (!autocomplete) 
           return false;
         removeActive(autocomplete);
         if (currentFocus >= autocomplete.length) currentFocus = 0;
         if (currentFocus < 0) currentFocus = autocomplete.length - 1;
         autocomplete[currentFocus].classList.remove("autocomplete");
         autocomplete[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(autocomplete) {
         for (var x = 0; x < autocomplete.length; x++) {
            autocomplete[x].classList.remove("autocomplete-active")
            autocomplete[x].classList.add("autocomplete");
         }
      }
      function closeAllLists(elmnt) {
         var autocomplete = document.getElementsByClassName(
            "autocomplete-items"
         );
        //  autocomplete[0].parentNode.remove(); // autocomplete-items class has a parent arrow
        //  if (autocomplete)
         
         for (var x = 0; x < autocomplete.length; x++) {
            if (elmnt != autocomplete[x] && elmnt != userValue) {

              //  autocomplete[x].parentNode.removeChild(autocomplete[x]);
              autocomplete[x].parentNode.remove()
            }
         }
      }
      document.addEventListener("click", function(e) {
         closeAllLists(e.target);
      });
    
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
                  <div className="input-group">
                  
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
          
          <div className="row" style={{"position":"relative","zIndex":"3"}}>
          <hr/>
              <div className="col-md-1"></div>
              <div className="col-md-6" id="box">
                <SearchResultList list={data.slice((page - 1) * results, (page * results) > data.length ? data.length : (page * results))} />
              </div>
                <br/>
                <br/>
                <hr/>
                  </div>
                  
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
