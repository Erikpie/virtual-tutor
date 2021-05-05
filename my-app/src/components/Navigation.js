import "react-router-dom"
import { useState } from "react"
import { Navbar, Form, FormControl, Nav } from "react-bootstrap"
import AuthHandler from "../auth"

function Navigation() {
  const [, setUser] = useState()
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Virtual Tutor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/Whiteboard">Whiteboard</Nav.Link>
            <Nav.Link href="/join">Join/Make a room</Nav.Link>
          </Nav>
          <AuthHandler onChange={setUser} />
          <Form inline>
            <FormControl
              type="text"
              placeholder="Subject Search"
              className="mr-sm-2"
            />{" "}
          </Form>
          <Form inline></Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }

export default Navigation