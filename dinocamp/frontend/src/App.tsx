import { useState, useEffect } from 'react'
import CamperRoster from './components/CamperRoster'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🦕 Dino Camp Roster
        </h1>
        <CamperRoster />
      </div>
    </div>
  )
}

export default App
