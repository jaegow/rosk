import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, Link} from 'react-router';

const Testees = () => <div>React stuff coming at ya</div>

const App = () => (
  <div>
      <Testees/>
  </div>
);

// class App extends React.Component {
//     render() {
//         return (
//             <Router>
//                 <div>
//                     <ul>
//                         <li><Link to="/">Home</Link></li>
//                         <li><Link to="/about">About</Link></li>
//                         <li><Link to="/topics">Topics</Link></li>
//                     </ul>
//
//                     <hr/>
//
//                     <Route exact path="/" component={<div>Home</div>}/>
//                     <Route path="/about" component={<div>About</div>}/>
//                     <Route path="/topics" component={<div>Topics</div>}/>
//                 </div>
//             </Router>
//         )
//     }
// }

ReactDOM.render(<App />, document.getElementById('app'));