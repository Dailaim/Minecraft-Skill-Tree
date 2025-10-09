"use client";

import { useState } from "react";
import { cn } from "../../utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { ButtonSkillTreeNode } from "./button-skill-tree-node";

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

export function SkillTreeNode({
	node,
	unlocked = false,
	onClick,
	canUnlock = true,
	position,
}: SkillTreeNodeProps) {
	const [isHover, changeHover] = useState(false);

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip delayDuration={0} open={isHover} onOpenChange={changeHover}>
				<TooltipTrigger asChild>
					<ButtonSkillTreeNode
						node={node}
						nodeId={node.id}
						position={position}
						unlocked={unlocked}
						onClick={onClick}
						canUnlock={canUnlock}
						isHover={isHover}
					/>
				</TooltipTrigger>
				<TooltipContent
					side="right"
					alignOffset={6}
					align="start"
					sideOffset={-80}
					className="p-0 group border-0 bg-transparent ring-0 pixel-corners-wrapper shadow-none z-[9998]"
				>
					<div className="relative pixel-corners">
						<div className="absolute  group-data-[side=left]:right-[13px] top-[-9px] group-data-[side=right]:left-[13px] z-[99999]">
							<ButtonSkillTreeNode
								node={node}
								nodeId={node.id}
								position={position}
								unlocked={unlocked}
								onClick={onClick}
								canUnlock={canUnlock}
								isHover={isHover}
							/>
						</div>
						<div
							className={cn(
								"relative font-minecraft text-white text-xl pe-2 py-2  group-data-[side=right]:ps-20 group-data-[side=left]:ps-2 group-data-[side=left]:pe-20",
								"border-3",
								unlocked
									? `bg-[#ac7c0c]
       border-t-[color-mix(in_srgb,_#ac7c0c_70%,_white_30%)]
       border-l-[color-mix(in_srgb,_#ac7c0c_70%,_white_30%)]
       border-b-[color-mix(in_srgb,_#ac7c0c_70%,_black_40%)]
       border-r-[color-mix(in_srgb,_#ac7c0c_70%,_black_40%)]`
									: // 🔹 Estado azul
										`bg-[#006c9a]
       border-t-[color-mix(in_srgb,_#006c9a_70%,_white_30%)]
       border-l-[color-mix(in_srgb,_#006c9a_70%,_white_30%)]
       border-b-[color-mix(in_srgb,_#006c9a_70%,_black_40%)]
       border-r-[color-mix(in_srgb,_#006c9a_70%,_black_40%)]`,
								"",
							)}
						>
							{node.name}
						</div>

						<div
							className="w-full text-[#00ff26] bg-[#212121] h-full border-3 border-t-black
						border-[color-mix(in_srgb,_#474747_70%,_white_20%)] "
						>
							<p className="max-w-md text-lg font-minecraft px-3 pt-4 pb-3 leading-snug ">
								{node.description}
							</p>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
