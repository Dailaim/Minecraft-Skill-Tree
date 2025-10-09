"use client";

import { unlockNode } from "../../features/skill-tree-slice";
import { useAppDispatch } from "../../hooks";
import { cn } from "../../utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
}

export function SkillTreeNode({
  node,
  unlocked = false,
  nodeId,
  canUnlock = true,
}: SkillTreeNodeProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!unlocked && canUnlock) {
      dispatch(unlockNode(nodeId));
    }
  };

  const isDisabled = !unlocked && !canUnlock;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip >
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className={
              cn("w-16 h-16 transition-all duration-300 pixel-corners p-0 m-0 border-2 border-black",
              )
            }
            aria-label={node.name}
          >
            <div className={cn("w-full h-full overflow-hidden border-3 shadow shadow-black ",

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
       shadow-[#006c9a]/20`
            )}>
              <img
                src={node.image || "/placeholder.svg"}
                alt={node.name}
                className="pixelated p-1 object-contain w-full h-full max-w-full max-h-full"
              />
            </div>

          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          className="relative max-w-xs p-0 border-0 bg-transparent ring-0 pixel-corners-wrapper shadow-none"
        >
          <div className="relative pixel-corners">
            {/* Título con esquinas recortadas */}
            <h3
              className={cn(
                "relative font-minecraft text-white text-sm px-3 py-2 border-3",
                unlocked
                  ? // 🔸 Estado naranja
                  `bg-[#ac7c0c]
       border-t-[color-mix(in_srgb,_#ac7c0c_70%,_white_30%)]
       border-l-[color-mix(in_srgb,_#ac7c0c_70%,_white_30%)]
       border-b-[color-mix(in_srgb,_#ac7c0c_70%,_black_40%)]
       border-r-[color-mix(in_srgb,_#ac7c0c_70%,_black_40%)]`
                  : // 🔹 Estado azul
                  `bg-[#006c9a]
       border-t-[color-mix(in_srgb,_#006c9a_70%,_white_30%)]
       border-l-[color-mix(in_srgb,_#006c9a_70%,_white_30%)]
       border-b-[color-mix(in_srgb,_#006c9a_70%,_black_40%)]
       border-r-[color-mix(in_srgb,_#006c9a_70%,_black_40%)]`
              )}
            >
              {node.name}


            </h3>

            {/* Descripción */}
            <p className=" bg-[#212121] text-[#00ff26] text-[12px] font-minecraft px-3 py-3 leading-snug border-3 border-t-black border-[color-mix(in_srgb,_#474747_70%,_white_20%)]">
              {node.description}

            </p>
          </div>

        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
