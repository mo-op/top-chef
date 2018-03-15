import React, { Component } from 'react';

import './App.css';
import data from './promotions.json';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="header">

//           <h1 className="title">List of Promotions For You:</h1>
//         </header>
//     <div className="headP">
//       <ul>
//        {
//         //tutorial: http://4dev.tech/2017/12/how-to-load-a-json-file-in-reactjs/
//           data.map(function(resto)
//           {
//             return <li>
//                 {resto.name} - {resto.address.postal_code}
//                 {resto.link}
//             </li>  

//           })

//        }
//          </ul> 
  
//         </div>
//           <h1 className="title">Bon Appetit!</h1>
//       </div>
//     );
//   }
// }

class App extends Component {
  render() {
    return (
      <div className="headP">
        <h1 className="title">List of Promotions For You:</h1>

        <ul>
        {
          data.map(function(resto){
            return <li>{resto.name} | {resto.address.postal_code} | <a href={resto.link}>Link to Offer</a></li>;
          })
        }
        </ul>
      <h1 className="title">Bon Appetit!</h1>

      </div>

    );
  }
}

export default App;