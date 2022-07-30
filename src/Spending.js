import { useState, createContext, useContext, useEffect } from "react";
import "./Spending.css";
import "./Slider.css";
import Tooltip from "./Tooltip";
import formatCurrency from "./formatCurrency";

const SpendingContext = createContext();

function Info() {
  return (
    <div className="row">
      <div className="col-md-1"></div>
      <div className="col-md-10">
        <div className="alert alert-info" style={{fontSize: "18px"}}>
          You can spend your income in a way that benefits you in the long run by focusing on the more important priorities first.
          Those are the ones that would give you the maximum benefits for your money, such as building up an ample emergency fund (6 months of expenses), taking advantage of free money such as a company 401(k) match, minimizing interest payments by eliminating high-interest debt, and contributing to tax-deferred retirement accounts before contributing to taxable ones.
          Based on the flowchart from <a href="https://www.reddit.com/r/personalfinance/comments/4gdlu9/how_to_prioritize_spending_your_money_a_flowchart/" className="alert-link">Reddit</a>.
        </div>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}

function FormGroup({id, label, tooltipTitle, type, min}) {
  const [spending, setSpending] = useContext(SpendingContext);

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
              checked={spending[id]}
              onChange={e => setSpending(values => ({...values, [e.target.name]: e.target.checked}))}
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
            value={spending[id]}
            onChange={e => setSpending(values => ({...values, [e.target.name]: Number(e.target.value)}))}
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
      <FormGroup id="age50OrOlder" label="Age 50 or Older?" type="checkbox" />
      <FormGroup id="annualIncome" label="Annual Income:" type="dollars" min={0} />
      <FormGroup id="monthlyEssentialExpenses" label="Monthly Essential Expenses:" tooltipTitle="Rent, utilities, food, insurance, minimum payments, etc." type="dollars" min={0} />
      <FormGroup id="emergencyFund" label="Emergency Fund:" type="dollars" min={0} />
      <FormGroup id="debt" label="Debt:" type="dollars" min={0} />
      <FormGroup id="contributionsThisYear" label="401(k) Contributions This Year:" type="dollars" min={0} />
      <FormGroup id="company401kMatch" label="Company 401(k) % Match:" tooltipTitle="The percentage of gross income that the employer matches up to. Enter 0 if your company does not match 401(k) contributions" type="percent" min={0} />
      <FormGroup id="iraContributionsThisYear" label="IRA Contributions This Year:" tooltipTitle="Roth and Traditional combined" type="dollars" min={0} />
    </form>
  );
}

function Step({alertStyle, next, label, tooltipTitle}) {
  return (
    <div className={"alert " + alertStyle}>
      {next && <i className="material-icons md-16">subdirectory_arrow_right</i>}
      {label}
      {tooltipTitle && <Tooltip title={tooltipTitle} />}
    </div>
  );
}

function Steps() {
  const spending = useContext(SpendingContext)[0];

  return (
    <>
      {spending.monthlyEssentialExpenses > 0 && <Step alertStyle="alert-success" label={<>Pay <strong>essential expenses</strong> and try to <strong>reduce</strong> them.</>} />}
      {spending.emergencyFundContributions > 0 && <Step alertStyle="alert-info" next={true} label={<>Contribute <strong>{formatCurrency(spending.emergencyFundContributions)}</strong> to your <strong>emergency fund</strong>.</>} />}
      {spending.company401kMatchContributions > 0 && <Step alertStyle="alert-warning" next={true} label={<>Contribute <strong>{formatCurrency(spending.company401kMatchContributions)}</strong> to your <strong>401(k)</strong> for your <strong>company match</strong>.</>} />}
      {spending.debtContributions > 0 && <Step alertStyle="alert-danger" next={true} label={<>Pay off <strong>{formatCurrency(spending.debtContributions)}</strong> of your <strong>debt</strong>, starting with the <strong>highest interest</strong> loans.</>} />}
      {spending.iraContributions > 0 && <Step alertStyle="alert-success" next={true} label={<>Contribute <strong>{formatCurrency(spending.iraContributions)}</strong> to your <strong>Roth or Traditional IRA</strong>.</>} tooltipTitle="Use a Roth IRA if you expect your tax rate to be the same or higher in retirement. Use a Traditional IRA if you expect it to be lower" />}
      {spending.company401kContributions > 0 && <Step alertStyle="alert-warning" next={true} label={<>Contribute <strong>{formatCurrency(spending.company401kContributions)}</strong> to your <strong>401(k)</strong>.</>} />}
      {spending.cash > 0 && <Step alertStyle="alert-info" next={true} label={<>Contribute the remaining <strong>{formatCurrency(spending.cash)}</strong> to your <strong>savings and/or investment accounts</strong>.</>} tooltipTitle="Use a savings account for short-term goals (< 5 years) and an investment account for long-term goals (> 10 years)" />}
    </>
  );
}

function Content() {
  return (
    <div className="row">
      <div className="col-md-3">
        <Form />
      </div>
      <div className="col-md-9">
        <Steps />
      </div>
    </div>
  );
}

function Spending() {
  const [spending, setSpending] = useState({
    age50OrOlder: false,
    annualIncome: 50000,
    monthlyEssentialExpenses: 1000,
    emergencyFund: 0,
    debt: 1000,
    contributionsThisYear: 0,
    company401kMatch: 5,
    iraContributionsThisYear: 0
  });

  const company401kContributionsLimitUnder50 = 20500;
  const company401kContributionsLimit50OrOlder = 27000;
  const iraContributionsLimitUnder50 = 6000;
  const iraContributionsLimit50OrOlder = 7000;
  useEffect(() => {
    let cash = spending.annualIncome - spending.monthlyEssentialExpenses * 12;
    cash = Math.max(0, cash);

		const idealEmergencyFund = spending.monthlyEssentialExpenses * 6;
    const emergencyFundTopOff = Math.max(0, idealEmergencyFund - spending.emergencyFund);
    const emergencyFundContributions = Math.min(cash, emergencyFundTopOff);
		cash -= emergencyFundContributions;
		
		const company401kMatch = spending.annualIncome * (spending.company401kMatch / 100);
    const company401kMatchTopOff = Math.max(0, company401kMatch - spending.contributionsThisYear);
    const company401kMatchContributions = Math.min(cash, company401kMatchTopOff);
		cash -= company401kMatchContributions;
    const totalCompany401kContributions = spending.contributionsThisYear + company401kMatchContributions;
		
		const debt = Math.max(0, spending.debt);
    const debtContributions = Math.min(cash, debt);
		cash -= debtContributions;
		
		const iraContributionsLimit = spending.age50OrOlder ? iraContributionsLimit50OrOlder : iraContributionsLimitUnder50;
    const iraTopOff = Math.max(0, iraContributionsLimit - spending.iraContributionsThisYear);
    const iraContributions = Math.min(cash, iraTopOff);
		cash -= iraContributions;
		
		const company401kContributionsLimit = spending.age50OrOlder ? company401kContributionsLimit50OrOlder : company401kContributionsLimitUnder50;
    const company401kTopOff = Math.max(0, company401kContributionsLimit - totalCompany401kContributions);
    const company401kContributions = Math.min(cash, company401kTopOff);
		cash -= company401kContributions;

    setSpending(values => ({...values, emergencyFundContributions: emergencyFundContributions, company401kMatchContributions: company401kMatchContributions, debtContributions: debtContributions, iraContributions: iraContributions, company401kContributions: company401kContributions, cash: cash}));
  }, [spending.age50OrOlder, spending.annualIncome, spending.monthlyEssentialExpenses, spending.emergencyFund, spending.debt, spending.contributionsThisYear, spending.company401kMatch, spending.iraContributionsThisYear]);

  return (
    <SpendingContext.Provider value={[spending, setSpending]}>
      <div id="spending" className="tab-pane fade">
        <Info />
        <Content />
      </div>
    </SpendingContext.Provider>
  );
}

export default Spending;