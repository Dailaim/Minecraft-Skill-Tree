import {
	type NormalizedSkillNode,
	selectAllNodes,
	selectCanUnlockNode,
	unlockNode,
} from "../../features/skill-tree-slice";
import {
	useAppDispatch,
	useAppSelector,
	useBackgroundMusic,
	useSkillTreePositions,
	useViewportDrag,
} from "../../hooks";
import { SkillTreeCanvas } from "./skill-tree-canvas";
import { SkillTreeContainer } from "./skill-tree-container";
import { SkillTreeNode } from "./skill-tree-node";

export function SkillTree() {
	const nodes = useAppSelector(selectAllNodes);
	const { positions, dimensions } = useSkillTreePositions();
	const { isDragging } = useViewportDrag();

	// Initialize background music
	useBackgroundMusic();

	const { minX, minY, width, height } = dimensions;

	return (
		<SkillTreeContainer width={width} height={height}>
			{/* SVG for connection lines */}
			<SkillTreeCanvas
				positions={positions}
				width={width}
				height={height}
				minX={minX}
				minY={minY}
			/>

			{/* Nodes */}
			{positions.map((pos, _index) => {
				const node = nodes[pos.nodeId];
				if (!node) return null;

				return (
					<div
						key={pos.nodeId}
						className={`absolute skill-tree-node ${isDragging ? "pointer-events-none" : "pointer-events-auto"}`}
						style={{
							left: pos.x - minX,
							top: pos.y - minY,
						}}
					>
						<SkillTreeNodeContainer
							position={{
								y: pos.y,
								x: pos.y,
							}}
							node={node}
							unlocked={pos.unlocked}
							nodeId={pos.nodeId}
						/>
					</div>
				);
			})}
		</SkillTreeContainer>
	);
}

function SkillTreeNodeContainer(props: {
	node: NormalizedSkillNode;
	unlocked: boolean;
	nodeId: string;
	position: {
		y: number;
		x: number;
	};
}) {
	const dispatch = useAppDispatch();

	const canUnlock = useAppSelector((state) =>
		selectCanUnlockNode(state, props.nodeId),
	);

	const handleClick = () => {
		if (!props.unlocked && canUnlock) {
			dispatch(unlockNode(props.nodeId));
		}
	};

	return (
		<SkillTreeNode {...props} onClick={handleClick} canUnlock={canUnlock} />
	);
}
