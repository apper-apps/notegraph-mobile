import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const GraphVisualization = ({ notes = [], onNodeClick, className = "" }) => {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Generate nodes and connections
  const generateGraph = () => {
    const nodes = notes.map((note, index) => {
      const angle = (index / notes.length) * 2 * Math.PI
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      return {
        id: note.Id,
        title: note.title,
        type: note.type,
        tags: note.tags || [],
        completed: note.completed,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        radius: 20 + (note.tags?.length || 0) * 5
      }
    })

    const connections = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i]
        const nodeB = nodes[j]
        const sharedTags = nodeA.tags.filter(tag => nodeB.tags.includes(tag))
        
        if (sharedTags.length > 0) {
          connections.push({
            from: nodeA.id,
            to: nodeB.id,
            strength: sharedTags.length,
            tags: sharedTags
          })
        }
      }
    }

    return { nodes, connections }
  }

  const { nodes, connections } = generateGraph()

  const handleNodeClick = (node) => {
    setSelectedNode(node.id)
    onNodeClick?.(notes.find(n => n.Id === node.id))
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3))
  }

  const handleReset = () => {
    setZoomLevel(1)
    setSelectedNode(null)
  }

  return (
    <div className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          icon="ZoomIn"
          onClick={handleZoomIn}
        />
        <Button
          variant="secondary"
          size="sm"
          icon="ZoomOut"
          onClick={handleZoomOut}
        />
        <Button
          variant="secondary"
          size="sm"
          icon="RotateCcw"
          onClick={handleReset}
        />
      </div>

      {/* Graph Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full min-h-[500px] graph-paper relative overflow-hidden cursor-move"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0"
        >
          {/* Connections */}
          {connections.map((connection, index) => {
            const fromNode = nodes.find(n => n.id === connection.from)
            const toNode = nodes.find(n => n.id === connection.to)
            
            if (!fromNode || !toNode) return null

            const isHighlighted = selectedNode === connection.from || selectedNode === connection.to

            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? '#5B4FCF' : '#E5E7EB'}
                  strokeWidth={connection.strength * 2}
                  strokeOpacity={isHighlighted ? 0.8 : 0.4}
                  className="graph-connection"
                />
                
                {/* Connection label */}
                {isHighlighted && (
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2}
                    textAnchor="middle"
                    className="text-xs fill-primary-600 font-medium"
                  >
                    {connection.tags.slice(0, 2).join(', ')}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id
            const nodeColor = node.type === 'task' 
              ? (node.completed ? '#10B981' : '#F59E0B')
              : '#5B4FCF'

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={nodeColor}
                  fillOpacity={isSelected ? 0.9 : 0.7}
                  stroke={isSelected ? '#1F2937' : '#FFFFFF'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="graph-node cursor-pointer"
                  onClick={() => handleNodeClick(node)}
                />
                
                {/* Node icon */}
                <foreignObject
                  x={node.x - 10}
                  y={node.y - 10}
                  width={20}
                  height={20}
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <ApperIcon
                      name={node.type === 'task' ? 'CheckSquare' : 'FileText'}
                      size={16}
                      className="text-white"
                    />
                  </div>
                </foreignObject>

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + node.radius + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium max-w-20 truncate"
                >
                  {node.title.length > 15 ? `${node.title.substring(0, 15)}...` : node.title}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <span>Notes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
            <span>Tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-gray-400"></div>
            <span>Shared tags</span>
          </div>
        </div>
      </div>

      {/* Node Info Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-white rounded-lg border border-gray-200 p-4 shadow-lg max-w-xs"
        >
          {(() => {
            const node = nodes.find(n => n.id === selectedNode)
            const note = notes.find(n => n.Id === selectedNode)
            
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 font-display">{node?.title}</h4>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ApperIcon name="X" size={14} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon
                    name={node?.type === 'task' ? 'CheckSquare' : 'FileText'}
                    size={14}
                  />
                  <span className="capitalize">{node?.type}</span>
                  {node?.type === 'task' && node?.completed && (
                    <span className="text-green-600">• Completed</span>
                  )}
                </div>

                {node?.tags && node.tags.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {node.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Connected to {connections.filter(c => c.from === selectedNode || c.to === selectedNode).length} items
                  </p>
                </div>
              </div>
            )
          })()}
        </motion.div>
      )}

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Network" className="w-8 h-8 text-primary-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                No connections yet
              </h3>
              <p className="text-gray-600 max-w-md">
                Create notes and tasks with shared tags to see connections in the graph view.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphVisualization