// (C) 2007-2018 GoodData Corporation
import { getMeasureUriOrIdentifier } from './components/visualizations/utils/drilldownEventing';
import {
    IDrillableItem,
    IDrillableItemSimple,
    IDrillablePredicate,
    IDrillItem, isDrillableItemComposedFrom,
    isDrillableItemLocalId
} from './interfaces/DrillEvents';
import { AFM } from '@gooddata/typings';

export function isItemUri(uri: string) {
    // console.log('isItemUri.factory', uri);
    return (
        header: IDrillItem,
        afm: AFM.IAfm
    ): boolean => {
        if (header.uri) {
            return header.uri && header.uri === uri;
        }

        const afmHeader = isDrillableItemLocalId(header) ?
            getMeasureUriOrIdentifier(afm, header.localIdentifier)
            : null;

        return afmHeader && afmHeader.uri && afmHeader.uri === uri;
    };
}

export function isItemIdentifier(identifier: string) {
    // console.log('isItemIdentifier.factory', identifier);
    return (
        header: IDrillItem,
        afm: AFM.IAfm
    ): boolean => {
        // console.log('isItemIdentifier.tap', identifier);
        if (header.identifier) {
            return header.identifier && header.identifier === identifier;
        }

        const afmHeader = isDrillableItemLocalId(header) ?
            getMeasureUriOrIdentifier(afm, header.localIdentifier)
            : null;

        return afmHeader && afmHeader.identifier && afmHeader.identifier === identifier;
    };
}

type IObjectQualifierPredicate = (qualifier: AFM.ObjQualifier) => boolean;

function deepMatchArithmeticMeasure(measures: AFM.IMeasure[],
                                    operandLocalIdentifier: string,
                                    predicate: IObjectQualifierPredicate): boolean {
    const operand: AFM.IMeasure = measures.find(measure => measure.localIdentifier === operandLocalIdentifier);

    if (AFM.isArithmeticMeasureDefinition(operand.definition)) {
        return operand.definition.arithmeticMeasure.measureIdentifiers.some(
            operandLocalIdentifier => deepMatchArithmeticMeasure(measures, operandLocalIdentifier, predicate)
        );
    }

    if (AFM.isSimpleMeasureDefinition(operand.definition)) {
        return predicate(operand.definition.measure.item);
    }

    return false;
}

export function isUriInArithmeticMeasureTree(uri: string): IDrillablePredicate {
    // console.log('isUriInArithmeticMeasureTree.factory', uri);
    return isQualifierInArithmeticMeasureTree(
        qualifier => AFM.isObjectUriQualifier(qualifier) && qualifier.uri === uri
    );
}

export function isIdentifierInArithmeticMeasureTree(identifier: string): IDrillablePredicate {
    // console.log('isIdentifierInArithmeticMeasureTree.factory', identifier);
    return isQualifierInArithmeticMeasureTree(
        qualifier  => isObjIdentifierQualifier(qualifier) && qualifier.identifier === identifier
    );
}

export function convertLegacyDrillableItems(drillableItems: IDrillableItem[]): any {
    // TODO BB-1127 Use Type guards
    return drillableItems.reduce((acc: IDrillablePredicate[], drillableItem: IDrillableItem) => {
        if (isDrillableItemComposedFrom(drillableItem)) {
            const nestedDrillables = drillableItem.composedFrom.map((composedDrillableItem: IDrillableItemSimple) => {
                if (composedDrillableItem.uri) {
                    return isUriInArithmeticMeasureTree(composedDrillableItem.uri);
                } else if (composedDrillableItem.identifier) {
                    return isIdentifierInArithmeticMeasureTree(composedDrillableItem.identifier);
                }
            });
            return acc.concat(nestedDrillables);
        } else if (drillableItem.uri) {
            return acc.concat(isItemUri(drillableItem.uri));
        } else if (drillableItem.identifier) {
            return acc.concat(isItemIdentifier(drillableItem.identifier));
        }
        return acc;
    }, []);
}

function isQualifierInArithmeticMeasureTree(predicate: IObjectQualifierPredicate): IDrillablePredicate {
    return (
        header: IDrillItem,
        afm: AFM.IAfm
    ): boolean => {
        const arithmeticMeasure = afm.measures.find(
            measure => isDrillableItemLocalId(header) && measure.localIdentifier === header.localIdentifier
        );

        if (!arithmeticMeasure || !AFM.isArithmeticMeasureDefinition(arithmeticMeasure.definition)) {
            return;
        }

        return arithmeticMeasure.definition.arithmeticMeasure.measureIdentifiers.some(
            operandLocalIdentifier => deepMatchArithmeticMeasure(afm.measures, operandLocalIdentifier, predicate)
        );
    };
}

// TODO BB-1127 This should be moved to typings
function isObjIdentifierQualifier(qualifier: AFM.ObjQualifier): qualifier is AFM.IObjIdentifierQualifier {
    return (qualifier as AFM.IObjIdentifierQualifier).identifier !== undefined;
}
