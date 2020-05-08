// (C) 2020 GoodData Corporation
import path from "path";
import { t as testController } from "testcafe";
import fs from "fs";

export const DOWNLOAD_PATH = "downloads";
export const FileType = {
    EXCEL: 1,
    CSV: 2,
    properties: {
        1: { name: "Excel", code: "xlsx" },
        2: { name: "CSV", code: "csv" },
    },
};

export async function enableDownloadForHeadlessChrome(t) {
    const { browserConnection } = t.testRun;
    const { client } = browserConnection.provider.plugin.openedBrowsers[browserConnection.id];
    const { Page } = client;

    await Promise.all([Page.enable()]);

    await Page.setDownloadBehavior({
        behavior: "allow",
        downloadPath: path.resolve(DOWNLOAD_PATH),
    });
}

export const exportTo = async (type, title) => {
    // max length of title is 50
    const downloadPath = `${DOWNLOAD_PATH}/${title.substring(0, 50)}.${FileType.properties[type].code}`;
    /* eslint-disable no-await-in-loop */
    // Wait 140*500 ms or less
    for (let i = 0; i < 140; i += 1) {
        if (fs.existsSync(downloadPath)) break;
        await testController.wait(500);
    }
    /* eslint-enable no-await-in-loop */
    return downloadPath;
};

export const exportToExcel = async title => {
    return exportTo(FileType.EXCEL, title);
};

export const exportToCSV = async title => {
    return exportTo(FileType.CSV, title);
};
