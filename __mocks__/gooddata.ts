const execution = {
    getData() {
        return Promise.resolve({ rawData: [[10000]] });
    },

    getDataForVis() {
        return Promise.resolve({ rawData: [[10000]] });
    }
};

export {
    execution
};
