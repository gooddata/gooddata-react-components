// (C) 2020 GoodData Corporation
enum SnapPoint {
    TopLeft = "tl",
    TopCenter = "tc",
    TopRight = "tr",
    CenterLeft = "cl",
    CenterCenter = "cc",
    CenterRight = "cr",
    BottomLeft = "bl",
    BottomCenter = "bc",
    BottomRight = "br",
}

interface ISnapPoints {
    parent: SnapPoint;
    child: SnapPoint;
}

interface IOffset {
    x?: number;
    y?: number;
}

interface IPositioning {
    snapPoints: ISnapPoints;
    offset?: IOffset;
}

export { ISnapPoints, IOffset, IPositioning, SnapPoint };
