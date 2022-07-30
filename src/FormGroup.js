import Tooltip from './Tooltip';
import "./Slider.css";

function FormGroup({state, setState, id, label, tooltipTitle, type, min, max}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {tooltipTitle && <Tooltip title={tooltipTitle} />}
      {type === "checkbox" ? (
        <div style={{marginBottom: "-10px"}}>
          <label className="switch">
            <input
              id={id}
              type="checkbox"
              className="form-control"
              name={id}
              value={state[id]}
              onChange={e => setState(values => ({...values, [e.target.name]: e.target.checked}))}
            />
            <span className="slider round"></span>
          </label>
        </div>
      ) : (
        <div className="input-group">
          {type === "dollars" && <span className="input-group-addon"><i className="glyphicon glyphicon-usd"></i></span>}
          <input
            id={id}
            type="number"
            className="form-control"
            name={id}
            value={state[id]}
            onChange={e => setState(values => ({...values, [e.target.name]: Number(e.target.value)}))}
            min={min}
            max={max}
          />
          {type === "years" && <span className="input-group-addon">Years</span>}
          {type === "percent" && <span className="input-group-addon">%</span>}
        </div>
      )}
    </div>
  );
}

export default FormGroup;