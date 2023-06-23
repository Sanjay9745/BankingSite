import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Transfer from './components/Transfer';
import Home from './components/Home';
import Statement from './components/Statement';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <>
        <Navbar/>
        <Home/>
        </>}/>
        <Route path="/deposit" element={ <>
        <Navbar/>
        <Deposit/>
        </>}/>
        <Route path="/withdraw" element={ <>
        <Navbar/>
        <Withdraw/>
        </>}/>
        <Route path="/transfer" element={ <>
        <Navbar/>
        <Transfer/>
        </>}/>
        <Route path="/statement" element={ <>
        <Navbar/>
        <Statement/>
        </>}/>
        <Route path="/login" element={ <Login/>}/>
        <Route path="/register" element={ <Register/>}/>
      </Routes>
     
    </div>
  );
}

export default App;
