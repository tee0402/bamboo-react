import { Row, Col, Nav, Tab } from "react-bootstrap";
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

function Tabs() {
  return (
    <Col md={9}>
      <Tab.Content>
        <Compounding />
        <Spending />
        <Saving />
      </Tab.Content>
    </Col>
  );
}

function Content() {
  return (
    <Row>
      <Tab.Container defaultActiveKey="compounding">
        <Pills />
        <Tabs />
      </Tab.Container>
    </Row>
  );
}

export default Content;