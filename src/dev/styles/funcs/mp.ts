import { defaultTo } from "es-toolkit/compat";
import { CSSProperties } from "react";

export type mpProps = {
    mt?: number | string; // margin-top，可选
    mb?: number | string; // margin-bottom，可选
    ml?: number | string; // margin-left，可选
    mr?: number | string; // margin-right，可选
    pt?: number | string; // padding-top，可选
    pb?: number | string; // padding-bottom，可选
    pl?: number | string; // padding-left，可选
    pr?: number | string; // padding-right，可选
};

export const mpGet = (props?: mpProps): CSSProperties => {
    return {
        marginTop: defaultTo(props?.mt, 0),
        marginBottom: defaultTo(props?.mb, 0),
        marginLeft: defaultTo(props?.ml, 0),
        marginRight: defaultTo(props?.mr, 0),
        paddingTop: defaultTo(props?.pt, 0),
        paddingBottom: defaultTo(props?.pb, 0),
        paddingLeft: defaultTo(props?.pl, 0),
        paddingRight: defaultTo(props?.pr, 0),
    };
};

export const mpBlankCss = {
    margin: 0,
    padding: 0,
}

export const mpBlank = {
    mt: 0,
    mb: 0,
    ml: 0,
    mr: 0,
    pt: 0,
    pb: 0,
    pl: 0,
    pr: 0
}

