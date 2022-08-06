import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import { auth, db, create } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Container from "react-bootstrap/Container";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  const [authState, setAuthState] = useState({
    initialized: false,
    loggedIn: false,
    email: "",
    docRef: null,
    docDataInitialized: false,
    docData: {}
  });

  useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setAuthState(values => ({...values, loggedIn: true, email: user.email, docRef: doc(db, "users", user.uid)}));
			}
			setAuthState(values => ({...values, initialized: true}));
		});
	}, []);

  useEffect(() => {
    if (authState.loggedIn) {
      getDoc(authState.docRef).then(async docSnap => {
        if (docSnap.exists()) {
          setAuthState(values => ({...values, docDataInitialized: true, docData: docSnap.data()}));
        } else {
          await create(authState.docRef);
          getDoc(authState.docRef).then(docSnap => setAuthState(values => ({...values, docDataInitialized: true, docData: docSnap.data()}))).catch(error => console.log(error));
        }
      }).catch(error => console.log(error));
    }
  }, [authState.loggedIn, authState.docRef]);

  return (
    <Container fluid>
      <Header authState={authState} setAuthState={setAuthState} />
      <Content authState={authState} />
      <br /><br />
      <Footer />
    </Container>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);