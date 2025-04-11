import Menu from "./components/Menu.jsx";
import Game from "./components/Game.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

    return (<section>
            <Router>
                <Routes>
                    <Route path="/" element={<Menu/>}/>
                    <Route path="/game" element={<Game/>}/>
                </Routes>
            </Router>
        </section>
    );
}

export default App;
