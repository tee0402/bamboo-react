import { useState } from "react";
import { Row, Button, Modal, Form } from "react-bootstrap";

function LoginButtons({setShowRegister, setShowLogin}) {
  return (
    <>
      <Button variant="success" className="float-end me-3" onClick={() => setShowRegister(true)}>Register</Button>
			<Button variant="success" className="float-end me-3" onClick={() => setShowLogin(true)}>Login</Button>
    </>
  );
}

function Title() {
  return (
    <div className="ms-4">
      <h1>
        <a className="text-decoration-none" href="." style={{color: "#99bc20"}}>
          Bamboo
          <img className="ms-1" src="bamboo.png" alt="Bamboo" height="33px" />
        </a>
      </h1>
			<small>Grow your savings for financial independence or retirement</small>
    </div>
  );
}

function LoginModal({show, setShow, id, title}) {
	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form id={id}>
					<Form.Group className="mb-2">
						<Form.Label>Email Address:</Form.Label>
						<Form.Control type="email" required></Form.Control>
					</Form.Group>
					<Form.Group className="mb-2">
						<Form.Label>{"Password:" + (id === "register" ? " (8 characters minimum)" : "")}</Form.Label>
						<Form.Control type="password" pattern={id === "register" && ".{8,}"} required></Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="submit" variant="success" form={id}>{title}</Button>
			</Modal.Footer>
		</Modal>
	);
}

function Header() {
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);

  return (
    <Row >
      <div className="p-2 pb-3 border-bottom mt-4 mb-2">
        <LoginButtons setShowRegister={setShowRegister} setShowLogin={setShowLogin} />
        <Title />
        <LoginModal show={showRegister} setShow={setShowRegister} id="register" title="Register" />
        <LoginModal show={showLogin} setShow={setShowLogin} id="login" title="Login" />
      </div>
    </Row>
  );
}

export default Header;