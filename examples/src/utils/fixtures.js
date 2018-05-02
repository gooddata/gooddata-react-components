// (C) 2007-2018 GoodData Corporation

const demoProject = {
    'https://secure.gooddata.com': 'k26dtejorcqlqf11crn6imbeevp2q4kg',
    'https://staging3.intgdc.com': 'kytra720hke4d84e8ozohoz7uycn53mi',
    'https://staging2.intgdc.com': 'ws7pxsamkx8o0t1s7kfvkj5o41uwcmqg',
    'https://staging.intgdc.com': '',
    'https://client-demo-be.na.intgdc.com': '',
    'https://developer.na.gooddata.com': 'xms7ga4tf3g3nzucd8380o2bev8oeknp'
};

const backendUri = BACKEND_URI; // eslint-disable-line no-undef
const demoProjectId = demoProject[backendUri];
if (!demoProjectId) {
    console.error(`[fixtures.js] ProjectId for backend "${backendUri}" is not in `, demoProject); // eslint-disable-line no-console
}

console.log('The /gdc proxy is connected to: ', backendUri, ' with projectId: ', demoProjectId); // eslint-disable-line no-console


// your projectId would be probably static (you may ignore the code above)

export const backendUriOnlyInfo = backendUri;
export const projectId = demoProjectId;

export const averageCheckSizeByServer = 'afewRzGAersh';
export const averageDailyTotalSales = 'aagJGHg1bxap';
export const columnVisualizationIdentifier = 'acFJltTsifSQ';
export const dateDatasetIdentifier = 'date.dataset.dt';
export const employeeNameIdentifier = 'label.employee.employeename';
export const franchiseFeesAdRoyaltyIdentifier = 'aabHeqImaK0d';
export const franchiseFeesIdentifier = 'aaEGaXAEgB7U';
export const franchiseFeesIdentifierOngoingRoyalty = 'aaWGcgnsfxIg';
export const franchiseFeesInitialFranchiseFeeIdentifier = 'aaDHcv6wevkl';
export const franchiseFeesTag = 'franchise_fees';
export const franchiseFeesVisualizationIdentifier = 'aahnVeLugyFj';
export const locationCityAttributeIdentifier = 'attr.restaurantlocation.locationcity';
export const locationCityAttributeUri = '/gdc/md/k26dtejorcqlqf11crn6imbeevp2q4kg/obj/2208';
export const locationCityDisplayFormIdentifier = 'label.restaurantlocation.locationcity';
export const locationIdAttributeIdentifier = 'attr.restaurantlocation.locationid';
export const locationNameAttributeUri = '/gdc/md/k26dtejorcqlqf11crn6imbeevp2q4kg/obj/2204';
export const locationNameDisplayFormIdentifier = 'label.restaurantlocation.locationname';
export const locationResortIdentifier = 'label.restaurantlocation.locationresort';
export const locationStateAttributeIdentifier = 'attr.restaurantlocation.locationstate';
export const locationStateAttributeUri = '/gdc/md/k26dtejorcqlqf11crn6imbeevp2q4kg/obj/2210';
export const locationStateDisplayFormIdentifier = 'label.restaurantlocation.locationstate';
export const menuCategoryAttributeDFIdentifier = 'label.menuitem.menucategory';
export const menuItemNameAttributeDFIdentifier = 'label.menuitem.menuitemname';
export const monthDateIdentifier = 'date.abm81lMifn6q';
export const tableVisualizationIdentifier = 'aatFRvXBdilm';
export const totalSalesIdentifier = 'aa7ulGyKhIE5';


/* eslint-disable max-len */

// import { get } from 'lodash';
// import { catalog } from './catalog';

// export const { projectId } = catalog;

// export const totalSalesIdentifier = get(catalog, 'measures[$ Total Sales].identifier');
// export const franchiseFeesIdentifier = get(catalog, 'measures[$ Franchise Fees].identifier');
// export const franchiseFeesAdRoyaltyIdentifier = get(catalog, 'measures[$ Franchise Fees (Ad Royalty)].identifier');
// export const franchiseFeesInitialFranchiseFeeIdentifier = get(catalog, 'measures[$ Franchise Fees (Initial Franchise Fee)].identifier');
// export const franchiseFeesIdentifierOngoingRoyalty = get(catalog, 'measures[$ Franchise Fees (Ongoing Royalty)].identifier');
// export const averageDailyTotalSales = get(catalog, 'measures[$ Avg Daily Total Sales].identifier');
// export const averageCheckSizeByServer = get(catalog, 'measures[Avg Check Size by Server].identifier');
//
// export const monthDateIdentifier = get(catalog, 'dateDataSets[Date (Date)].attributes[Month (Date)].displayForms[Short (Jan) (Date)].identifier');
// export const dateDatasetIdentifier = get(catalog, 'dateDataSets[Date (Date)].identifier');
//
// export const locationStateAttributeIdentifier = get(catalog, 'attributes[Location State].identifier');
// export const locationStateAttributeUri = `/gdc/md/${projectId}/obj/2210`;
// export const locationStateDisplayFormIdentifier = get(catalog, 'attributes[Location State].defaultDisplayForm.identifier');
//
// export const locationCityAttributeIdentifier = get(catalog, 'attributes[Location City].identifier');
// export const locationCityAttributeUri = `/gdc/md/${projectId}/obj/2208`;
// export const locationCityDisplayFormIdentifier = get(catalog, 'attributes[Location City].defaultDisplayForm.identifier');
//
// export const locationIdAttributeIdentifier = get(catalog, 'attributes[Location Id].identifier');
//
// export const locationNameDisplayFormIdentifier = get(catalog, 'attributes[Location Name].defaultDisplayForm.identifier');
// export const locationNameAttributeUri = `/gdc/md/${projectId}/obj/2204`;
//
// export const locationResortIdentifier = get(catalog, 'attributes[Location Resort].defaultDisplayForm.identifier');
//
// export const employeeNameIdentifier = get(catalog, 'attributes[Employee Name].defaultDisplayForm.identifier');
// export const menuItemNameAttributeDFIdentifier = get(catalog, 'attributes[Menu Item Name].defaultDisplayForm.identifier');
// export const menuCategoryAttributeDFIdentifier = get(catalog, 'attributes[Menu Category].defaultDisplayForm.identifier');
//
// export const tableVisualizationIdentifier = get(catalog, 'visualizations[Table report Labor Costs Vs Scheduled Costs].identifier');
// export const columnVisualizationIdentifier = get(catalog, 'visualizations[Sales over Time].identifier');
// export const franchiseFeesVisualizationIdentifier = get(catalog, 'visualizations[Franchise Fees].identifier');
//
//
// export const franchiseFeesTag = 'franchise_fees';
