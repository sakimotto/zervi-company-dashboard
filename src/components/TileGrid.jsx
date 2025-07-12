import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, ExternalLink, Edit, Trash2, GripVertical } from 'lucide-react'

const defaultTiles = [
  {
    id: '1',
    title: 'OneDrive',
    url: 'https://onedrive.live.com',
    icon: '📁',
    description: 'Access shared files and folders'
  },
  {
    id: '2',
    title: 'Odoo ERP',
    url: 'https://demo.odoo.com',
    icon: '📊',
    description: 'Sales, inventory, and timesheets'
  },
  {
    id: '3',
    title: 'Adobe Creative Cloud',
    url: 'https://creativecloud.adobe.com',
    icon: '🎨',
    description: 'Design tools and shared libraries'
  },
  {
    id: '4',
    title: 'AutoCAD Web',
    url: 'https://web.autocad.com',
    icon: '📐',
    description: 'View and edit CAD files'
  },
  {
    id: '5',
    title: 'Razorback 4×4 Admin',
    url: 'https://razorback4x4.myshopify.com/admin',
    icon: '🛒',
    description: 'Shopify store management'
  }
]

function TileGrid({ isAdmin }) {
  const [tiles, setTiles] = useState(defaultTiles)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTile, setEditingTile] = useState(null)
  const [newTile, setNewTile] = useState({
    title: '',
    url: '',
    icon: '🔗',
    description: ''
  })

  useEffect(() => {
    // Load tiles from API
    fetchTiles()
  }, [])

  const fetchTiles = async () => {
    try {
      const response = await fetch('/api/tiles')
      if (response.ok) {
        const data = await response.json()
        setTiles(data.length > 0 ? data : defaultTiles)
      }
    } catch (error) {
      console.error('Error fetching tiles:', error)
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(tiles)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTiles(items)
    
    // Save order to API if admin
    if (isAdmin) {
      saveTileOrder(items)
    }
  }

  const saveTileOrder = async (orderedTiles) => {
    try {
      await fetch('/api/tiles/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tiles: orderedTiles }),
      })
    } catch (error) {
      console.error('Error saving tile order:', error)
    }
  }

  const handleAddTile = async () => {
    if (!newTile.title || !newTile.url) return

    const tile = {
      ...newTile,
      id: Date.now().toString(),
    }

    try {
      const response = await fetch('/api/tiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tile),
      })

      if (response.ok) {
        const savedTile = await response.json()
        setTiles([...tiles, savedTile])
        setNewTile({ title: '', url: '', icon: '🔗', description: '' })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error('Error adding tile:', error)
    }
  }

  const handleEditTile = async () => {
    if (!editingTile) return

    try {
      const response = await fetch(`/api/tiles/${editingTile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTile),
      })

      if (response.ok) {
        const updatedTile = await response.json()
        setTiles(tiles.map(tile => tile.id === updatedTile.id ? updatedTile : tile))
        setEditingTile(null)
      }
    } catch (error) {
      console.error('Error updating tile:', error)
    }
  }

  const handleDeleteTile = async (tileId) => {
    try {
      const response = await fetch(`/api/tiles/${tileId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTiles(tiles.filter(tile => tile.id !== tileId))
      }
    } catch (error) {
      console.error('Error deleting tile:', error)
    }
  }

  const iconOptions = ['🔗', '📁', '📊', '🎨', '📐', '🛒', '💼', '📧', '📱', '🌐', '⚙️', '📈']

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quick Access</h2>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Tile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tile</DialogTitle>
                <DialogDescription>
                  Create a new quick access tile for the dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTile.title}
                    onChange={(e) => setNewTile({ ...newTile, title: e.target.value })}
                    placeholder="Enter tile title"
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newTile.url}
                    onChange={(e) => setNewTile({ ...newTile, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={newTile.icon} onValueChange={(value) => setNewTile({ ...newTile, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon} {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTile.description}
                    onChange={(e) => setNewTile({ ...newTile, description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>
                <Button onClick={handleAddTile} className="w-full">
                  Add Tile
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tiles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {tiles.map((tile, index) => (
                <Draggable key={tile.id} draggableId={tile.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        snapshot.isDragging ? 'shadow-xl rotate-2' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1"
                            onClick={() => window.open(tile.url, '_blank')}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{tile.icon}</span>
                              <div>
                                <h3 className="font-medium">{tile.title}</h3>
                                <p className="text-sm text-muted-foreground">{tile.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {isAdmin && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingTile(tile)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTile(tile.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(tile.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Dialog */}
      {editingTile && (
        <Dialog open={!!editingTile} onOpenChange={() => setEditingTile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tile</DialogTitle>
              <DialogDescription>
                Update the tile information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTile.title}
                  onChange={(e) => setEditingTile({ ...editingTile, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={editingTile.url}
                  onChange={(e) => setEditingTile({ ...editingTile, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select value={editingTile.icon} onValueChange={(value) => setEditingTile({ ...editingTile, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon} {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingTile.description}
                  onChange={(e) => setEditingTile({ ...editingTile, description: e.target.value })}
                />
              </div>
              <Button onClick={handleEditTile} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default TileGrid

