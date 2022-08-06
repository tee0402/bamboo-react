import { useState, createContext, useContext, useEffect } from "react";
import { Tab, Alert, Row, Col, Button, Collapse, Card, Form } from "react-bootstrap";
import { updateDoc } from "firebase/firestore";
import Info from "./Info";
import Tooltip from "./Tooltip";
import FormGroup from "./FormGroup";

const SavingContext = createContext();

function Slider({data}) {
  const [saving, setSaving,] = useContext(SavingContext);

  return (
    <Row className="mb-4">
      <Form>
        <Form.Group>
          <Form.Label>
            <h5 className="mb-1">Savings Rate<Tooltip id="savingsRate" title={"The percentage of annual income that is saved. The current U.S. personal savings rate is " + data.personalSavingRate + "%"} /></h5>
            <h1 style={{color: "#99bc20"}}>{saving.savingsRate + "%"}</h1>
          </Form.Label>
          <Form.Range
            name="savingsRate"
            value={saving.savingsRate}
            onChange={e => setSaving(values => ({...values, [e.target.name]: Number(e.target.value)}))}
          />
          <Form.Label className="mt-3">
            <h3 className="mb-0">Years to Retirement<Tooltip id="yearsToRetirement" title="Assumes no initial savings, 5% annual returns after inflation, 4% withdrawal rate, and that your expenses remain constant in retirement" /></h3>
            <p className="lh-1" style={{color: "#99bc20", fontSize: "6.25rem"}}>{saving.yearsToRetirement}</p>
          </Form.Label>
        </Form.Group>
      </Form>
    </Row>
  );
}

function AssumptionsForm() {
  const [saving, setSaving, authState] = useContext(SavingContext);

  function onSubmit(e) {
    e.preventDefault();
    setSaving(values => ({...values, updated: false}));
    updateDoc(authState.docRef, {
      saving_savingsRate: saving.savingsRate,
      saving_initialSavings: saving.initialSavings,
      saving_frontLoadAnnualSavings: saving.frontLoadAnnualSavings,
      saving_expectedAnnualReturn: saving.expectedAnnualReturn,
      saving_withdrawalRate: saving.withdrawalRate,
      saving_expensesInRetirement: saving.expensesInRetirement
    }).then(() => {
      setSaving(values => ({...values, updated: true}));
    }).catch(error => console.log(error));
  }

  return (
    <Card className="p-2">
      <Form onSubmit={onSubmit}>
        <FormGroup state={saving} setState={setSaving} id="initialSavings" label="Initial Savings:" tooltipTitle="As a percentage of current annual savings" type="percent" min={0} max={1000000000000} />
        <FormGroup state={saving} setState={setSaving} id="frontLoadAnnualSavings" label="Front-Load Annual Savings?" tooltipTitle="Put annual savings into accounts at the beginning of the year instead of the end of the year" type="checkbox" />
        <FormGroup state={saving} setState={setSaving} id="expectedAnnualReturn" label="Expected Annual Return:" tooltipTitle="This assumes that you invest all your savings. The annualized inflation-adjusted total returns of the S&P 500 since 1926 is about 7%" type="percent" min={-100} max={100} />
        <FormGroup state={saving} setState={setSaving} id="withdrawalRate" label="Withdrawal Rate:" type="percent" tooltipTitle="The percentage of your portfolio that you withdraw annually in retirement (will affect the number of years your portfolio (retirement) will last)" min={1} max={10} />
        <FormGroup state={saving} setState={setSaving} id="expensesInRetirement" label="Expenses in Retirement:" tooltipTitle="As a percentage of current annual expenses" type="percent" min={0} max={1000000000000} />
        {authState.docDataInitialized && saving.updated && <Button type="submit" variant="warning" className="float-end">Save</Button>}
      </Form>
    </Card>
  );
}

function Assumptions() {
  const [open, setOpen] = useState(false);

  return (
    <Row>
      <Col md={{span: 4, offset: 4}}>
        <Button variant="warning" onClick={() => setOpen(!open)}>Change Assumptions</Button>
        <Collapse in={open}>
          <Col md={{span: 8, offset: 2}}>
            <AssumptionsForm />
          </Col>
        </Collapse>
      </Col>
    </Row>
  );
}

function Saving({authState, data}) {
  const [saving, setSaving] = useState({
    savingsRate: 5,
    initialSavings: 0,
    frontLoadAnnualSavings: false,
    expectedAnnualReturn: 5,
    withdrawalRate: 4,
    expensesInRetirement: 100
  });

  useEffect(() => {
    if (authState.docDataInitialized) {
      const docData = authState.docData;
      setSaving(values => ({
        ...values,
        savingsRate: docData.saving_savingsRate,
        initialSavings: docData.saving_initialSavings,
        frontLoadAnnualSavings: docData.saving_frontLoadAnnualSavings,
        expectedAnnualReturn: docData.saving_expectedAnnualReturn,
        withdrawalRate: docData.saving_withdrawalRate,
        expensesInRetirement: docData.saving_expensesInRetirement,
        updated: true
      }));
    }
  }, [authState.docDataInitialized, authState.docData]);

  useEffect(() => {
    let yearsToRetirement = "Infinite";
		if (saving.savingsRate > 0) {
			const savings = saving.savingsRate;
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
        if (yearsToRetirement > 1000) {
          yearsToRetirement = ">1000";
          break;
        }
			}
		}
    setSaving(values => ({...values, yearsToRetirement: yearsToRetirement}));
  }, [saving.savingsRate, saving.initialSavings, saving.frontLoadAnnualSavings, saving.expectedAnnualReturn, saving.withdrawalRate, saving.expensesInRetirement]);

  return (
    <SavingContext.Provider value={[saving, setSaving, authState]}>
      <Tab.Pane eventKey="saving">
        <Info variant="warning" info={
          <>
            Your savings rate is the most important factor in determining how early you can retire, not the rate of return on your investments.
            This is because increasing your savings rate has a double effect: it increases your retirement savings quicker AND it permanently reduces your expenses, allowing you to retire on less savings.
            Notice the dramatic decrease in the years to retirement when a low savings rate is increased.
            Based on the article from <Alert.Link href="http://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/">Mr. Money Mustache</Alert.Link>.
          </>
        } />
        <Row className="text-center">
          <Slider data={data} />
          <Assumptions />
        </Row>
      </Tab.Pane>
    </SavingContext.Provider>
  );
}

export default Saving;