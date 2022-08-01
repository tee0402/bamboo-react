import { useState, createContext, useContext, useEffect } from "react";
import { Tab, Alert, Row, Col, Button, Collapse, Card, Form } from "react-bootstrap";
import Info from "./Info";
import Tooltip from "./Tooltip";
import FormGroup from "./FormGroup";

const SavingContext = createContext();

function Slider() {
  const [saving, setSaving] = useContext(SavingContext);

  return (
    <Row className="mb-4">
      <Form>
        <Form.Group>
          <Form.Label>
            <h5>Savings Rate<Tooltip id="savingsRate" title="The percentage of annual income that is saved. The current U.S. personal savings rate is 5.4%" /></h5>
            <h1 style={{color: "#99bc20"}}>{saving.savingsRate + "%"}</h1>
          </Form.Label>
          <Form.Range
            name="savingsRate"
            value={saving.savingsRate}
            onChange={e => setSaving(values => ({...values, [e.target.name]: Number(e.target.value)}))}
          />
          <Form.Label className="mt-3">
            <h3>Years to Retirement<Tooltip id="yearsToRetirement" title="Assumes no initial savings, 5% annual returns after inflation, 4% withdrawal rate, and that your expenses remain constant in retirement" /></h3>
            <p style={{color: "#99bc20", fontSize: "6.25rem", lineHeight: "75%"}}>{saving.yearsToRetirement}</p>
          </Form.Label>
        </Form.Group>
      </Form>
    </Row>
  );
}

function AssumptionsForm() {
  const [saving, setSaving] = useContext(SavingContext);

  return (
    <Card className="p-2">
      <Form>
        <FormGroup state={saving} setState={setSaving} id="initialSavings" label="Initial Savings:" tooltipTitle="As a percentage of current annual savings" type="percent" />
        <FormGroup state={saving} setState={setSaving} id="frontLoadAnnualSavings" label="Front-Load Annual Savings?" tooltipTitle="Put annual savings into accounts at the beginning of the year instead of the end of the year" type="checkbox" />
        <FormGroup state={saving} setState={setSaving} id="expectedAnnualReturn" label="Expected Annual Return:" tooltipTitle="This assumes that you invest all your savings. The annualized inflation-adjusted total returns of the S&P 500 since 1926 is about 7%" type="percent" />
        <FormGroup state={saving} setState={setSaving} id="withdrawalRate" label="Withdrawal Rate:" type="percent" min={0} />
        <FormGroup state={saving} setState={setSaving} id="expensesInRetirement" label="Expenses in Retirement:" tooltipTitle="As a percentage of current annual expenses" type="percent" min={0} />
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
          <Slider />
          <Assumptions />
        </Row>
      </Tab.Pane>
    </SavingContext.Provider>
  );
}

export default Saving;