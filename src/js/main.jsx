import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'

ReactDOM.render((
    <BrowserRouter>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
        </ul>

        <hr/>

        <Route exact path="/" component={() => <div>Home</div>}/>
        <Route path="/about" component={() => <div>About</div>}/>
        <Route path="/topics" component={() => <div>Topics</div>}/>
      </div>
    </BrowserRouter>
  ),
  document.getElementById('app'));