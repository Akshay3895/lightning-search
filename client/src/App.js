import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className='container mt-5'>
      <h2 style={{color:"blue",textAlign:"center"}}>Lightning Search</h2>
      <SearchBar />
    </div>
  );
}

export default App;
