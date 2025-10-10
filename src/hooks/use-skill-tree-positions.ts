import { useEffect, useMemo, useState } from "react";
import {
	type NormalizedSkillNode,
	selectAllNodes,
	selectRootNodeId,
	selectUnlockedNodes,
} from "../features/skill-tree-slice";
import { useAppSelector } from ".";

export interface NodePosition {
	x: number;
	y: number;
	nodeId: string;
	unlocked: boolean;
	parentPos?: { x: number; y: number };
}

interface SkillTreeNode extends NormalizedSkillNode {
	children: SkillTreeNode[];
}

export function useSkillTreePositions() {
	const nodes = useAppSelector(selectAllNodes);
	const unlockedNodeIds = useAppSelector(selectUnlockedNodes);
	const rootNodeId = useAppSelector(selectRootNodeId);
	const [positions, setPositions] = useState<NodePosition[]>([]);

	useEffect(() => {
		if (!rootNodeId || Object.keys(nodes).length === 0) return;

		const buildTree = (nodeId: string): SkillTreeNode | null => {
			const node = nodes[nodeId];
			if (!node) return null;

			const children = Object.values(nodes)
				.filter((n) => n.parentId === nodeId)
				.map((child) => buildTree(child.id))
				.filter((child): child is SkillTreeNode => child !== null);

			return { ...node, children };
		};

		// Calculate positions for all nodes in the tree
		const calculatePositions = (
			node: SkillTreeNode,
			x: number,
			startY: number,
			parentPos?: { x: number; y: number },
		): { positions: NodePosition[]; usedHeight: number } => {
			const verticalSpacing = 80;
			const horizontalSpacing = 120;

			// Si no tiene hijos, ocupa una posición
			if (!node.children || node.children.length === 0) {
				const currentPos: NodePosition = {
					x,
					y: startY,
					nodeId: node.id,
					unlocked: unlockedNodeIds.includes(node.id),
					parentPos,
				};
				return { positions: [currentPos], usedHeight: 1 };
			}

			// Calcula las posiciones de todos los hijos primero
			const childResults: Array<{
				positions: NodePosition[];
				usedHeight: number;
			}> = [];
			let currentY = startY;

			for (const child of node.children) {
				const childResult = calculatePositions(
					child,
					x + horizontalSpacing,
					currentY,
					{ x, y: 0 }, // Temporalmente, actualizaremos después
				);
				childResults.push(childResult);
				currentY += childResult.usedHeight * verticalSpacing;
			}

			// Calcula el centro del nodo actual basándose en sus hijos
			const totalChildrenHeight = childResults.reduce(
				(sum, result) => sum + result.usedHeight,
				0,
			);
			const firstChildY = childResults[0]?.positions[0]?.y ?? startY;
			const lastChildY =
				childResults[childResults.length - 1]?.positions[0]?.y ?? startY;
			const centerY = (firstChildY + lastChildY) / 2;

			// Crea la posición del nodo actual
			const currentPos: NodePosition = {
				x,
				y: centerY,
				nodeId: node.id,
				unlocked: unlockedNodeIds.includes(node.id),
				parentPos,
			};

			// Actualiza las posiciones de los hijos con la posición correcta del padre
			const allPositions = childResults.flatMap((result) =>
				result.positions.map((pos) => {
					if (pos.parentPos && pos.parentPos.x === x) {
						return { ...pos, parentPos: { x, y: centerY } };
					}
					return pos;
				}),
			);

			return {
				positions: [currentPos, ...allPositions],
				usedHeight: totalChildrenHeight,
			};
		};

		const tree = buildTree(rootNodeId);
		if (tree) {
			const result = calculatePositions(tree, 0, 0);
			setPositions(result.positions);
		}
	}, [nodes, unlockedNodeIds, rootNodeId]);

	// Calculate viewBox to fit all nodes with fallback values
	const dimensions = useMemo(() => {
		const minX =
			positions.length > 0 ? Math.min(...positions.map((p) => p.x)) - 50 : 0;
		const maxX =
			positions.length > 0
				? Math.max(...positions.map((p) => p.x)) + 150
				: 1000;
		const minY =
			positions.length > 0 ? Math.min(...positions.map((p) => p.y)) - 50 : 0;
		const maxY =
			positions.length > 0 ? Math.max(...positions.map((p) => p.y)) + 100 : 800;

		const width = maxX - minX;
		const height = maxY - minY;

		return {
			minX,
			maxX,
			minY,
			maxY,
			width,
			height,
		};
	}, [positions]);

	return {
		positions,
		dimensions,
	};
}
