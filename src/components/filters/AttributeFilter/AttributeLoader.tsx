// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import * as PropTypes from "prop-types";
import { IAttributeDisplayForm, IAttribute } from "./model";

export interface IAttributeLoaderMetadataProps {
    getObjectUri: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
    getObjectDetails: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
}

export interface IAttributeLoaderProps {
    metadata: IAttributeLoaderMetadataProps;
    projectId?: string;
    uri?: string;
    identifier?: string;

    children(props: IAttributeLoaderChildrenProps): any;
}

export interface IAttributeLoaderState {
    attribute: IAttribute;
    attributeDisplayForm: IAttributeDisplayForm;
    isLoading: boolean;
    isUsingIdentifier: boolean;
    error?: string;
}

export interface IAttributeLoaderChildrenProps {
    attribute: IAttribute;
    attributeDisplayForm: IAttributeDisplayForm;
    isLoading: boolean;
    isUsingIdentifier: boolean;
    error?: string;
}

function getAttributeUri(
    metadata: IAttributeLoaderMetadataProps,
    projectId: string,
    uri: string,
    identifier: string,
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (uri) {
            return resolve(uri);
        }
        if (!identifier || !projectId) {
            return reject(
                new Error("Missing either uri, or identifier and projectId in AttributeFilter props"),
            );
        }
        return metadata.getObjectUri(projectId, identifier).then((uri: string) => {
            resolve(uri);
        }, reject);
    });
}

function getAttributeDisplayForm(
    metadata: IAttributeLoaderMetadataProps,
    uri: string,
): Promise<IAttributeDisplayForm> {
    return metadata.getObjectDetails(uri).then((result: any) => {
        if (!result || !result.attributeDisplayForm) {
            throw new Error('Invalid data uri. Required data uri must be of type "attributeDisplayForm"');
        }
        return result.attributeDisplayForm;
    });
}

function getAttribute(metadata: IAttributeLoaderMetadataProps, uri: string): Promise<IAttribute> {
    return metadata.getObjectDetails(uri).then((result: any) => {
        if (!result || !result.attribute) {
            throw new Error('Invalid data uri. Required data uri must be of type "attribute"');
        }
        return result.attribute;
    });
}

export class AttributeLoader extends React.PureComponent<IAttributeLoaderProps, IAttributeLoaderState> {
    public static propTypes = {
        projectId: PropTypes.string,
        uri: PropTypes.string,
        identifier: PropTypes.string,
        metadata: PropTypes.shape({
            getObjectDetails: PropTypes.func.isRequired,
            getObjectUri: PropTypes.func.isRequired,
        }).isRequired,
    };

    public static defaultProps: Partial<IAttributeLoaderProps> = {
        uri: null,
        identifier: null,
        projectId: null,
    };

    constructor(props: IAttributeLoaderProps) {
        super(props);

        this.state = {
            attribute: null,
            attributeDisplayForm: null,
            isLoading: true,
            isUsingIdentifier: false,
            error: null,
        };
    }

    public componentDidMount() {
        this.getAttributeDetails(this.props);
    }

    public componentWillReceiveProps(nextProps: IAttributeLoaderProps) {
        if (
            this.props.uri !== nextProps.uri ||
            this.props.identifier !== nextProps.identifier ||
            this.props.projectId !== nextProps.projectId
        ) {
            this.setState({
                isLoading: true,
                attributeDisplayForm: null, // invalidate
            });
            this.getAttributeDetails(nextProps);
        }
    }

    public render() {
        const { attributeDisplayForm, isLoading, isUsingIdentifier, error, attribute } = this.state;
        return this.props.children({
            attribute,
            attributeDisplayForm,
            isLoading,
            isUsingIdentifier,
            error,
        });
    }

    private getAttributeDetails(props: IAttributeLoaderProps) {
        const { metadata, projectId, uri, identifier } = props;
        getAttributeUri(metadata, projectId, uri, identifier)
            .then((dfUri: string) => getAttributeDisplayForm(metadata, dfUri))
            .then(
                (attributeDisplayForm: IAttributeDisplayForm) => {
                    getAttribute(metadata, attributeDisplayForm.content.formOf).then(
                        (attribute: IAttribute) => {
                            this.setState({
                                attribute,
                                attributeDisplayForm,
                                isLoading: false,
                                isUsingIdentifier: !!identifier,
                                error: null,
                            });
                        },
                    );
                },
                (error: any) => {
                    this.setState({
                        attribute: null,
                        attributeDisplayForm: null,
                        isLoading: false,
                        error,
                    });
                },
            );
    }
}
