// (C) 2007-2019 GoodData Corporation
import { config } from "./utils/config";
import { loginUsingLoginForm } from "./utils/helpers";
import * as DF from "./utils/dateFilter";
import { Selector, t } from "testcafe";

const allTimeTitle = "All time";

fixture("Date Filter basic interactions")
    .page(config.url)
    .beforeEach(loginUsingLoginForm(`${config.url}/date-filter-component`));

test("Filter button click should open/close the filters", async () => {
    await DF.assertDateFilterBodyVisibility(false);
    await DF.clickDateFilterButton();
    await DF.assertDateFilterBodyVisibility(true);
    await DF.clickDateFilterButton();
    await DF.assertDateFilterButtonText(allTimeTitle);
    await DF.assertDateFilterBodyVisibility(false);
});

test("Filter should close when we click outside of them", async () => {
    await DF.clickDateFilterButton();
    await DF.clickOutside();
    await DF.assertDateFilterButtonText(allTimeTitle);
    await DF.assertDateFilterBodyVisibility(false);
});

test("Filter should close when we click cancel", async () => {
    await DF.clickDateFilterButton();
    await DF.clickCancel();
    await DF.assertDateFilterButtonText(allTimeTitle);
    await DF.assertDateFilterBodyVisibility(false);
});

test("Filter should not be applied when we change filter and press cancel", async () => {
    await DF.assertDateFilterButtonText(allTimeTitle);
    await DF.clickDateFilterButton();
    await DF.clickStaticFilter("this-month");
    await DF.clickCancel();
    await DF.assertDateFilterButtonText(allTimeTitle);
});

test("Reopening all time should keep it selected", async () => {
    await DF.clickDateFilterButton();
    await DF.clickAllTimeFilter();
    await DF.clickApply();
    await DF.assertDateFilterButtonText(allTimeTitle);

    await DF.clickDateFilterButton();
    await DF.assertFilterListItemSelected(DF.allTimeFilterButton);
});

test("Reopening a relative preset should keep it selected", async () => {
    await DF.clickDateFilterButton();
    await DF.clickStaticFilter("last-month");
    await DF.clickApply();
    await DF.assertDateFilterButtonText("Last month");

    await DF.clickDateFilterButton();
    await DF.assertFilterListItemSelected(DF.getStaticFilterSelector("last-month"));
});

test("Reopening an absolute form should keep it selected and filled", async () => {
    const fromInputValue = DF.dateToAbsoluteInputFormat("2019-01-01");
    const toInputValue = DF.dateToAbsoluteInputFormat("2019-01-31");

    await DF.openAbsoluteFormFilter();
    await DF.writeToAbsoluteFormInputFrom(fromInputValue);
    await DF.writeToAbsoluteFormInputTo(toInputValue);
    await DF.clickApply();
    await DF.assertDateFilterButtonText("1/1/2019–1/31/2019");

    await DF.clickDateFilterButton();
    await DF.assertFilterListItemSelected(DF.absoluteFormButton);
    await DF.assertAbsoluteFormFromInputValue(fromInputValue);
    await DF.assertAbsoluteFormToInputValue(toInputValue);
});

test("Reopening a relative form should keep it selected and filled", async t => {
    await DF.openRelativeFormFilter();
    await DF.clickRelativeFormGranularity("year");
    await DF.writeToRelativeFormInputFrom("-2");
    await t.pressKey("enter");
    await DF.writeToRelativeFormInputTo("2");
    await t.pressKey("enter");
    await DF.clickApply();
    await DF.assertDateFilterButtonText("From 2 years ago to 2 years ahead");

    await DF.clickDateFilterButton();
    await DF.assertRelativeFormGranularitySelected("year");
    await DF.assertRelativeFormFromInputValue("2 years ago");
    await DF.assertRelativeFormToInputValue("2 years ahead");
});

fixture
    .only("Date Filter with visualization")
    .page(config.url)
    .beforeEach(loginUsingLoginForm(`${config.url}/date-filter-component`));

test("Applying date should rexecute and filter visualization using the value", async t => {
    const fromInputValue = DF.dateToAbsoluteInputFormat("2016-01-01");
    const toInputValue = DF.dateToAbsoluteInputFormat("2016-01-31");

    const expectedValues = "2,707,184";
    const chartValues = Selector(".highcharts-data-labels");

    await t
        .expect(chartValues.exists)
        .ok()
        .expect(chartValues.textContent)
        .notEql(expectedValues);

    await DF.openAbsoluteFormFilter(1);
    await DF.writeToAbsoluteFormInputFrom(fromInputValue);
    await DF.writeToAbsoluteFormInputTo(toInputValue);
    await DF.clickApply(1);

    await t
        .expect(chartValues.exists)
        .ok()
        .expect(chartValues.textContent)
        .eql(expectedValues);
});
