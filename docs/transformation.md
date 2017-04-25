# Transformation

## Sorting
```
{
    sorting: [
        {
            column: 'measure_id',
            direction: 'asc'
        },
        {
            column: 'attribute_uri',
            direction: 'desc'
        }
    ]
}
```

## Measure visual customization
We currently support only `title` and `format`.
```
{
    measures: [
        {
            id: 'measure_id',
            title: 'Measure M1',
            format: '#,##0.00'
        }
    ]
}
```

## Buckets
`buckets` are in fact dimensions by which you would like to organize result data. In each bucket could be one or more attributes. Metrics are not allowed here. Is possible to use here special id `metricGroup` which usage places metric titles to chosen `bucket` and have influence to way how are result data organized.

### Definition

```
buckets: [
    {
        name: STRING,
        attributes: [
            {
                id: STRING,
                (title: STRING)?
            }
        ]
    },
    ...
]
```
Notes:
* each bucket must have `name` to be recognized in result data
* each attribute must have `id` to uniquely identify used attribute, adapter must recognize it
* each attribute could have `title` to override native attribute title

### Stacked bar chart
Bucket `name`s, in this example 'series' and 'stacks' are entirely up to user to define them.
```
{
    measures: [
        {
            id: 'measure_id',
            title: 'Measure M1',
            format: '#,##0.00'
        }
    ],
    buckets: [
        {
            name: 'series',
            attributes: [
                {
                    id: 'year_id',
                    title: 'Year'
                }
            ]
        },
        {
            name: 'stacks',
            attributes: [
                {
                    id: 'city_id',
                    title: 'City'
                }
            ]
        }
    ]
}
```