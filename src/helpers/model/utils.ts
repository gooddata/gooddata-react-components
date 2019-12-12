// (C) 2018-2019 GoodData Corporation
import { VisualizationObject, AFM } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";

const {
    Uri: { isUri },
} = DataLayer;

export const getObjQualifier = (qualifierString: string): VisualizationObject.ObjQualifier =>
    isUri(qualifierString)
        ? {
              uri: qualifierString,
          }
        : {
              identifier: qualifierString,
          };

export const getQualifier = (qualifierString: string): AFM.Qualifier =>
    isUri(qualifierString)
        ? {
              uri: qualifierString,
          }
        : {
              localIdentifier: qualifierString,
          };
