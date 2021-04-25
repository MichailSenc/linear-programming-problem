import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NewTask from "./pages/NewTask";
import SolveTask from "./pages/SolveTask";
// import { About } from "./pages/About";
import NewTaskState from "./context/newTask/newTaskState";
import SolutionState from "./context/solution/solutonState";
import NavBar from "./components/NavBar";
import { NEW_REF, SOLUTION_REF } from "./refs";

function App() {
    return (
        <NewTaskState>
            <SolutionState>
                <div className="container-fluid">
                    <div className="row">
                        <BrowserRouter>
                            <NavBar />
                            <div className="container pt-4">
                                <Switch>
                                    <Route exact path={NEW_REF} component={NewTask} />
                                    <Route exact path={SOLUTION_REF} component={SolveTask} />
                                </Switch>
                            </div>
                        </BrowserRouter>
                    </div>
                </div>
            </SolutionState>
        </NewTaskState>
    );
}

export default App;
