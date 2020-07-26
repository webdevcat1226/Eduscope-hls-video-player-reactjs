import React from "react";
import ModernVideoPlayer from "./components/ModernVideoPlayer";
import { MDBContainer } from "mdbreact";

function App () {
	return (
		<div className="App">
			<MDBContainer>
				<ModernVideoPlayer />
			</MDBContainer>
		</div>
	);
}

export default App;
