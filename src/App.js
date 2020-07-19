import React from 'react';
import MordenVideoPlayer from './components/MordenVideoPlayer'
import {MDBContainer} from 'mdbreact'

function App() {
  return (
    <div className="App">
      <MDBContainer>
        <MordenVideoPlayer/>
      </MDBContainer>   
    </div>
  );
}

export default App;
