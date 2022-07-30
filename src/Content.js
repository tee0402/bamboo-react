import "./Content.css";
import Compounding from "./Compounding";
import Spending from "./Spending";
import Saving from "./Saving";

function Pills() {
  return (
    <div className="col-md-2">
			<p style={{color: "#99bc20", fontSize: "1.25em", borderBottom: "1px solid", marginBottom: "5px"}}>Tools</p>
			<ul className="nav nav-pills nav-stacked">
				<li id="compoundingPill" className="active"><a data-toggle="pill" href="#compounding">Compounding</a></li>
				<li id="spendingPill"><a data-toggle="pill" href="#spending">Spending Prioritization</a></li>
				<li id="savingPill"><a data-toggle="pill" href="#saving">Years to Retirement</a></li>
			</ul>
			<br />
		</div>
  );
}

function Tabs() {
  return (
    <div className="col-md-9 tab-content">
      <Compounding />
      <Spending />
      <Saving />
    </div>
  );
}

function Content() {
  return (
    <div className="row">
      <Pills />
      <Tabs />
      <div className="col-md-1"></div>
    </div>
  );
}

export default Content;