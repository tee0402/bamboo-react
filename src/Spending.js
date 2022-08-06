import { useState, createContext, useContext, useEffect } from "react";
import { Tab, Alert, Row, Col, Form, Button, Collapse } from "react-bootstrap";
import { getDoc, updateDoc } from "firebase/firestore";
import Info from "./Info";
import FormGroup from "./FormGroup";
import Tooltip from "./Tooltip";
import formatCurrency from "./formatCurrency";

const SpendingContext = createContext();

function InputForm() {
  const [spending, setSpending, authState] = useContext(SpendingContext);

  function onSubmit(e) {
    e.preventDefault();
    setSpending(values => ({...values, initializedIfLoggedIn: false}));
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
      setSpending(values => ({...values, initializedIfLoggedIn: true}));
    }).catch(error => console.log(error));
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormGroup state={spending} setState={setSpending} id="age50OrOlder" label="Age 50 or Older?" type="checkbox" />
      <FormGroup state={spending} setState={setSpending} id="annualIncome" label="Annual Income:" type="dollars" min={0} />
      <FormGroup state={spending} setState={setSpending} id="monthlyEssentialExpenses" label="Monthly Essential Expenses:" tooltipTitle="Rent, utilities, food, insurance, minimum payments, etc." type="dollars" min={0} />
      <FormGroup state={spending} setState={setSpending} id="emergencyFund" label="Emergency Fund:" type="dollars" min={0} />
      <FormGroup state={spending} setState={setSpending} id="debt" label="Debt:" type="dollars" min={0} />
      <FormGroup state={spending} setState={setSpending} id="contributionsThisYear" label="401(k) Contributions This Year:" type="dollars" min={0} />
      <FormGroup state={spending} setState={setSpending} id="company401kMatch" label="Company 401(k) % Match:" tooltipTitle="The percentage of gross income that the employer matches up to. Enter 0 if your company does not match 401(k) contributions" type="percent" min={0} />
      <FormGroup state={spending} setState={setSpending} id="iraContributionsThisYear" label="IRA Contributions This Year:" tooltipTitle="Roth and Traditional combined" type="dollars" min={0} />
      {authState.loggedIn && spending.initializedIfLoggedIn && <Button type="submit" variant="primary" className="float-end">Save</Button>}
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

function Content() {
  return (
    <Row>
      <Col md={3}>
        <InputForm />
      </Col>
      <Col md={9}>
        <Steps />
      </Col>
    </Row>
  );
}

function Spending({authState}) {
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
    if (authState.loggedIn) {
      getDoc(authState.docRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSpending(values => ({
            ...values,
            age50OrOlder: data.spending_age50OrOlder,
            annualIncome: data.spending_annualIncome,
            monthlyEssentialExpenses: data.spending_monthlyEssentialExpenses,
            emergencyFund: data.spending_emergencyFund,
            debt: data.spending_debt,
            contributionsThisYear: data.spending_contributionsThisYear,
            company401kMatch: data.spending_company401kMatch,
            iraContributionsThisYear: data.spending_iraContributionsThisYear,
            initializedIfLoggedIn: true
          }));
        }
      }).catch(error => console.log(error));
    } else {
      setSpending(values => ({
        ...values,
        initializedIfLoggedIn: false
      }));
    }
  }, [authState.loggedIn, authState.docRef]);

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

    const emergencyFundStep = <>Contribute <strong>{formatCurrency(emergencyFundContributions)}</strong> to your <strong>emergency fund</strong>.</>;
    const company401kMatchStep = <>Contribute <strong>{formatCurrency(company401kMatchContributions)}</strong> to your <strong>401(k)</strong> for your <strong>company match</strong>.</>;
    const debtStep = <>Pay off <strong>{formatCurrency(debtContributions)}</strong> of your <strong>debt</strong>, starting with the <strong>highest interest</strong> loans.</>;
    const iraStep = <>Contribute <strong>{formatCurrency(iraContributions)}</strong> to your <strong>Roth or Traditional IRA</strong>.</>;
    const company401kStep = <>Contribute <strong>{formatCurrency(company401kContributions)}</strong> to your <strong>401(k)</strong>.</>;
    const cashStep = <>Contribute the remaining <strong>{formatCurrency(cash)}</strong> to your <strong>savings and/or investment accounts</strong>.</>;
    setSpending(values => ({...values,
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
  }, [spending.age50OrOlder, spending.annualIncome, spending.monthlyEssentialExpenses, spending.emergencyFund, spending.debt, spending.contributionsThisYear, spending.company401kMatch, spending.iraContributionsThisYear]);

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
        <Content />
      </Tab.Pane>
    </SpendingContext.Provider>
  );
}

export default Spending;