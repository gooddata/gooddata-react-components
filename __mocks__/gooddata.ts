const execution = {
    getData() {
        return Promise.resolve({
            rawData: [[10000]],
            headers: [{
                id: 'abcd',
                title: 'Attribute',
                type: 'attrLabel',
                uri: '/gdc/md/project/obj/1'
            }]
        });
    },

    getDataForVis() {
        return Promise.resolve({
            rawData: [[10000]],
            headers: [{
                id: 'abcd',
                title: 'Attribute',
                type: 'attrLabel',
                uri: '/gdc/md/project/obj/1'
            }]
        });
    }
};

export {
    execution
};
