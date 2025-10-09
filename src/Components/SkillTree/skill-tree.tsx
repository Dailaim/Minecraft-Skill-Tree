import { useEffect, useState } from "react"
import {
  selectAllNodes,
  selectCanUnlockNode,
  selectRootNodeId,
  selectUnlockedNodes,
} from "../../features/skill-tree-slice"
import { useAppSelector } from "../../hooks"
import { SkillTreeNode } from "./skill-tree-node"

interface NodePosition {
  x: number
  y: number
  nodeId: string
  unlocked: boolean
  parentPos?: { x: number; y: number }
}

export function SkillTree() {
  const nodes = useAppSelector(selectAllNodes)
  const unlockedNodeIds = useAppSelector(selectUnlockedNodes)
  const rootNodeId = useAppSelector(selectRootNodeId)

  const [positions, setPositions] = useState<NodePosition[]>([])

  useEffect(() => {
    if (!rootNodeId || Object.keys(nodes).length === 0) return

    const buildTree = (nodeId: string): any => {
      const node = nodes[nodeId]
      if (!node) return null

      const children = Object.values(nodes)
        .filter((n) => n.parentId === nodeId)
        .map((child) => buildTree(child.id))
        .filter(Boolean)

      return { ...node, children }
    }

    // Calculate positions for all nodes in the tree
    const calculatePositions = (
      node: any,
      x: number,
      y: number,
      parentPos?: { x: number; y: number },
    ): NodePosition[] => {
      const currentPos: NodePosition = {
        x,
        y,
        nodeId: node.id,
        unlocked: unlockedNodeIds.includes(node.id),
        parentPos,
      }

      if (!node.children || node.children.length === 0) {
        return [currentPos]
      }

      const childPositions: NodePosition[] = []
      const verticalSpacing = 140

      node.children.forEach((child: any, index: number) => {
        const childY = y + index * verticalSpacing - ((node.children.length - 1) * verticalSpacing) / 2
        const childX = x + 120
        childPositions.push(...calculatePositions(child, childX, childY, { x, y }))
      })

      return [currentPos, ...childPositions]
    }

    const tree = buildTree(rootNodeId)
    if (tree) {
      const allPositions = calculatePositions(tree, 0, 0)
      setPositions(allPositions)
    }
  }, [nodes, unlockedNodeIds, rootNodeId])

  // Calculate viewBox to fit all nodes with fallback values
  const minX = positions.length > 0 ? Math.min(...positions.map((p) => p.x)) - 50 : 0
  const maxX = positions.length > 0 ? Math.max(...positions.map((p) => p.x)) + 150 : 1000
  const minY = positions.length > 0 ? Math.min(...positions.map((p) => p.y)) - 50 : 0
  const maxY = positions.length > 0 ? Math.max(...positions.map((p) => p.y)) + 100 : 800

  const width = maxX - minX
  const height = maxY - minY

  return (
    <div className="relative w-full h-full overflow-auto bg-gradient-to-br from-background via-muted/30 to-background">
      <div
        className="relative"
        style={{
          width,
          height,
          minWidth: "100%",
          minHeight: "100%",
        }}
      >
        {/* SVG for connection lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width,
            height,
          }}
        >
          <title>{"Minecraft Skill Tree"}</title>
          {positions.map((pos, index) => {
            if (!pos.parentPos) return null

            const _isUnlocked =
              pos.unlocked &&
              unlockedNodeIds.includes(
                positions.find((p) => p.x === pos.parentPos?.x && p.y === pos.parentPos?.y)?.nodeId || "",
              )

            return (
              <g key={`line-${index + 1}-${pos.nodeId}`}>
                {/* Connection path - Border */}
                <path
                  d={`M ${pos.parentPos.x - minX + 20} ${pos.parentPos.y - minY + 32} 
                      L ${pos.x - minX - 20} ${pos.parentPos.y - minY + 32} 
                      L ${pos.x - minX - 20} ${pos.y - minY + 32} 
                      L ${pos.x - minX} ${pos.y - minY + 32}`}
                  stroke="#000000"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="transition-all duration-500"
                />
                {/* Connection path - White fill */}
                <path
                  d={`M ${pos.parentPos.x - minX + 20} ${pos.parentPos.y - minY + 32} 
                      L ${pos.x - minX - 20} ${pos.parentPos.y - minY + 32} 
                      L ${pos.x - minX - 20} ${pos.y - minY + 32} 
                      L ${pos.x - minX} ${pos.y - minY + 32}`}
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="transition-all duration-500"
                />
              </g>
            )
          })}
        </svg>

        {/* Nodes */}
        {positions.map((pos, _index) => {
          const node = nodes[pos.nodeId]
          if (!node) return null

          return (
            <div
              key={pos.nodeId}
              className="absolute"
              style={{
                left: pos.x - minX,
                top: pos.y - minY,
              }}
            >
              <SkillTreeNodeWithCanUnlock node={node} unlocked={pos.unlocked} nodeId={pos.nodeId} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SkillTreeNodeWithCanUnlock({ node, unlocked, nodeId }: { node: any; unlocked: boolean; nodeId: string }) {
  const canUnlock = useAppSelector((state) => selectCanUnlockNode(state, nodeId))
  return <SkillTreeNode node={node} unlocked={unlocked} nodeId={nodeId} canUnlock={canUnlock} />
}
