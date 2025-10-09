import data from "./data.json";

const unlockedNodes = new Set<string>();

interface SkillNode {
	name: string;
	description: string;
	image: string;
	children: SkillNode[];
}

interface SkillTreeProps {
	data: SkillNode;
}

interface NodePosition {
	x: number;
	y: number;
	node: SkillNode;
	unlocked: boolean;
	parentPos?: { x: number; y: number };
}

const calculatePositions = (
	node: SkillNode,
	x: number,
	y: number,
	parentPos?: { x: number; y: number },
): NodePosition[] => {
	const currentPos: NodePosition = {
		x,
		y,
		node,
		unlocked: unlockedNodes.has(node.name),
		parentPos,
	};

	if (node.children.length === 0) {
		return [currentPos];
	}

	const childPositions: NodePosition[] = [];
	const verticalSpacing = 140;

	node.children.forEach((child, index) => {
		const childY =
			y +
			index * verticalSpacing -
			((node.children.length - 1) * verticalSpacing) / 2;
		const childX = x + 180;
		childPositions.push(...calculatePositions(child, childX, childY, { x, y }));
	});

	return [currentPos, ...childPositions];
};

const allPositions = calculatePositions(data, 100, 400);

Bun.write("test.json", JSON.stringify(allPositions, null, 2));
