import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import NewTask from "./pages/NewTask";
import SolveTask from "./pages/SolveTask";
import SolveGraphical from "./pages/SolveGraphical";
import SolveArtifical from "./pages/SolveArtifical";
import SolveSimplex from "./pages/SolveSimplex";
import LoadTask from "./pages/LoadTask";
import Info from "./pages/Info";
import NewTaskState from "./context/newTask/newTaskState";
import SolutionState from "./context/solution/solutonState";
import ModalState from "./context/modal/modalState";
import NavBar from "./components/NavBar";
import * as Refs from "./refs";

function App() {
    return (
        <NewTaskState>
            <SolutionState>
                <ModalState>
                    <div className="container-fluid">
                        <div className="row">
                            <BrowserRouter>
                                <NavBar />
                                <Switch>
                                    <Route exact path={Refs.NEW_REF} component={NewTask} />
                                    <Route exact path={Refs.SOLUTION_REF} component={SolveTask} />
                                    <Route exact path={Refs.GAPHICAL_REF} component={SolveGraphical} />
                                    <Route exact path={Refs.ARTIFICAL_REF} component={SolveArtifical} />
                                    <Route exact path={Refs.SIMPLEX_REF} component={SolveSimplex} />
                                    <Route exact path={Refs.LOAD_REF} component={LoadTask} />
                                    <Route exact path={Refs.INFO_REF} component={Info} />
                                    <Redirect to={Refs.NEW_REF} />
                                </Switch>
                            </BrowserRouter>
                        </div>
                    </div>
                </ModalState>
            </SolutionState>
        </NewTaskState>
    );
}

export default App;
