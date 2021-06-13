import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { NEW_REF, LOAD_REF, INFO_REF } from "../refs";

const MainNavbar = () => {
    return (
        <Navbar className="w-100" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand>BestApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink className="mr-2 nav-link" to={NEW_REF}>
                        Новая задача
                    </NavLink>
                    <NavLink className="mr-2 nav-link" to={LOAD_REF}>
                        Загрузить задачу
                    </NavLink>
                </Nav>
                <Nav>
                    <NavLink className="mr-2 nav-link" to={INFO_REF}>
                        More deets
                    </NavLink>
                    <NavLink className="mr-2 nav-link" to="/memes">
                        Dank memes
                    </NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default MainNavbar;
