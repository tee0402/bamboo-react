import { useState, createContext, useContext, useEffect } from "react";
import { Tab, Alert, Row, Col, Form, Button, Collapse } from "react-bootstrap";
import { updateDoc } from "firebase/firestore";
import Info from "./Info";
import FormGroup from "./FormGroup";
import Tooltip from "./Tooltip";
import { formatCurrency, formatSimpleCurrency } from "./format";

const SpendingContext = createContext();

function InputForm({data}) {
  const [spending, setSpending, authState] = useContext(SpendingContext);

  function onSubmit(e) {
    e.preventDefault();
    setSpending(values => ({...values, updated: false}));
    updateDoc(authState.docRef, {
      spending_age50OrOlder: spending.age50OrOlder,
      spending_annualIncome: spending.annualIncome,
      spending_monthlyEssentialExpenses: spending.monthlyEssentialExpenses,
      spending_emergencyFund: spending.emergencyFund,
      spending_debt: spending.debt,
      spending_contributionsThisYear: spending.contributionsThisYear,
      spending_company401kMatch: spending.company401kMatch,
      spending_iraContributionsThisYear: spending.iraContributionsThisYear
    }).then(() => {
      setSpending(values => ({...values, updated: true}));
    }).catch(error => console.log(error));
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormGroup state={spending} setState={setSpending} id="age50OrOlder" label="Age 50 or Older?" type="checkbox" tooltipTitle={"The 401(k) contribution limit is " + formatSimpleCurrency(data.company401kContributionLimitUnder50) + " (" + formatSimpleCurrency(data.company401kContributionLimit50OrOlder) + " if age 50 or older). The IRA contribution limit is " + formatSimpleCurrency(data.iraContributionLimitUnder50) + " (" + formatSimpleCurrency(data.iraContributionLimit50OrOlder) + " if age 50 or older)"} />
      <FormGroup state={spending} setState={setSpending} id="annualIncome" label="Annual Income:" type="dollars" min={0} max={1000000000000} />
      <FormGroup state={spending} setState={setSpending} id="monthlyEssentialExpenses" label="Monthly Essential Expenses:" tooltipTitle="Rent, utilities, food, insurance, minimum payments, etc." type="dollars" min={0} max={1000000000000} />
      <FormGroup state={spending} setState={setSpending} id="emergencyFund" label="Emergency Fund:" type="dollars" min={0} max={1000000000000} />
      <FormGroup state={spending} setState={setSpending} id="debt" label="Debt:" type="dollars" min={0} max={1000000000000} />
      <FormGroup state={spending} setState={setSpending} id="contributionsThisYear" label="401(k) Contributions This Year:" type="dollars" min={0} max={spending.age50OrOlder ? data.company401kContributionLimit50OrOlder : data.company401kContributionLimitUnder50} />
      <FormGroup state={spending} setState={setSpending} id="company401kMatch" label="Company 401(k) % Match:" tooltipTitle="The percentage of gross income that the employer matches up to. Enter 0 if your company does not match 401(k) contributions" type="percent" min={0} max={100} />
      <FormGroup state={spending} setState={setSpending} id="iraContributionsThisYear" label="IRA Contributions This Year:" tooltipTitle="Roth and Traditional combined" type="dollars" min={0} max={spending.age50OrOlder ? data.iraContributionLimit50OrOlder : data.iraContributionLimitUnder50} />
      {authState.docDataInitialized && spending.updated && <Button type="submit" variant="primary" className="float-end">Save</Button>}
    </Form>
  );
}

function Step({id, variant, next, tooltipTitle}) {
  const spending = useContext(SpendingContext)[0];

  return (
    <Collapse in={spending[id + "Show"]}>
      <div>
        <Alert variant={variant}>
          {next && <i className="material-icons md-16 fs-6">subdirectory_arrow_right</i>}
          {spending[id]}
          {tooltipTitle && <Tooltip id={id} title={tooltipTitle} />}
        </Alert>
      </div>
    </Collapse>
  );
}

function Steps() {
  return (
    <>
      <Step id="essentialExpensesStep" variant="success" />
      <Step id="emergencyFundStep" variant="info" next={true} />
      <Step id="company401kMatchStep" variant="warning" next={true} />
      <Step id="debtStep" variant="danger" next={true} />
      <Step id="iraStep" variant="success" next={true} tooltipTitle="Use a Roth IRA if you expect your tax rate to be the same or higher in retirement. Use a Traditional IRA if you expect it to be lower" />
      <Step id="company401kStep" variant="warning" next={true} />
      <Step id="cashStep" variant="info" next={true} tooltipTitle="Use a savings account for short-term goals (< 5 years) and an investment account for long-term goals (> 10 years)" />
    </>
  );
}

function Content({data}) {
  return (
    <Row>
      <Col md={3}>
        <InputForm data={data} />
      </Col>
      <Col md={9}>
        <Steps />
      </Col>
    </Row>
  );
}

function Spending({authState, data}) {
  const [spending, setSpending] = useState({
    age50OrOlder: false,
    annualIncome: 50000,
    monthlyEssentialExpenses: 1000,
    emergencyFund: 0,
    debt: 1000,
    contributionsThisYear: 0,
    company401kMatch: 5,
    iraContributionsThisYear: 0,
    essentialExpensesStep: <>Pay <strong>essential expenses</strong> and try to <strong>reduce</strong> them.</>
  });

  useEffect(() => {
    if (authState.docDataInitialized) {
      const docData = authState.docData;
      setSpending(values => ({
        ...values,
        age50OrOlder: docData.spending_age50OrOlder,
        annualIncome: docData.spending_annualIncome,
        monthlyEssentialExpenses: docData.spending_monthlyEssentialExpenses,
        emergencyFund: docData.spending_emergencyFund,
        debt: docData.spending_debt,
        contributionsThisYear: docData.spending_contributionsThisYear,
        company401kMatch: docData.spending_company401kMatch,
        iraContributionsThisYear: docData.spending_iraContributionsThisYear,
        updated: true
      }));
    }
  }, [authState.docDataInitialized, authState.docData]);

  useEffect(() => {
    let cash = spending.annualIncome - spending.monthlyEssentialExpenses * 12;
    cash = Math.max(0, cash);

		const idealEmergencyFund = spending.monthlyEssentialExpenses * 6;
    const emergencyFundTopOff = Math.max(0, idealEmergencyFund - spending.emergencyFund);
    const emergencyFundContributions = Math.min(cash, emergencyFundTopOff);
		cash -= emergencyFundContributions;

    const company401kContributionLimit = spending.age50OrOlder ? data.company401kContributionLimit50OrOlder : data.company401kContributionLimitUnder50;
		const company401kMatch = Math.min(company401kContributionLimit, spending.annualIncome * (spending.company401kMatch / 100));
    const company401kMatchTopOff = Math.max(0, company401kMatch - spending.contributionsThisYear);
    const company401kMatchContributions = Math.min(cash, company401kMatchTopOff);
		cash -= company401kMatchContributions;
    const totalCompany401kContributions = spending.contributionsThisYear + company401kMatchContributions;

		const debt = Math.max(0, spending.debt);
    const debtContributions = Math.min(cash, debt);
		cash -= debtContributions;

		const iraContributionLimit = spending.age50OrOlder ? data.iraContributionLimit50OrOlder : data.iraContributionLimitUnder50;
    const iraTopOff = Math.max(0, iraContributionLimit - spending.iraContributionsThisYear);
    const iraContributions = Math.min(cash, iraTopOff);
		cash -= iraContributions;

    const company401kTopOff = Math.max(0, company401kContributionLimit - totalCompany401kContributions);
    const company401kContributions = Math.min(cash, company401kTopOff);
		cash -= company401kContributions;

    const emergencyFundStep = <>Contribute <strong>{formatCurrency(emergencyFundContributions)}</strong> to your <strong>emergency fund</strong>.</>;
    const company401kMatchStep = <>Contribute <strong>{formatCurrency(company401kMatchContributions)}</strong> to your <strong>401(k)</strong> for your <strong>company match</strong>.</>;
    const debtStep = <>Pay off <strong>{formatCurrency(debtContributions)}</strong> of your <strong>debt</strong>, starting with the <strong>highest interest</strong> loans.</>;
    const iraStep = <>Contribute <strong>{formatCurrency(iraContributions)}</strong> to your <strong>Roth or Traditional IRA</strong>.</>;
    const company401kStep = <>Contribute <strong>{formatCurrency(company401kContributions)}</strong> to your <strong>401(k)</strong>.</>;
    const cashStep = <>Contribute the remaining <strong>{formatCurrency(cash)}</strong> to your <strong>savings and/or investment accounts</strong>.</>;
    setSpending(values => ({
      ...values,
      essentialExpensesStepShow: spending.monthlyEssentialExpenses > 0,
      emergencyFundStepShow: emergencyFundContributions > 0,
      company401kMatchStepShow: company401kMatchContributions > 0,
      debtStepShow: debtContributions > 0,
      iraStepShow: iraContributions > 0,
      company401kStepShow: company401kContributions > 0,
      cashStepShow: cash > 0,
      emergencyFundStep: emergencyFundStep,
      company401kMatchStep: company401kMatchStep,
      debtStep: debtStep,
      iraStep: iraStep,
      company401kStep: company401kStep,
      cashStep: cashStep
    }));
  }, [spending.age50OrOlder, spending.annualIncome, spending.monthlyEssentialExpenses, spending.emergencyFund, spending.debt, spending.contributionsThisYear, spending.company401kMatch, spending.iraContributionsThisYear, data.company401kContributionLimitUnder50, data.company401kContributionLimit50OrOlder, data.iraContributionLimitUnder50, data.iraContributionLimit50OrOlder]);

  return (
    <SpendingContext.Provider value={[spending, setSpending, authState]}>
      <Tab.Pane eventKey="spending">
        <Info variant="info" info={
          <>
            You can spend your income in a way that benefits you in the long run by focusing on the more important priorities first.
            Those are the ones that would give you the maximum benefits for your money, such as building up an ample emergency fund (6 months of expenses), taking advantage of free money such as a company 401(k) match, minimizing interest payments by eliminating high-interest debt, and contributing to tax-deferred retirement accounts before contributing to taxable ones.
            Based on the flowchart from <Alert.Link href="https://www.reddit.com/r/personalfinance/comments/4gdlu9/how_to_prioritize_spending_your_money_a_flowchart/">Reddit</Alert.Link>.
          </>
        } />
        <Content data={data} />
      </Tab.Pane>
    </SpendingContext.Provider>
  );
}

export default Spending;