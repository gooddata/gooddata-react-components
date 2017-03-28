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