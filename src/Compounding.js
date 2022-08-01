import { useState, createContext, useContext, useEffect } from "react";
import { Tab, Row, Col, Form, Alert, Card, Collapse, Table } from "react-bootstrap";
import Info from "./Info";
import FormGroup from "./FormGroup";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import formatCurrency from "./formatCurrency";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const CompoundingContext = createContext();

function InputForm() {
  const [compounding, setCompounding] = useContext(CompoundingContext);

  return (
    <Form>
      <FormGroup state={compounding} setState={setCompounding} id="currentAge" label="Current Age:" type="years" min={0} max={compounding.targetRetirementAge} />
      <FormGroup state={compounding} setState={setCompounding} id="targetRetirementAge" label="Target Retirement Age:" type="years" min={compounding.currentAge} />
      <FormGroup state={compounding} setState={setCompounding} id="beginningBalance" label="Beginning Balance:" type="dollars" />
      <FormGroup state={compounding} setState={setCompounding} id="annualSavings" label="Annual Savings:" type="dollars" />
      <FormGroup state={compounding} setState={setCompounding} id="annualSavingsIncreaseRate" label="Annual Savings Increase Rate:" type="percent" tooltipTitle="The percentage increase in your savings amount per year" />
      <FormGroup state={compounding} setState={setCompounding} id="expectedAnnualReturn" label="Expected Annual Return:" type="percent" tooltipTitle="This assumes that you invest all your savings. The annualized inflation-adjusted total returns of the S&P 500 since 1926 is about 7%" />
      <Alert variant="success">
        <small>Your ending balance at {compounding.targetRetirementAge} is <strong>{compounding.endingBalance}</strong>.<br />
        The annual interest is <strong>{compounding.annualInterest}</strong>.</small>
      </Alert>
    </Form>
  );
}

function LineChart() {
  const compounding = useContext(CompoundingContext)[0];

  return (
    <Line
      data={{
        labels: compounding.chartLabels,
        datasets: [
          {
            data: compounding.chartData,
            borderWidth: 4,
            borderColor: "#99bc20",
            backgroundColor: "#99bc20",
            fill: false
          }
        ]
      }}
      options={{
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Age"
            }
          },
          y: {
            title: {
              display: true,
              text: "Savings ($)"
            }
          }
        },
        elements: {
          point: {
            hitRadius: 15
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Expected Growth of Savings",
            font: {
              size: 30
            }
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: (context) => "Age " + context[0].label,
              label: (context) => formatCurrency(context.parsed.y)
            }
          }
        }
      }}
    />
  );
}

function Content() {
  return (
    <Row>
      <Col md={3}>
        <InputForm />
      </Col>
      <Col md={9}>
        <LineChart />
      </Col>
    </Row>
  );
}

function TableRow({age, beginningBalance, interest, savings, endingBalance}) {
  return (
    <tr>
      <td>{age}</td>
      <td>{beginningBalance}</td>
      <td>{interest}</td>
      <td>{savings}</td>
      <td>{endingBalance}</td>
    </tr>
  );
}

function CalculationsTable() {
  const compounding = useContext(CompoundingContext)[0];

  return (
    <Table striped bordered hover responsive size="sm">
      <thead>
        <tr>
          <th>Age</th>
          <th>Beginning Balance</th>
          <th>Interest</th>
          <th>Savings</th>
          <th>Ending Balance</th>
        </tr>
      </thead>
      <tbody>
        {compounding.tableData.map(row => (
          <TableRow key={row.age} {...row} />
        ))}
      </tbody>
    </Table>
  );
}

function Calculations() {
  const [show, setShow] = useState(false);

  return (
    <Card bg="light" text="dark">
      <Card.Header className="bg-success bg-opacity-25 text-center text-decoration-underline" style={{cursor: "pointer"}} onClick={() => setShow(!show)}>{(show ? "Hide" : "Show") + " Calculations"}</Card.Header>
      <Collapse in={show}>
        <Card.Body>
          <Col md={{span: 6, offset: 3}}>
            <CalculationsTable />
          </Col>
        </Card.Body>
      </Collapse>
    </Card>
  );
}

function Compounding() {
  const [compounding, setCompounding] = useState({
    currentAge: 25,
    targetRetirementAge: 65,
    beginningBalance: 10000,
    annualSavings: 5000,
    annualSavingsIncreaseRate: 0,
    expectedAnnualReturn: 6,
    tableData: []
  });

  useEffect(() => {
    const chartLabels = [];
		const chartData = [];
		const tableData = [];
		let beginningBalance = compounding.beginningBalance;
		let annualSavings = compounding.annualSavings;
		const expectedAnnualReturn = compounding.expectedAnnualReturn / 100;
		for (let age = compounding.currentAge; age <= compounding.targetRetirementAge; age++) {
			const interest = beginningBalance * expectedAnnualReturn;
			const endingBalance = beginningBalance + interest + annualSavings;
			chartLabels.push(age);
			chartData.push(beginningBalance.toFixed(2));
			tableData.push({
				age: age,
				beginningBalance: formatCurrency(beginningBalance),
				interest: formatCurrency(interest),
				savings: formatCurrency(annualSavings),
				endingBalance: formatCurrency(endingBalance)
			});
			beginningBalance = endingBalance;
			annualSavings *= 1 + compounding.annualSavingsIncreaseRate / 100;
		}
		if (tableData.length > 0) {
			const lastRow = tableData[tableData.length - 1];
      setCompounding(values => ({...values, endingBalance: lastRow.beginningBalance, annualInterest: lastRow.interest}));
		}
		setCompounding(values => ({...values, chartLabels: chartLabels, chartData: chartData, tableData: tableData}));
  }, [compounding.currentAge, compounding.targetRetirementAge, compounding.beginningBalance, compounding.annualSavings, compounding.annualSavingsIncreaseRate, compounding.expectedAnnualReturn]);

  return (
    <CompoundingContext.Provider value={[compounding, setCompounding]}>
      <Tab.Pane eventKey="compounding">
        <Info variant="success" info={
          <>
            Over the years, the power of compound interest can turn your savings and investments into a sizable nest egg.
            The length of time that you stay invested is extremely important.
            Contrary to some beliefs, decreasing that period by a year results in the loss of the potential gains in the last compounding year, not the first.
            This takes a big chunk out of the balance because the compounding periods at the end are the most valuable.
            You can test this in the utility below.
          </>
        } />
        <Content />
        <br />
        <Calculations />
      </Tab.Pane>
    </CompoundingContext.Provider>
  );
}

export default Compounding;