import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface NestedSkillNode {
	name: string;
	description: string;
	image: string;
	children: NestedSkillNode[];
}

export interface NormalizedSkillNode {
	id: string;
	name: string;
	description: string;
	image: string;
	parentId: string | null;
}

export interface SkillTreeState {
	nodes: Record<string, NormalizedSkillNode>;
	unlockedNodes: string[];
	rootNodeId: string | null;
}

const initialState: SkillTreeState = {
	nodes: {},
	unlockedNodes: [],
	rootNodeId: null,
};

function normalizeSkillTree(
	nestedNode: NestedSkillNode,
	parentId: string | null = null,
	idPrefix = "node",
): {
	nodes: Record<string, NormalizedSkillNode>;
	rootId: string;
} {
	const nodes: Record<string, NormalizedSkillNode> = {};
	let counter = 0;

	function traverse(
		node: NestedSkillNode,
		parent: string | null,
		prefix: string,
	): string {
		const nodeId = `${prefix}-${counter++}`;

		nodes[nodeId] = {
			id: nodeId,
			name: node.name,
			description: node.description,
			image: node.image,
			parentId: parent,
		};

		if (node.children && node.children.length > 0) {
			node.children.forEach((child) => {
				traverse(child, nodeId, prefix);
			});
		}

		return nodeId;
	}

	const rootId = traverse(nestedNode, parentId, idPrefix);
	return { nodes, rootId };
}

const skillTreeSlice = createSlice({
	name: "skillTree",
	initialState,
	reducers: {
		loadSkillTree: (state, action: PayloadAction<NestedSkillNode>) => {
			const { nodes, rootId } = normalizeSkillTree(action.payload);
			state.nodes = nodes;
			state.rootNodeId = rootId;
			state.unlockedNodes = [];
		},

		unlockNode: (state, action: PayloadAction<string>) => {
			const nodeId = action.payload;
			const node = state.nodes[nodeId];

			// If node doesn't exist or is already unlocked, do nothing
			if (!node || state.unlockedNodes.includes(nodeId)) {
				return;
			}

			// Root node can always be unlocked
			if (!node.parentId) {
				if (!state.unlockedNodes.includes(nodeId)) {
					state.unlockedNodes.push(nodeId);
				}
				return;
			}

			// Check if parent is unlocked
			const parentUnlocked = state.unlockedNodes.includes(node.parentId);
			if (parentUnlocked && !state.unlockedNodes.includes(nodeId)) {
				state.unlockedNodes.push(nodeId);
			}
		},

		resetProgress: (state) => {
			state.unlockedNodes = state.rootNodeId ? [state.rootNodeId] : [];
		},
	},
});

export const { loadSkillTree, unlockNode, resetProgress } =
	skillTreeSlice.actions;

export const selectAllNodes = (state: RootState) => state.skillTree.nodes;
export const selectUnlockedNodes = (state: RootState) =>
	state.skillTree.unlockedNodes;
export const selectRootNodeId = (state: RootState) =>
	state.skillTree.rootNodeId;
export const selectNodeById = (state: RootState, nodeId: string) =>
	state.skillTree.nodes[nodeId];
export const selectIsNodeUnlocked = (state: RootState, nodeId: string) =>
	state.skillTree.unlockedNodes.includes(nodeId);

export const selectCanUnlockNode = (state: RootState, nodeId: string) => {
	const node = state.skillTree.nodes[nodeId];
	if (!node) return false;

	// Root node can always be unlocked
	if (!node.parentId) return true;

	// Check if parent is unlocked
	return state.skillTree.unlockedNodes.includes(node.parentId);
};

export { skillTreeSlice };
export default skillTreeSlice.reducer;
