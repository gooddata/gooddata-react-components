// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";

const CELL_0_3 = ".s-cell-0-3";
const CELL_1_3 = ".s-cell-1-3";
const CELL_0_4 = ".s-cell-0-4";

fixture("Arithmeric Measures").beforeEach(loginUserAndNavigate(`${config.url}/arithmetic-measures`));

test("should render table with ratio calculated", async t => {
    const tableSelector = Selector(".s-ratio-calculated-example");

    await t.expect(tableSelector.find(CELL_0_3).textContent).eql("16,077,036");
    await t.expect(tableSelector.find(CELL_1_3).textContent).eql("7,992,028");
});

test("should render table with change calculated", async t => {
    const tableSelector = Selector(".s-change-calculated-example");

    await t.expect(tableSelector.find(CELL_0_3).textContent).eql("0.67%");
});

test("should render table with sum and difference calculated", async t => {
    const tableSelector = Selector(".s-sum-and-difference-calculated-example");

    await t.expect(tableSelector.find(CELL_0_3).textContent).eql("1,366,548");
    await t.expect(tableSelector.find(CELL_0_4).textContent).eql("241,156");
});

test("should render table with multiplication calculated", async t => {
    const tableSelector = Selector(".s-multiplication-calculated-example");

    await t.expect(tableSelector.find(CELL_0_3).textContent).eql("-58,776");
});

test("should render table with drilling", async t => {
    const drilledValue = Selector(".s-drill-value");
    const tableSelector = Selector(".s-multiplication-calculated-with-drilling-example");

    await t
        .click(Selector(tableSelector.find(CELL_0_3)))
        .expect(drilledValue.textContent)
        .eql("16077036.15");
});
