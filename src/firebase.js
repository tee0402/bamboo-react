import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbnc_dj-1HpzQqLjQf_FkpwoJDxF6siMM",
  authDomain: "bamboo-b04ef.firebaseapp.com",
  projectId: "bamboo-b04ef",
  storageBucket: "bamboo-b04ef.appspot.com",
  messagingSenderId: "316299522771",
  appId: "1:316299522771:web:11d6cd0f920045e37ada26",
  measurementId: "G-XKLY9B1J0Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function create(docRef) {
  return setDoc(docRef, {
    compounding_currentAge: 25,
    compounding_targetRetirementAge: 65,
    compounding_beginningBalance: 10000,
    compounding_annualSavings: 5000,
    compounding_annualSavingsIncreaseRate: 0,
    compounding_expectedAnnualReturn: 6,
    spending_age50OrOlder: false,
    spending_annualIncome: 50000,
    spending_monthlyEssentialExpenses: 1000,
    spending_emergencyFund: 0,
    spending_debt: 1000,
    spending_contributionsThisYear: 0,
    spending_company401kMatch: 5,
    spending_iraContributionsThisYear: 0,
    saving_savingsRate: 5,
    saving_initialSavings: 0,
    saving_frontLoadAnnualSavings: false,
    saving_expectedAnnualReturn: 5,
    saving_withdrawalRate: 4,
    saving_expensesInRetirement: 100
  });
}

export { auth, db, create };