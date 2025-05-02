import Menu from "./components/Menu.jsx";
import Game from "./components/Game.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App() {

    return (
        <div className="h-screen w-screen">
            <Router>
                <Routes>
                    <Route path="/" element={<Menu/>}/>
                    <Route path="/game" element={<Game/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
