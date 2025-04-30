import { useRef, useState, useEffect } from 'react'
import Payment from '../payment/payment'
import './map.css'

const CELL_SIZE = 5
const WIDTH = 280
const HEIGHT = 200
const MIN_ZOOM = 0.6
const MAX_ZOOM = 1.4
const ZOOM_STEP = 0.2

function Map() {
  const canvasRef = useRef(null)

  const [plots, setPlots] = useState([
    { id: 1, title: 'Google', x: 10, y: 10, w: 30, h: 20, color: '#34a853' },
    { id: 2, title: 'Nullker', x: 50, y: 50, w: 20, h: 25, color: '#fbbc05' },
  ])

  const [isBuyMode, setIsBuyMode] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
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

    ctx.fillStyle = '#424242'
    ctx.fillRect(0, 0, ctx.canvas.width / zoom, ctx.canvas.height / zoom)

    ctx.fillStyle = '#f2f2f2'
    ctx.fillRect(0, 0, WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE)

    for (const zone of plots) {
      ctx.fillStyle = zone.color || 'green'
      ctx.fillRect(zone.x * CELL_SIZE, zone.y * CELL_SIZE, zone.w * CELL_SIZE, zone.h * CELL_SIZE)

      const centerX = (zone.x + zone.w / 2) * CELL_SIZE
      const centerY = (zone.y + zone.h / 2) * CELL_SIZE
      ctx.fillStyle = 'white'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(zone.title, centerX, centerY)
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
    const ctx = canvasRef.current.getContext('2d')
    draw(ctx)
  }, [plots, offset, zoom, selectionRect])

  const screenToGrid = (x, y) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const sx = (x - rect.left - offset.x) / zoom
    const sy = (y - rect.top - offset.y) / zoom
    return {
      x: Math.floor(sx / CELL_SIZE),
      y: Math.floor(sy / CELL_SIZE),
    }
  }

  const isAreaFree = (x, y, w, h) => {
    for (const p of plots) {
      const intersects =
        x < p.x + p.w &&
        x + w > p.x &&
        y < p.y + p.h &&
        y + h > p.y
      if (intersects) return false
    }
    return true
  }

  const handleMouseDown = (e) => {
    const { x, y } = screenToGrid(e.clientX, e.clientY)
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return

    if (e.button === 0 && isBuyMode && !showPayment) {
      if (!isAreaFree(x, y, 1, 1)) return
      selectStart.current = { x, y }
      setIsSelecting(true)
      setSelectionRect({ x, y, w: 1, h: 1 })
    } else {
      panStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
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

      const x = Math.max(0, Math.min(x0, x1))
      const y = Math.max(0, Math.min(y0, y1))
      const w = Math.min(WIDTH, Math.abs(x1 - x0) + 1, WIDTH - x)
      const h = Math.min(HEIGHT, Math.abs(y1 - y0) + 1, HEIGHT - y)

      if (isAreaFree(x, y, w, h)) {
        setSelectionRect({ x, y, w, h })
      } else {
        setSelectionRect(null)
      }
    }
  }

  const handleMouseUp = () => {
    panStart.current = null
    if (isSelecting) {
      setIsSelecting(false)
      if (selectionRect) {
        setShowPayment(true)
        setIsBuyMode(false)
      }
    }
  }

  const handleWheel = (e) => {
    e.preventDefault()
    setZoom(z => {
      let newZoom = z + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom))
    })
  }

  const handleContextMenu = (e) => e.preventDefault()

  const confirmPayment = (sponsorName) => {
    if (selectionRect) {
      const newPlot = {
        id: plots.length + 1,
        title: sponsorName,
        color: '#2196f3',
        ...selectionRect,
      }
      setPlots(prev => [...prev, newPlot])
      setSelectionRect(null)
      setShowPayment(false)
    }
  }
  

  const sortedLeaderboard = [...plots]
    .map(p => ({ ...p, area: p.w * p.h }))
    .sort((a, b) => b.area - a.area)

  return (
    <div className="canvas__container">
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
        className="canvas"
      />
      {!isBuyMode && !showPayment && (
        <button className="canvas_buy__button" onClick={() => setIsBuyMode(true)}>
          Buy land
        </button>
      )}
      {showPayment && <Payment onConfirm={confirmPayment} selection={selectionRect} />}
      <div className="leaderboard">
        <h3>Top Sponsors</h3>
        <ol>
          {sortedLeaderboard.map(p => (
            <li key={p.id}>
              #{p.id} – {p.title} – {p.w * p.h} m²
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Map
