import { Row, Col, Alert } from "react-bootstrap";

function Info({variant, info}) {
  return (
    <Row>
      <Col md={{span: 10, offset: 1}}>
        <Alert variant={variant} style={{fontSize: "1.125rem"}}>
          {info}
        </Alert>
      </Col>
    </Row>
  );
}

export default Info;