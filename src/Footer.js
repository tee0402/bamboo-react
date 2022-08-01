import { Row, Col, Card } from "react-bootstrap";

function Footer() {
  return (
    <Row>
      <Col md={{span: 6, offset: 3}}>
        <Card bg="light" className="m-3 p-2 text-center">
          <div>GitHub: <a href="https://github.com/tee0402/bamboo-react" title="GitHub">https://github.com/tee0402/bamboo-react</a></div>
          <div><a href="https://www.flaticon.com/free-icons/bamboo" title="bamboo icons">Bamboo icons created by Freepik - Flaticon</a></div>
        </Card>
      </Col>
    </Row>
  );
}

export default Footer;