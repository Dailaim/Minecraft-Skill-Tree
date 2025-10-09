"use client"

import { useEffect } from "react"
import { loadSkillTree } from "../../features/skill-tree-slice"
import { useAppDispatch } from "../../hooks"
import { SkillTree } from "./skill-tree"

interface NestedSkillNode {
  name: string
  description: string
  image: string
  children: NestedSkillNode[]
}

interface SkillTreeLoaderProps {
  data: NestedSkillNode
}

export function SkillTreeLoader({ data }: SkillTreeLoaderProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadSkillTree(data))
  }, [dispatch, data])

  return <SkillTree />
}
