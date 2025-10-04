import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout'
import Attendance from './pages/Attendance'
import Employees from './pages/Employees'
import Login from './pages/Login'
import Protected from '@/components/Protected'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>
            <Layout>
              <Dashboard />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/attendance"
        element={
          <Protected>
            <Layout>
              <Attendance />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/employees"
        element={
          <Protected>
            <Layout>
              <Employees />
            </Layout>
          </Protected>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
