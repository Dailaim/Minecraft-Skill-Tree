import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "../../utils";

interface SkillNode {
	id: string;
	name: string;
	description: string;
	image: string;
	parentId: string | null;
}

interface SkillTreeNodeProps {
	node: SkillNode;
	unlocked?: boolean;
	nodeId: string;
	canUnlock?: boolean;
	position: {
		y: number;
		x: number;
	};
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function ButtonSkillTreeNode({
	node,
	unlocked = false,
	onClick,
	canUnlock = true,
	isHover,
	...props
}: SkillTreeNodeProps & {
	isHover: boolean;
} & DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>) {
	const isDisabled = !unlocked && !canUnlock;

	return (
		<button
			{...props}
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={cn(
				" w-16 h-16 transition-all duration-300 pixel-corners p-0 m-0 border-2 border-black relative ",
				isDisabled || "cursor-pointer",
			)}
			style={{ zIndex: 99999, position: "relative" }}
			aria-label={node.name}
		>
			<div
				className={cn(
					"w-full h-full overflow-hidden border-3 shadow shadow-black ",

					unlocked
						? // 🔸 Estado desbloqueado (naranja)
							`bg-[#aa7e0f]
       border-t-[color-mix(in_srgb,_#aa7e0f_70%,_white_30%)]
       border-l-[color-mix(in_srgb,_#aa7e0f_70%,_white_30%)]
       border-b-[color-mix(in_srgb,_#aa7e0f_70%,_black_50%)]
       border-r-[color-mix(in_srgb,_#aa7e0f_70%,_black_50%)]
       shadow-[#aa7e0f]/30`
						: // 🔹 Estado bloqueado (gris/azul)
							`bg-[#c6c6c6]
       border-t-[color-mix(in_srgb,_#c6c6c6_70%,_white_30%)]
       border-l-[color-mix(in_srgb,_#c6c6c6_70%,_white_30%)]
       border-b-[color-mix(in_srgb,_#c6c6c6_70%,_black_50%)]
       border-r-[color-mix(in_srgb,_#c6c6c6_70%,_black_50%)]
       shadow-[#006c9a]/20`,
				)}
			>
				<img
					src={node.image || "/placeholder.svg"}
					alt={node.name}
					className="pixelated p-1 object-contain w-full h-full max-w-full max-h-full"
				/>
			</div>
		</button>
	);
}

ButtonSkillTreeNode.displayName = "ButtonSkillTreeNode";

export { ButtonSkillTreeNode };
