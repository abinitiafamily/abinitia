'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import styles from './arvore.module.css'
import { MOCK_TREE_NODES, MOCK_TREE_EDGES, MOCK_PEOPLE } from '@/lib/mock-data'
import type { TreeNode, Person, EvidenceStatus } from '@/types'

const EVIDENCE_COLORS: Record<EvidenceStatus, string> = {
  CONFIRMED:    '#5A8040',
  REPORTED:     '#C68B2E',
  INFERRED:     '#8B5E1A',
  UNCONFIRMED:  '#4A2C17',
  INVESTIGATING: '#E8A840',
}

const SVG_W = 900
const SVG_H = 700

function getInitials(p: Person) {
  return `${p.firstName.charAt(0)}${p.lastName?.charAt(0) ?? ''}`.toUpperCase()
}

interface NodeData extends TreeNode {
  selected?: boolean
}

export default function ArvorePageClient() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<NodeData[]>(MOCK_TREE_NODES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0, px: 0, py: 0 })
  const [showPanel, setShowPanel] = useState(false)
  const [filter, setFilter] = useState<'ALL' | EvidenceStatus>('ALL')

  const selectedPerson = selectedId
    ? nodes.find(n => n.person.id === selectedId)?.person
    : null

  // Convert SVG point from screen space
  function svgPoint(e: React.MouseEvent | MouseEvent) {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const inverse = svg.getScreenCTM()!.inverse()
    return pt.matrixTransform(inverse)
  }

  // Node drag
  function onNodeMouseDown(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation()
    const pt = svgPoint(e)
    const node = nodes.find(n => n.person.id === nodeId)!
    setDragging(nodeId)
    setDragOffset({ x: pt.x - node.x, y: pt.y - node.y })
    setSelectedId(nodeId)
    setShowPanel(true)
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) {
      const pt = svgPoint(e)
      setNodes(prev => prev.map(n =>
        n.person.id === dragging
          ? { ...n, x: pt.x - dragOffset.x, y: pt.y - dragOffset.y }
          : n
      ))
    } else if (isPanning) {
      setPan({ x: panStart.px + e.clientX - panStart.x, y: panStart.py + e.clientY - panStart.y })
    }
  }, [dragging, dragOffset, isPanning, panStart])

  const onMouseUp = useCallback(() => {
    setDragging(null)
    setIsPanning(false)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // Canvas pan
  function onCanvasMouseDown(e: React.MouseEvent) {
    if (e.target === svgRef.current || (e.target as Element).classList.contains('canvas-bg')) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y })
    }
  }

  // Zoom
  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(s => Math.max(0.3, Math.min(2.5, s * delta)))
  }

  // Build edge paths
  function edgePath(fromNode: NodeData, toNode: NodeData, type: string) {
    const mx = (fromNode.x + toNode.x) / 2
    const my = (fromNode.y + toNode.y) / 2
    if (type === 'SPOUSE') {
      return `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`
    }
    return `M ${fromNode.x} ${fromNode.y} C ${fromNode.x} ${my}, ${toNode.x} ${my}, ${toNode.x} ${toNode.y}`
  }

  const filteredNodes = filter === 'ALL'
    ? nodes
    : nodes.filter(n => n.person.evidenceStatus === filter)

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <h1 className={styles.title}>Árvore Genealógica</h1>
          <div className={styles.breadcrumb}>
            <span>Família Ferraro</span>
            <span className={styles.sep}>›</span>
            <span>Árvore</span>
          </div>
        </div>
        <div className={styles.toolbarRight}>
          {/* Filter */}
          <select
            className={`form-select ${styles.filterSelect}`}
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            id="tree-filter"
          >
            <option value="ALL">Todas as pessoas</option>
            <option value="CONFIRMED">Confirmadas</option>
            <option value="REPORTED">Reportadas</option>
            <option value="INFERRED">Inferidas</option>
            <option value="INVESTIGATING">Em investigação</option>
          </select>

          {/* Zoom controls */}
          <div className={styles.zoomControls}>
            <button className={styles.zoomBtn} onClick={() => setScale(s => Math.min(2.5, s + 0.15))} id="zoom-in-btn" aria-label="Ampliar">+</button>
            <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
            <button className={styles.zoomBtn} onClick={() => setScale(s => Math.max(0.3, s - 0.15))} id="zoom-out-btn" aria-label="Reduzir">−</button>
            <button className={styles.zoomBtn} onClick={() => { setScale(1); setPan({ x: 0, y: 0 }) }} id="zoom-fit-btn" title="Ajustar">⊡</button>
          </div>

          <button className="btn btn-primary btn-sm" id="add-person-btn">+ Adicionar pessoa</button>
        </div>
      </div>

      <div className={styles.canvasWrapper}>
        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          className={styles.canvas}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          onMouseDown={onCanvasMouseDown}
          onWheel={onWheel}
          aria-label="Árvore genealógica interativa"
          id="family-tree-svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(198,139,46,0.05)" strokeWidth="0.5"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A2C17"/>
              <stop offset="100%" stopColor="#2d1a08"/>
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect className="canvas-bg" width={SVG_W} height={SVG_H} fill="url(#grid)" />

          {/* Pan + zoom group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>

            {/* Edges */}
            {MOCK_TREE_EDGES.map(edge => {
              const from = nodes.find(n => n.person.id === edge.from)
              const to   = nodes.find(n => n.person.id === edge.to)
              if (!from || !to) return null
              const isSpouse = edge.type === 'SPOUSE'
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edgePath(from, to, edge.type)}
                  fill="none"
                  stroke={isSpouse ? 'rgba(198,139,46,0.5)' : 'rgba(198,139,46,0.3)'}
                  strokeWidth={isSpouse ? 1.5 : 1.5}
                  strokeDasharray={isSpouse ? '6 3' : 'none'}
                  className={styles.edge}
                />
              )
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              const p = node.person
              const isSelected = selectedId === p.id
              const isDragging = dragging === p.id
              const color = EVIDENCE_COLORS[p.evidenceStatus ?? 'UNCONFIRMED']

              return (
                <g
                  key={p.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`${styles.nodeGroup} ${isDragging ? styles.nodeDragging : ''}`}
                  onMouseDown={e => onNodeMouseDown(e, p.id)}
                  role="button"
                  aria-label={`${p.firstName} ${p.lastName ?? ''}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') { setSelectedId(p.id); setShowPanel(true) } }}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <circle r="36" fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 3" className={styles.selectionRing} />
                  )}

                  {/* Main circle */}
                  <circle
                    r="28"
                    fill="url(#nodeGrad)"
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={isSelected ? 'url(#glow)' : undefined}
                    className={styles.nodeCircle}
                  />

                  {/* Gender indicator */}
                  <circle
                    r="5"
                    cx="20"
                    cy="-20"
                    fill={p.gender === 'M' ? '#4a90d9' : p.gender === 'F' ? '#d9629e' : '#8B5E1A'}
                    stroke="rgba(26,15,5,0.5)"
                    strokeWidth="1"
                  />

                  {/* Initials */}
                  <text
                    y="5"
                    textAnchor="middle"
                    fill="#F5ECD7"
                    fontSize="11"
                    fontFamily="Playfair Display, Georgia, serif"
                    fontWeight="700"
                    className={styles.nodeInitials}
                  >
                    {getInitials(p)}
                  </text>

                  {/* Name label */}
                  <text
                    y="46"
                    textAnchor="middle"
                    fill="#b8966a"
                    fontSize="9"
                    className={styles.nodeLabel}
                  >
                    {p.firstName}
                  </text>
                  <text
                    y="57"
                    textAnchor="middle"
                    fill="#7a5a35"
                    fontSize="8"
                    className={styles.nodeSubLabel}
                  >
                    {p.birthDate}–{p.deathDate ?? 'vivo'}
                  </text>

                  {/* Evidence dot */}
                  <circle r="4" cx="-20" cy="-20" fill={color} />
                </g>
              )
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className={styles.legend}>
          {Object.entries(EVIDENCE_COLORS).map(([status, color]) => (
            <div key={status} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              <span className={styles.legendLabel}>
                {status === 'CONFIRMED' ? 'Confirmado' :
                 status === 'REPORTED' ? 'Reportado' :
                 status === 'INFERRED' ? 'Inferido' :
                 status === 'UNCONFIRMED' ? 'Não confirmado' : 'Investigando'}
              </span>
            </div>
          ))}
        </div>

        {/* Person Detail Panel */}
        {showPanel && selectedPerson && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelAvatar} style={{ borderColor: EVIDENCE_COLORS[selectedPerson.evidenceStatus ?? 'UNCONFIRMED'] }}>
                {getInitials(selectedPerson)}
              </div>
              <div>
                <div className={styles.panelName}>{selectedPerson.firstName} {selectedPerson.lastName}</div>
                <span className={`badge badge-amber`}>{selectedPerson.evidenceStatus ?? 'UNCONFIRMED'}</span>
              </div>
              <button className={styles.panelClose} onClick={() => setShowPanel(false)} aria-label="Fechar">✕</button>
            </div>

            <div className={styles.panelBody}>
              {selectedPerson.birthDate && (
                <div className={styles.panelField}>
                  <span className={styles.panelFieldLabel}>Nascimento</span>
                  <span className={styles.panelFieldValue}>{selectedPerson.birthDate} · {selectedPerson.birthPlace}</span>
                </div>
              )}
              {selectedPerson.deathDate && (
                <div className={styles.panelField}>
                  <span className={styles.panelFieldLabel}>Falecimento</span>
                  <span className={styles.panelFieldValue}>{selectedPerson.deathDate} · {selectedPerson.deathPlace}</span>
                </div>
              )}
              {selectedPerson.occupation && (
                <div className={styles.panelField}>
                  <span className={styles.panelFieldLabel}>Profissão</span>
                  <span className={styles.panelFieldValue}>{selectedPerson.occupation}</span>
                </div>
              )}
              {selectedPerson.nationality && (
                <div className={styles.panelField}>
                  <span className={styles.panelFieldLabel}>Nacionalidade</span>
                  <span className={styles.panelFieldValue}>{selectedPerson.nationality}</span>
                </div>
              )}
              {selectedPerson.notes && (
                <div className={styles.panelNotes}>{selectedPerson.notes}</div>
              )}
            </div>

            <div className={styles.panelFooter}>
              <button className="btn btn-primary btn-sm btn-full" id="edit-person-btn">Editar pessoa</button>
              <button className="btn btn-ghost btn-sm btn-full" id="add-relation-btn">+ Relação</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
