import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NewTask from "./pages/NewTask";
// import { About } from "./pages/About";
import NavBar from "./components/NavBar";

function App() {
    return (
        <div className="container-fluid">
            <div className="row">
                <BrowserRouter>
                <NavBar />
                    <div className="container pt-4">
                        <Switch>
                            {/* <Route path={"/"} exact component={Home} /> */}
                            <Route exact path={"/new_task"} component={NewTask} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
