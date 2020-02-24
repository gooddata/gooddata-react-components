// (C) 2020 GoodData Corporation
import uniqBy = require("lodash/uniqBy");
import { IColorItem, IColorPalette, IColorPaletteItem } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { getColorFromMapping } from "../../utils/color";

export function isValidMappedColor(colorItem: IColorItem, colorPalette: IColorPalette) {
    if (!colorItem) {
        return false;
    }

    if (colorItem.type === "guid") {
        return isColorItemInPalette(colorItem, colorPalette);
    }

    return true;
}

export function getAtributeColorAssignment(
    attribute: any,
    colorPalette: IColorPalette,
    colorMapping: IColorMapping[],
    executionResponse: Execution.IExecutionResponse,
    afm: AFM.IAfm,
): IColorAssignment[] {
    let currentColorPaletteIndex = 0;
    const uniqItems: Execution.IResultAttributeHeaderItem[] = uniqBy<Execution.IResultAttributeHeaderItem>(
        attribute.items,
        "attributeHeaderItem.uri",
    );

    return uniqItems.map(headerItem => {
        const mappedColor = getColorFromMapping(headerItem, colorMapping, executionResponse, afm);

        const color: IColorItem = isValidMappedColor(mappedColor, colorPalette)
            ? mappedColor
            : {
                  type: "guid",
                  value: colorPalette[currentColorPaletteIndex % colorPalette.length].guid,
              };
        currentColorPaletteIndex++;

        return {
            headerItem,
            color,
        };
    });
}

function isColorItemInPalette(colorItem: IColorItem, colorPalette: IColorPalette) {
    return colorPalette.some((paletteItem: IColorPaletteItem) => {
        return colorItem.type === "guid" && colorItem.value === paletteItem.guid;
    });
}
