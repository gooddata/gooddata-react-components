// (C) 2007-2018 GoodData Corporation
import { getMeasureUriOrIdentifier } from '../components/visualizations/utils/drilldownEventing';
import {
    IDrillableItem,
    IDrillableItemSimple,
    IDrillablePredicate,
    IDrillHeader,
    isDrillableItemComposed,
    isDrillHeaderLocalId,
    isDrillableItemIdentifier,
    isDrillableItemUri,
    IDrillableItemComposed,
    isDrillHeaderIdentifier,
    isDrillHeaderUri, isDrillablePredicate
} from '../interfaces/DrillEvents';
import { AFM } from '@gooddata/typings';

export function isItemUri(uri: string) {
    // console.log('isItemUri.factory', uri);
    return (
        header: IDrillHeader,
        afm: AFM.IAfm
    ): boolean => {
        if (isDrillHeaderUri(header)) {
            return header.uri && header.uri === uri;
        }

        const afmHeader = isDrillHeaderLocalId(header) ?
            getMeasureUriOrIdentifier(afm, header.localIdentifier)
            : null;

        return afmHeader && isDrillHeaderUri(afmHeader) && afmHeader.uri === uri;
    };
}

export function isItemIdentifier(identifier: string) {
    // console.log('isItemIdentifier.factory', identifier);
    return (
        header: IDrillHeader,
        afm: AFM.IAfm
    ): boolean => {
        // console.log('isItemIdentifier.tap', identifier);
        if (isDrillHeaderIdentifier(header)) {
            return header.identifier && header.identifier === identifier;
        }

        const afmHeader = isDrillHeaderLocalId(header) ?
            getMeasureUriOrIdentifier(afm, header.localIdentifier)
            : null;

        return afmHeader && isDrillHeaderIdentifier(afmHeader) && afmHeader.identifier === identifier;
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

function convertComposedFromItems(composedFrom: IDrillableItemComposed['composedFrom']): IDrillablePredicate[] {
    return composedFrom.map((composedDrillableItem: IDrillableItemSimple) => {
        if (isDrillableItemUri(composedDrillableItem)) {
            return isUriInArithmeticMeasureTree(composedDrillableItem.uri);
        } else if (isDrillableItemIdentifier(composedDrillableItem)) {
            return isIdentifierInArithmeticMeasureTree(composedDrillableItem.identifier);
        }
    });
}

export function convertDrillableItemsToPredicates(
    drillableItems: Array<IDrillableItem | IDrillablePredicate>
): IDrillablePredicate[] {
    return drillableItems.reduce((acc: IDrillablePredicate[], drillableItem: IDrillableItem) => {
        if (isDrillableItemComposed(drillableItem)) {
            const nestedDrillables = convertComposedFromItems(drillableItem.composedFrom);
            return acc.concat(nestedDrillables);
        } else if (isDrillableItemUri(drillableItem)) {
            return acc.concat(isItemUri(drillableItem.uri));
        } else if (isDrillableItemIdentifier(drillableItem)) {
            return acc.concat(isItemIdentifier(drillableItem.identifier));
        } else if (isDrillablePredicate(drillableItem)) {
            return acc.concat(drillableItem);
        }
        return acc;
    }, []);
}

function isQualifierInArithmeticMeasureTree(predicate: IObjectQualifierPredicate): IDrillablePredicate {
    return (
        header: IDrillHeader,
        afm: AFM.IAfm
    ): boolean => {
        const arithmeticMeasure = afm.measures.find(
            measure => isDrillHeaderLocalId(header) && measure.localIdentifier === header.localIdentifier
        );

        if (!arithmeticMeasure || !AFM.isArithmeticMeasureDefinition(arithmeticMeasure.definition)) {
            return;
        }

        return arithmeticMeasure.definition.arithmeticMeasure.measureIdentifiers.some(
            operandLocalIdentifier => deepMatchArithmeticMeasure(afm.measures, operandLocalIdentifier, predicate)
        );
    };
}

// TODO BB-1127 This should be moved to typings next to the isObjIdentifierUri function
function isObjIdentifierQualifier(qualifier: AFM.ObjQualifier): qualifier is AFM.IObjIdentifierQualifier {
    return (qualifier as AFM.IObjIdentifierQualifier).identifier !== undefined;
}
