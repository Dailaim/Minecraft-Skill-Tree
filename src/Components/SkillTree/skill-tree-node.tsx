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
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className={
              cn("relative w-16 h-16 rounded border-4 transition-all duration-300 bg-red",
                "border-primary shadow-md shadow-primary/20 hover:scale-110 hover:shadow-lg active:scale-95",
                unlocked ? "bg-[#aa7e0f]" : "bg-[#c6c6c6]"
              )
            }
            aria-label={node.name}
          >
            <div className="relative w-full h-full p-1 overflow-hidden">
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
          className="relative max-w-xs p-0 bg-transparent rounded-[1px"
        >
          <div className="relative border-2 border-black shadow-[3px_3px_0_#000000]">
            {/* Título con esquinas recortadas */}
            <h3
              className={cn(
                "relative font-minecraft text-white text-sm px-3 py-2 border-b-2 border-black",
                unlocked ? "bg-[#ac7c0c]" : "bg-[#006c9a]",
              )}
            >
              {node.name}

              {/* Esquinas recortadas */}
              <span className="absolute top-0 left-0 w-[1px] h-[1px] bg-[#212121] border-t-2 border-l-2 border-black"></span>
              <span className="absolute top-0 right-0 w-[1px] h-[1px] bg-[#212121] border-t-2 border-r-2 border-black"></span>
            </h3>

            {/* Descripción */}
            <p className=" bg-[#212121] text-[#00ff26] text-[12px] font-minecraft px-3 py-3 leading-snug border-t border-[#474747]">
              {node.description}
              <span className="absolute bottom-0 left-0 w-[1px] h-[1px] bg-[#212121] border-b-2 border-l-2 border-black"></span>
              <span className="absolute bottom-0 right-0 w-[1px] h-[1px] bg-[#212121] border-b-2 border-r-2 border-black"></span>
            </p>
          </div>

          {/* Flecha del tooltip */}
          <div className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-transparent border-t-[6px] border-t-black -top-[6px] left-6"></div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
