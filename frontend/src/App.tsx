import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Borrowers from './pages/Borrowers'
import BorrowerDetails from './pages/BorrowerDetails'
import CreateBorrower from './pages/CreateBorrower'
import Loans from './pages/Loans'
import CreateLoan from './pages/CreateLoan'
import Payments from './pages/Payments'
import RecordPayment from './pages/RecordPayment'
import Assistant from './pages/Assistant'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="borrowers" element={<Borrowers />} />
        <Route path="borrowers/new" element={<CreateBorrower />} />
        <Route path="borrowers/:borrowerId" element={<BorrowerDetails />} />
        <Route path="loans" element={<Loans />} />
        <Route path="loans/new" element={<CreateLoan />} />
        <Route path="payments" element={<Payments />} />
        <Route path="payments/new" element={<RecordPayment />} />
        <Route path="assistant" element={<Assistant />} />
      </Route>
    </Routes>
  )
}

export default App
