import { useState, useEffect } from "react";
import { Row, Col, Nav, Tab } from "react-bootstrap";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Pills.css";
import Compounding from "./Compounding";
import Spending from "./Spending";
import Saving from "./Saving";

function Pills() {
  return (
    <Col md={2}>
			<p className="fs-5 mb-1 border-bottom" style={{color: "#99bc20"}}>Tools</p>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="compounding">Compounding</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="spending">Spending Prioritization</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="saving">Years to Retirement</Nav.Link>
        </Nav.Item>
      </Nav>
		</Col>
  );
}

function Tabs({authState}) {
  const [data, setData] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "data", "data")).then(docSnap => {
      setData(docSnap.data());
    }).catch(error => console.log(error));
  }, []);

  return (
    <Col md={9}>
      <Tab.Content>
        <Compounding authState={authState} />
        {data && <Spending authState={authState} data={data} />}
        {data && <Saving authState={authState} data={data} />}
      </Tab.Content>
    </Col>
  );
}

function Content({authState}) {
  return (
    <Row>
      <Tab.Container defaultActiveKey="compounding">
        <Pills />
        <Tabs authState={authState} />
      </Tab.Container>
    </Row>
  );
}

export default Content;