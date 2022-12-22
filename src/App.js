import React from 'react';
import HomeScreen from './screens/HomeScreen';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from './screens/LoginScreen';

function App() {
  const user = null;

  return (
    <div className="app">
      <Router>

        {!user ? (
          <LoginScreen />
        ) :(
          <Routes>
         
          <Route exact path ="/"
          element = {<HomeScreen />} >
          </Route>
          <Route exact path ="/test"
          element = {<h1>This is the test</h1>} >
          </Route>
        </Routes>

        )}
        
      </Router>
      
    </div>
  );
}

export default App;
