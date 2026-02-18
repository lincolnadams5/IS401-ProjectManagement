import { useState, useEffect } from 'react'

interface Camper {
  id: number
  name: string
  username: string | null
  emoji: string
}

const API_URL = 'http://localhost:3001/api'

export default function CamperRoster() {
  const [campers, setCampers] = useState<Camper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editUsername, setEditUsername] = useState('')

  useEffect(() => {
    fetchCampers()
  }, [])

  const fetchCampers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/users`)
      if (!response.ok) {
        throw new Error('Failed to fetch campers')
      }
      const data = await response.json()
      setCampers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching campers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (camper: Camper) => {
    setEditingId(camper.id)
    setEditUsername(camper.username || '')
  }

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: editUsername.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to update username')
      }

      const updatedCamper = await response.json()
      setCampers(campers.map(c => c.id === id ? updatedCamper : c))
      setEditingId(null)
      setEditUsername('')
    } catch (err) {
      console.error('Error updating username:', err)
      alert('Failed to update username. Please try again.')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditUsername('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading campers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchCampers}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500">
          <h2 className="text-2xl font-semibold text-white">
            Enrolled Campers ({campers.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {campers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No campers enrolled yet.
            </div>
          ) : (
            campers.map((camper) => (
              <div
                key={camper.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                {editingId === camper.id ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{camper.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{camper.name}</p>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          placeholder="Enter username"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(camper.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{camper.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{camper.name}</p>
                        <p className="text-sm text-gray-600">
                          @{camper.username || 'No username set'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(camper)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit Username
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
