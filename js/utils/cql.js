export const makeCqlFilter = (fld, operator, value, wildcardpattern) => {
    let cql_filter = "";
    if (operator == "=") {
        cql_filter = `${ fld } = '${ value.replaceAll("'", "''") }'`;
    } else if (operator == "like") {
        cql_filter = `${ fld } like '%${ value.replaceAll("'", "''") }%'`;
    }
    return cql_filter;
};