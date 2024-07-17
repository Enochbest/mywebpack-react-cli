import React,{Suspense,lazy} from "react";
import {Link,Route,Routes} from "react-router-dom";
// import Home from "./pages/Home";
// import About from "./pages/About";
import {Button} from "antd";
const Home = lazy(()=> import("./pages/Home"))
const About = lazy(()=> import("./pages/About"))

function App() {
    return <div>
        <Button type="primary">666</Button>
        <h1>
            App
        </h1>
        <ul>
            <li>
                <Link to="/home">home</Link>
            </li>
            <li>
                <Link to="/about">about</Link>
            </li>
        </ul>
        <Suspense fallback={<div>loading</div>}>
            <Routes>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/about" element={<About/>}></Route>
            </Routes>
        </Suspense>

    </div>
}

export default App