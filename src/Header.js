import { useState, useEffect } from "react";
import { Row, Button, Modal, Form, Alert } from "react-bootstrap";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

function LoginButtons({initialized, setShowRegister, setShowLogin, loggedIn, setLoggedIn, email, setEmail}) {
	function logout() {
		signOut(auth).then(() => {
			setLoggedIn(false);
			setEmail("");
		}).catch(error => {
			console.log(error);
		});
	}

  return (
		initialized ? (
			loggedIn ? (
				<div className="float-end me-3">
					<span className="text-success fw-bold me-2">Welcome {email}</span>
					<Button variant="success" onClick={logout}>Logout</Button>
				</div>
			) : (
				<div className="float-end me-3">
					<Button variant="success" className="me-3" onClick={() => setShowLogin(true)}>Login</Button>
					<Button variant="success" onClick={() => setShowRegister(true)}>Register</Button>
				</div>
			)
		) : <></>
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

function LoginModal({show, setShow, setLoggedIn, setEmail, id, title}) {
	const [error, setError] = useState("");

	function onHide() {
		setShow(false);
		setError("");
	}

	function onSubmit(e) {
		e.preventDefault();
		setError("");
		const email = e.target.email.value;
		const password = e.target.password.value;
		if (id === "register") {
			createUserWithEmailAndPassword(auth, email, password).then(userCredential => {
				setLoggedIn(true);
				setEmail(userCredential.user.email);
				setShow(false);
			}).catch(error => {
				const errorCode = error.code;
				switch(errorCode) {
					case "auth/email-already-in-use":
						setError("Email already in use.");
						break;
					case "auth/invalid-email":
						setError("Invalid email.");
						break;
					default:
						setError(errorCode);
				}
			});
		} else {
			signInWithEmailAndPassword(auth, email, password).then(userCredential => {
				setLoggedIn(true);
				setEmail(userCredential.user.email);
				setShow(false);
			}).catch(error => {
				setError("Incorrect email or password. Please try again.");
			});
		}
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error !== "" && <Alert variant="danger">{error}</Alert>}
				<Form id={id} onSubmit={onSubmit}>
					<Form.Group className="mb-2">
						<Form.Label>Email Address:</Form.Label>
						<Form.Control type="email" name="email" required></Form.Control>
					</Form.Group>
					<Form.Group className="mb-2">
						<Form.Label>{"Password:" + (id === "register" ? " (8 characters minimum)" : "")}</Form.Label>
						<Form.Control type="password" name="password" pattern={id === "register" ? ".{8,}" : undefined} required></Form.Control>
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
	const [initialized, setInitialized] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [email, setEmail] = useState("");

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setLoggedIn(true);
				setEmail(user.email);
			}
			setInitialized(true);
		});
	}, []);

  return (
    <Row >
      <div className="p-2 pb-3 border-bottom mt-4 mb-2">
        <LoginButtons initialized={initialized} setShowRegister={setShowRegister} setShowLogin={setShowLogin} loggedIn={loggedIn} setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} />
        <Title />
        <LoginModal show={showRegister} setShow={setShowRegister} setLoggedIn={setLoggedIn} setEmail={setEmail} id="register" title="Register" />
        <LoginModal show={showLogin} setShow={setShowLogin} setLoggedIn={setLoggedIn} setEmail={setEmail} id="login" title="Login" />
      </div>
    </Row>
  );
}

export default Header;