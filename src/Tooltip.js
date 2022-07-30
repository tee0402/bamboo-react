function Tooltip({title}) {
  return <span> <span className="glyphicon glyphicon-info-sign text-primary" data-toggle="tooltip" title={title}></span></span>;
}

export default Tooltip;