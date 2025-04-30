import { useRef, useState, useEffect } from 'react'
import './map.css'

const CELL_SIZE = 5
const WIDTH = 280
const HEIGHT = 200

function Map() {
  const canvasRef = useRef(null)

  const [occupiedZones, setOccupiedZones] = useState([
    { x: 10, y: 10, w: 5, h: 4 },
    { x: 50, y: 70, w: 6, h: 3 },
  ])

  const [isSelecting, setIsSelecting] = useState(false)
  const [isBuyMode, setIsBuyMode] = useState(false)
  const [selectionRect, setSelectionRect] = useState(null)

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const panStart = useRef(null)
  const selectStart = useRef(null)

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)
  
    // Тёмный фон
    ctx.fillStyle = '#424242'
    ctx.fillRect(0, 0, ctx.canvas.width / zoom, ctx.canvas.height / zoom)
  
    // Светлая область — рабочая зона
    ctx.fillStyle = '#f2f2f2'
    ctx.fillRect(0, 0, WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE)
  
    for (const zone of occupiedZones) {
      ctx.fillStyle = 'green'
      ctx.fillRect(zone.x * CELL_SIZE, zone.y * CELL_SIZE, zone.w * CELL_SIZE, zone.h * CELL_SIZE)
    }
  
    if (selectionRect) {
      const { x, y, w, h } = selectionRect
      ctx.fillStyle = 'rgba(0, 120, 255, 0.3)'
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, w * CELL_SIZE, h * CELL_SIZE)
      ctx.strokeStyle = 'blue'
      ctx.lineWidth = 1
      ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, w * CELL_SIZE, h * CELL_SIZE)
    }
  
    ctx.restore()
  }
  

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    draw(ctx)
  }, [occupiedZones, offset, zoom, selectionRect])

  const screenToGrid = (x, y) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const sx = (x - rect.left - offset.x) / zoom
    const sy = (y - rect.top - offset.y) / zoom
    return {
      x: Math.floor(sx / CELL_SIZE),
      y: Math.floor(sy / CELL_SIZE),
    }
  }

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      panStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    } else if (e.button === 0 && isBuyMode) {
      const { x, y } = screenToGrid(e.clientX, e.clientY)
      selectStart.current = { x, y }
      setIsSelecting(true)
    }
  }

  const handleMouseMove = (e) => {
    if (panStart.current) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy })
    } else if (isSelecting && selectStart.current) {
      const { x: x0, y: y0 } = selectStart.current
      const { x: x1, y: y1 } = screenToGrid(e.clientX, e.clientY)
      const x = Math.min(x0, x1)
      const y = Math.min(y0, y1)
      const w = Math.abs(x1 - x0) + 1
      const h = Math.abs(y1 - y0) + 1
      setSelectionRect({ x, y, w, h })
    }
  }

  const handleMouseUp = () => {
    panStart.current = null
    if (isSelecting) {
      setIsSelecting(false)
    }
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    setZoom(z => Math.max(0.3, Math.min(3, z * factor)))
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
  }

  const handleBuyClick = () => {
    setIsBuyMode(true)
    setSelectionRect(null)
  }

  const handlePay = () => {
    if (selectionRect) {
      setOccupiedZones(prev => [...prev, selectionRect])
      setSelectionRect(null)
      setIsBuyMode(false)
    }
  }

  return (
    <div className='canvas__container'>
      <canvas
        ref={canvasRef}
        width={WIDTH * CELL_SIZE}
        height={HEIGHT * CELL_SIZE}
        style={{ cursor: isBuyMode ? 'crosshair' : 'default', maxHeight: '100vh' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
        className='canvas'
      />
      <div style={{ marginTop: 10 }}>
        {!isBuyMode && (
          <button className='canvas_buy__button' onClick={handleBuyClick}>Buy land</button>
        )}
        {isBuyMode && (
          <button className='canvas_buy__button'  onClick={handlePay} disabled={!selectionRect}>
            Pay
          </button>
        )}
      </div>
    </div>
  )
}

export default Map
