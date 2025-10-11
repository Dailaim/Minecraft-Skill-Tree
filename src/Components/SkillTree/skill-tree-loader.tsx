"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import * as v from "valibot";
import { loadSkillTree } from "../../features/skill-tree-slice";
import { useAppDispatch } from "../../hooks";
import { trycatch } from "../../utils";
import { SkillTree } from "./skill-tree";

interface NestedSkillNode {
	name: string;
	description: string;
	image: string;
	children: NestedSkillNode[];
}

const nestedSkillNodeSchema: v.GenericSchema<NestedSkillNode> = v.object({
	name: v.string(),
	description: v.string(),
	image: v.string(),
	children: v.array(v.lazy(() => nestedSkillNodeSchema)),
});

interface SkillTreeLoaderProps {
	data: NestedSkillNode;
}

export function SkillTreeLoader({ data: defaultData }: SkillTreeLoaderProps) {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const loadData = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const dataUrl = urlParams.get("dataUrl");
			if (!dataUrl) {
				dispatch(loadSkillTree(defaultData));
				throw new Error("Error loadingData");
			}

			const toastID = toast.loading("Cargando datos...");

			const [data, error] = await trycatch(fetch(dataUrl));

			if (error) {
				toast.error(error.message, {
					id: toastID,
					description: "Sean cargado los datos por defecto",
				});
				throw new Error("Error loadingData");
			}

			if (!data.ok) {
				toast.error(
					`Error al cargar datos: ${data.status} ${data.statusText}`,
					{
						id: toastID,
						description: "Sean cargado los datos por defecto",
					},
				);
				throw new Error("Error loadingData");
			}

			const [jsonData, errorParsing] = await trycatch(data.json());

			if (errorParsing) {
				toast.error("Error al analizar los datos", {
					id: toastID,
					description: "Sean cargado los datos por defecto",
				});
				throw new Error("Error loadingData");
			}

			const [parsedData, errorParsing2] = trycatch(() =>
				v.parse(nestedSkillNodeSchema, jsonData),
			);

			if (errorParsing2) {
				toast.error("Error al analizar los datos", {
					id: toastID,
					description: "Sean cargado los datos por defecto",
				});
				throw new Error("Error loadingData");
			}

			toast.success("Datos cargados correctamente", {
				description: "El árbol de habilidades se ha cargado correctamente",
				id: toastID,
			});
			dispatch(loadSkillTree(parsedData));
		};

		loadData().catch(() => {
			dispatch(loadSkillTree(defaultData));
		});
	}, [dispatch, defaultData]);

	return <SkillTree />;
}
