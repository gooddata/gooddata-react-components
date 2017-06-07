# Filter

`Filter = DateFilter | AttributeFilter`

## DateFilter
```js
DateFilter {
    id: string; // dateDataSet URI
    type: 'date';
    between: [string, string] | [number, number];
    granularity: string;
}
```
## AttributeFilter
`AttributeFilter = PositiveAttributeFilter | NegativeAttributeFilter`

### PositiveAttributeFilter
```js
PositiveAttributeFilter {
    id: string; // dateDataSet URI or attribute displayForm URI
    type: 'attribute';
    in: string[]; // attribute elements IDs
}
```

### NegativeAttributeFilter
```js
NegativeAttributeFilter {
    id: string; // dateDataSet URI or attribute displayForm URI
    type: 'attribute';
    notIn: string[]; // attribute elements IDs
}
```