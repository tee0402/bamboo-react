import { InfoCircleFill } from  "react-bootstrap-icons";
import ReactTooltip from "react-tooltip";

function Tooltip({id, title}) {
  return (
    <>
      <InfoCircleFill data-tip data-for={id} className="ms-1 text-primary" />
      <ReactTooltip id={id}>{title}</ReactTooltip>
    </>
  );
}

export default Tooltip;