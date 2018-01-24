import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Home from 'pages/Home'
import About from 'pages/About'

ReactDOM.render((
    <BrowserRouter>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
        </ul>

        <hr/>

        <Route exact path="/" component={Home}/>
        <Route path="/about" component={() => {
         return <About dumb={`this is dumb`} dumber={`this is dumber`} />
        }}/>
        <Route path="/topics" component={() => <div>This is topics so what is your problem</div>}/>
      </div>
    </BrowserRouter>
  ),
  document.getElementById('app'));