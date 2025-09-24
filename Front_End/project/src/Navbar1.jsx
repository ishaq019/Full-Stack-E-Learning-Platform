import React from 'react';
import './App.css'
import { Link } from 'react-router-dom';
import { Routes,Route } from 'react-router-dom';
import Homepage from './Homepage';
import Contact from './Contact';
import About from './About';
import Assignment from './Assignment';
import Login from './Login';
import Register from './Register';

const navbar1 = () => {
  return (
    <div>
        <div id='Nav_parent'>
            <Link to='' > Home</Link>
            <Link to='/About'> AboutUs</Link>
            <input type='search'></input>
            <Link to='/Contact'> ContactUs</Link>
            <Link to='/Assignment'> Assignments</Link>
            <div>
                <Link to='/login'>Login</Link>/
                <Link to='/signup'>Signup</Link> 
            </div> </div>
            <br/>
            <div>
                <Routes>
                        <Route path='' element={<Homepage/>}></Route>
                         <Route path='/About' element={<About/>}></Route>
                         <Route path='/Contact' element={<Contact/>}></Route>
                         <Route path='/Assignment' element={<Assignment/>}></Route>
                         <Route path='/login' element={<Login/>}></Route>
                         <Route path='/signup' element={<Register/>}></Route>
                   </Routes>


            </div>


       
    </div>
  );
}

export default navbar1;
