import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'

function Placeholder({ title }: { title: string }) {
  return (
    <Layout pageTitle={title}>
      <div />
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Il Caffè" />} />
      <Route path="/lastoria" element={<Placeholder title="La Storia" />} />
      <Route path="/ilgiorno" element={<Placeholder title="Il Giorno" />} />
    </Routes>
  )
}

export default App
