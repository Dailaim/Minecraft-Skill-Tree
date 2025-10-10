import { type ReactNode, useEffect, useRef } from "react";
import { useViewportDrag } from "../../hooks/use-viewport-drag";

interface SkillTreeContainerProps {
	children: ReactNode;
	width: number;
	height: number;
}

export function SkillTreeContainer({
	children,
	width,
	height,
}: SkillTreeContainerProps) {
	const { viewport, setViewport, isDragging, handleMouseDown } =
		useViewportDrag();
	const containerRef = useRef<HTMLDivElement>(null);

	// Centrar el contenido inicialmente si no se ha movido
	useEffect(() => {
		if (containerRef.current && viewport.x === 0 && viewport.y === 0) {
			const rect = containerRef.current.getBoundingClientRect();
			setViewport((prev) => ({
				...prev,
				x: rect.width / 2 - width / 2, // Centrar el skill tree
				y: rect.height / 2 - height / 2,
			}));
		}
	}, [viewport.x, viewport.y, width, height, setViewport]);

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full mx-auto overflow-hidden select-none"
			onMouseDown={handleMouseDown}
			style={{
				cursor: isDragging ? "grabbing" : "grab",
				userSelect: "none", // Evitar selección de texto durante el arrastre
				backgroundImage: "url(/stone.webp)",
				backgroundRepeat: "repeat",
				backgroundSize: "auto",
				backgroundPosition: `${viewport.x}px ${viewport.y}px`,
				maxWidth: `${Math.min(width, window.innerWidth * 0.6)}px`,
				maxHeight: `${Math.min(height, window.innerHeight * 0.5)}px`,
			}}
			role="application"
		>
			<div
				className="relative"
				style={{
					width,
					height,
					minWidth: "100%",
					minHeight: "100%",
					transform: `translate(${viewport.x}px, ${viewport.y}px)`,
					transformOrigin: "0 0",
				}}
			>
				{children}
			</div>
		</div>
	);
}
