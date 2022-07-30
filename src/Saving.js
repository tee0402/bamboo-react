import { useState, createContext, useContext, useEffect } from "react";
import Tooltip from "./Tooltip";
import "./Slider.css";

const SavingContext = createContext();

function Info() {
  return (
    <div className="row">
      <div className="col-md-1"></div>
      <div className="col-md-10">
        <div className="alert alert-warning" style={{fontSize: "18px"}}>
          Your savings rate is the most important factor in determining how early you can retire, not the rate of return on your investments.
          This is because increasing your savings rate has a double effect: it increases your retirement savings quicker AND it permanently reduces your expenses, allowing you to retire on less savings.
          Notice the dramatic decrease in the years to retirement when a low savings rate is increased.
          Based on the article from <a href="http://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/" className="alert-link">Mr. Money Mustache</a>.
        </div>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}

function Slider() {
  const [saving, setSaving] = useContext(SavingContext);

  return (
    <>
      <label style={{fontSize: "1.25em"}}>Savings Rate</label>
      <Tooltip title="The percentage of annual income that is saved. The current U.S. personal savings rate is 5.4%" />
      <h1 id="savingsRateText" style={{color: "#99bc20", marginTop: "0px", marginBottom: "15px"}}>{saving.savingsRate + "%"}</h1>
      <input
        id="savingsRate"
        type="range"
        name="savingsRate"
        value={saving.savingsRate}
        onChange={e => setSaving(values => ({...values, [e.target.name]: Number(e.target.value)}))}
      />
      <label style={{marginTop: "20px", fontSize: "1.875em"}}>Years to Retirement</label>
      <Tooltip title="Assumes no initial savings, 5% annual returns after inflation, 4% withdrawal rate, and that your expenses remain constant in retirement" />
      <p id="yearsToRetirement" style={{color: "#99bc20", marginTop: "-25px", fontSize: "6.25em"}}>{saving.yearsToRetirement}</p>
    </>
  );
}

function FormGroup({id, label, tooltipTitle, type, min}) {
  const [saving, setSaving] = useContext(SavingContext);

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
              value={saving[id]}
              onChange={e => setSaving(values => ({...values, [e.target.name]: e.target.checked}))}
            />
            <span className="slider round"></span>
          </label>
        </div>
      ) : (
        <div className="input-group">
          <input
            id={id}
            type="number"
            className="form-control"
            name={id}
            value={saving[id]}
            onChange={e => setSaving(values => ({...values, [e.target.name]: Number(e.target.value)}))}
            min={min}
          />
          {type === "percent" && <span className="input-group-addon">%</span>}
        </div>
      )}
    </div>
  );
}

function Form() {
  return (
    <form method="post" action="/">
      <FormGroup id="initialSavings" label="Initial Savings:" tooltipTitle="As a percentage of current annual savings" type="percent" />
      <FormGroup id="frontLoadAnnualSavings" label="Front-Load Annual Savings?" tooltipTitle="Put annual savings into accounts at the beginning of the year instead of the end of the year" type="checkbox" />
      <FormGroup id="expectedAnnualReturn" label="Expected Annual Return:" tooltipTitle="This assumes that you invest all your savings. The annualized inflation-adjusted total returns of the S&P 500 since 1926 is about 7%" type="percent" />
      <FormGroup id="withdrawalRate" label="Withdrawal Rate:" type="percent" min={0} />
      <FormGroup id="expensesInRetirement" label="Expenses in Retirement:" tooltipTitle="As a percentage of current annual expenses" type="percent" min={0} />
    </form>
  );
}

function Assumptions() {
  return (
    <>
      <button type="button" className="btn btn-warning" data-toggle="collapse" data-target="#assumptions">Change Assumptions</button>
      <div className="row">
        <div className="col-md-5"></div>
        <div id="assumptions" className="col-md-2 panel panel-default panel-collapse collapse panel-body">
          <Form />
        </div>
        <div className="col-md-5"></div>
      </div>
    </>
  );
}

function Saving() {
  const [saving, setSaving] = useState({
    savingsRate: 5,
    initialSavings: 0,
    frontLoadAnnualSavings: false,
    expectedAnnualReturn: 5,
    withdrawalRate: 4,
    expensesInRetirement: 100
  });

  useEffect(() => {
    let yearsToRetirement = "Infinite";
		if (saving.savingsRate > 0) {
			const savings = saving.savingsRate;
      console.log(savings);
			const expenses = (100 - savings) * (saving.expensesInRetirement / 100);
			let portfolioValue = saving.initialSavings / 100 * savings;
			const expectedAnnualReturn = saving.expectedAnnualReturn / 100;
			const withdrawalRate = saving.withdrawalRate / 100;
			let withdrawal = portfolioValue * withdrawalRate;
			yearsToRetirement = 0;
			while (withdrawal < expenses) {
				if (saving.frontLoadAnnualSavings) {
					portfolioValue += savings;
					portfolioValue += portfolioValue * expectedAnnualReturn;
				} else {
					portfolioValue += portfolioValue * expectedAnnualReturn + savings;
				}
				withdrawal = portfolioValue * withdrawalRate;
				yearsToRetirement++;
			}
		}
    setSaving(values => ({...values, yearsToRetirement: yearsToRetirement}));
  }, [saving.savingsRate, saving.initialSavings, saving.frontLoadAnnualSavings, saving.expectedAnnualReturn, saving.withdrawalRate, saving.expensesInRetirement]);

  return (
    <SavingContext.Provider value={[saving, setSaving]}>
      <div id="saving" className="tab-pane fade">
        <Info />
        <div className="row text-center">
          <Slider />
          <Assumptions />
        </div>
      </div>
    </SavingContext.Provider>
  );
}

export default Saving;