import { Form, InputGroup } from "react-bootstrap";
import { CurrencyDollar, Percent } from "react-bootstrap-icons";
import Tooltip from "./Tooltip";
import "./Slider.css";

function FormGroup({state, setState, id, label, tooltipTitle, type, min, max}) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold mb-1">{label}{tooltipTitle && <Tooltip id={id} title={tooltipTitle} />}</Form.Label>
      {type === "checkbox" ? (
        <div style={{marginBottom: "-0.5rem"}}>
          <label className="switch">
            <Form.Control
              type="checkbox"
              name={id}
              checked={state[id]}
              onChange={e => setState(values => ({...values, [e.target.name]: e.target.checked}))}
            />
            <span className="slider round"></span>
          </label>
        </div>
      ) : (
        <InputGroup>
          {type === "dollars" && <InputGroup.Text><CurrencyDollar /></InputGroup.Text>}
          <Form.Control
            type="number"
            name={id}
            value={state[id]}
            onChange={e => setState(values => ({...values, [e.target.name]: Number(e.target.value)}))}
            min={min}
            max={max}
          />
          {type === "years" && <InputGroup.Text>Years</InputGroup.Text>}
          {type === "percent" && <InputGroup.Text><Percent /></InputGroup.Text>}
        </InputGroup>
      )}
    </Form.Group>
  );
}

export default FormGroup;