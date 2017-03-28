# AFM definition

AFM (attribute - fiter - measure) is unified input for GoodData data layer and describes what data you want to execute. It is defined by simple structure:
```
{
    attributes: [].
    measures: [],
    filters: []
}
```

## Examples

### Simple measure
```
{
    measures: [
        {
            id: 'your-custom-id',
            definition: {
                baseObject: {
                    id: '/uri/to/gooddata/metric
                }
            }
        }
    ]
}
```

### Measure with global filters
```
{
    measures: [
        {
            id: 'your-custom-id',
            definition: {
                baseObject: {
                    id: '/uri/to/gooddata/metric
                }
            }
        }
    ],
    filters: [
        {
            id: '/uri/to/gooddata/attribute
            type: 'attribute'
            notIn: [
                '1', '2', '3'
            ]
        },
        {
            id: '/uri/to/gooddata/date
            type: 'date'
            between: [0, -11],
            granularity: 'month'
        }
    ]
}
```

## Complex measure
```
{
    measures: [
        {
            id: 'your-custom-id',
            definition: {
                baseObject: {
                    id: '/uri/to/gooddata/fact
                },
                aggregation: 'COUNT',
                filters: {
                    id: '/uri/to/gooddata/attribute',
                    in: ['1', '2']
                },
                showInPercent: true
            }
        }
    ]
}
```

## Period over period with measure defined directly from URI
```
{
    measures: [
        {
            id: 'this-year-measure-id',
            definition: {
                baseObject: {
                    id: '/uri/to/gooddata/metric'
                }
            }
        },
        {
            id: 'this-year-measure-id',
            definition: {
                baseObject: {
                    id: '/uri/to/gooddata/metric'
                },
                popAttribute: {
                    id: '/uri/to/gooddata/date'
                }
            }
        }
    ],
    attributes: [
        {
            id: /uri/to/gdc/date
        }
    ]
}
```

## Period over period with measure defined by reference in AFM
```
{
    measures: [
        {
            id: 'filtered-measure-id',
            definition: {
                baseObject: {
                    id: '/uri/to/gooddata/metric'
                },
                filters: {
                    id: '/uri/to/gooddata/attribute',
                    in: ['1', '2']
                }
            }
        },
        {
            id: 'this-year-measure-id',
            definition: {
                baseObject: {
                    lookupId: 'filtered-measure-id'
                },
                popAttribute: {
                    id: '/uri/to/gooddata/date'
                }
            }
        }
    ],
    attributes: [
        {
            id: /uri/to/gdc/date
        }
    ]
}
```


## Tips & Notes
* Both global and measure filters can use `in` or `notIn` and are always interpreted as `f1 AND f2 AND f3...`
* All attributes, popAttribute and filters are defined via display form URI!
