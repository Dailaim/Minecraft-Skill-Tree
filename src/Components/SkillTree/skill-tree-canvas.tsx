import type { NodePosition } from "../../hooks/use-skill-tree-positions";

interface SkillTreeCanvasProps {
	positions: NodePosition[];
	width: number;
	height: number;
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

export function SkillTreeCanvas({
	positions,
	width,
	height,
	minX,
	minY,
	maxX,
	maxY,
}: SkillTreeCanvasProps) {
	// Calcular el viewBox completo basado en las posiciones reales
	const viewBoxWidth = maxX - minX;
	const viewBoxHeight = maxY - minY;

	return (
		<svg
			className="absolute inset-0 pointer-events-none"
			viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
			style={{
				width,
				height,
			}}
		>
			<title>{"Minecraft Skill Tree"}</title>
			{positions.map((pos, index) => {
				if (!pos.parentPos) return null;

				return (
					<g key={`line-${index + 1}-${pos.nodeId}`}>
						{/* Connection path - Border */}
						<path
							d={`M ${pos.parentPos.x - minX + 20} ${pos.parentPos.y - minY + 32} 
                  L ${pos.x - minX - 20} ${pos.parentPos.y - minY + 32} 
                  L ${pos.x - minX - 20} ${pos.y - minY + 32} 
                  L ${pos.x - minX} ${pos.y - minY + 32}`}
							stroke="#000000"
							strokeWidth="10"
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
				);
			})}
		</svg>
	);
}
