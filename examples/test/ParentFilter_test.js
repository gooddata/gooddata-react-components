// (C) 2007-2022 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";

fixture("Parent filter").beforeEach(loginUserAndNavigate(`${config.url}/advanced/parent-filter`));

test("Check if child filters are restricted by parent filters and visualization is properly filtered", async t => {
    const dropdownState = Selector(".s-select-state:not(.is-loading)");
    const dropdownStateList = Selector(".s-select-state:not(.is-loading) .Select-menu");
    //    const stateCalifornia = Selector(".s-select-state:not(.is-loading) .Select-option").withText(
    //        "California",
    //    );
    //
    //    const dropdownCity = Selector(".s-select-city:not(.is-loading)");
    //    const dropdownCityList = Selector(".s-select-city:not(.is-loading) .Select-menu");
    //    const citySanJose = Selector(".s-select-city:not(.is-loading) .Select-option").withText("San Jose");
    //
    //    const labels = Selector(".highcharts-xaxis-labels");

    await t
        .click(dropdownState)
        .expect(dropdownStateList.textContent)
        .eql("AlabamaCaliforniaFloridaNew YorkTexas");

    // Skip this test. There are issues with validElements resource, returning uri instead of url in the response.
    // To fix this, we would need to:
    // * update gooddata-js code with what already is in sdk 8.x https://github.com/gooddata/gooddata-ui-sdk/blob/efd08056da75904585494bada648b0db80246821/libs/api-client-bear/src/xhr.ts#L226
    // * release gooddata-js and use here

    //    await t
    //        .click(stateCalifornia)
    //        .click(dropdownCity)
    //        .expect(dropdownCityList.textContent)
    //        .eql("Daly CityHaywardHighland VillageSan Jose");
    //
    //    await t
    //        .click(citySanJose)
    //        .expect(labels.textContent)
    //        .eql("San Jose - Blossom HillSan Jose - Saratoga");
});
