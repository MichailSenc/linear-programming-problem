import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import NewTask from "./pages/NewTask";
import SolveTask from "./pages/SolveTask";
import SolveGraphical from "./pages/SolveGraphical";
import SolveSimplex from "./pages/SolveSimplex";
import LoadTask from "./pages/LoadTask";
import Info from "./pages/Info";
import NewTaskState from "./context/newTask/newTaskState";
import SolutionState from "./context/solution/solutonState";
import ModalState from "./context/modal/modalState";
import NavBar from "./components/NavBar";
import { NEW_REF, SOLUTION_REF, GAPHICAL_REF, SIMPLEX_REF, INFO_REF, LOAD_REF } from "./refs";

function App() {
    return (
        <NewTaskState>
            <SolutionState>
                <ModalState>
                    <div className="container-fluid">
                        <div className="row">
                            <BrowserRouter>
                                <NavBar />
                                <div className="container pt-4">
                                    <Switch>
                                        <Route exact path={NEW_REF} component={NewTask} />
                                        <Route exact path={SOLUTION_REF} component={SolveTask} />
                                        <Route exact path={GAPHICAL_REF} component={SolveGraphical} />
                                        <Route exact path={SIMPLEX_REF} component={SolveSimplex} />
                                        <Route exact path={LOAD_REF} component={LoadTask} />
                                        <Route exact path={INFO_REF} component={Info} />
                                        <Redirect to={NEW_REF}/>
                                    </Switch>
                                </div>
                            </BrowserRouter>
                        </div>
                    </div>
                </ModalState>
            </SolutionState>
        </NewTaskState>
    );
}

export default App;
