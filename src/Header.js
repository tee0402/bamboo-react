import { useState } from "react";
import { Row, Button, Modal, Form, Alert } from "react-bootstrap";
import { auth, db, create } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc } from "firebase/firestore";

function LoginButtons({setShowRegister, setShowLogin, authState, setAuthState}) {
	function logout() {
		signOut(auth).then(() => {
			setAuthState(values => ({...values, loggedIn: false, email: "", docRef: null}));
		}).catch(error => {
			console.log(error);
		});
	}

  return (
		authState.initialized ? (
			authState.loggedIn ? (
				<div className="float-end me-3">
					<span className="text-success fw-bold me-2">Welcome {authState.email}!</span>
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

function LoginModal({show, setShow, setAuthState, id, title}) {
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
			createUserWithEmailAndPassword(auth, email, password).then(async userCredential => {
				const user = userCredential.user;
				const docRef = doc(db, "users", user.uid);
				await create(docRef);
				setAuthState(values => ({...values, loggedIn: true, email: user.email, docRef: docRef}));
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
				const user = userCredential.user;
				setAuthState(values => ({...values, loggedIn: true, email: user.email, docRef: doc(db, "users", user.uid)}));
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

function Header({authState, setAuthState}) {
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);

  return (
    <Row >
      <div className="p-2 pb-3 border-bottom mt-4 mb-2">
        <LoginButtons setShowRegister={setShowRegister} setShowLogin={setShowLogin} authState={authState} setAuthState={setAuthState} />
        <Title />
        <LoginModal show={showRegister} setShow={setShowRegister} setAuthState={setAuthState} id="register" title="Register" />
        <LoginModal show={showLogin} setShow={setShowLogin} setAuthState={setAuthState} id="login" title="Login" />
      </div>
    </Row>
  );
}

export default Header;