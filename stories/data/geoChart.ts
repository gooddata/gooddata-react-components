// (C) 2019-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";

const SIZE_DATA: Execution.DataValue[] = [
    "1005",
    "943",
    "179",
    "4726",
    "1719",
    "2844",
    "838",
    "3060",
    "709",
    "772",
    "3949",
    "1766",
    "1560",
    "1938",
    "3836",
    "5302",
    "3310",
    "3500",
    "2288",
    "11564",
    "1381",
    "2627",
    "8732",
    "45703",
    "11107",
    "570",
    "1121",
    "1605",
    "433",
    "869",
    "12064",
    "596",
    "2299",
    "335",
    "1782",
    "1242",
    "150",
    "5602",
    "2282",
    "18",
    "22220",
    "7520",
    "1047",
    "253",
    "116",
    "957",
    "8340",
    "3294",
    "6832",
    "528",
];
const COLOR_DATA: Execution.DataValue[] = [
    "1005",
    "943",
    "179",
    "4726",
    "1719",
    "2844",
    "838",
    "3060",
    "709",
    "772",
    "3949",
    "1766",
    "1560",
    "1938",
    "3836",
    "5302",
    "3310",
    "3500",
    "2288",
    "11564",
    "1381",
    "2627",
    "8732",
    "45703",
    "11107",
    "570",
    "1121",
    "1605",
    "433",
    "869",
    "12064",
    "596",
    "2299",
    "335",
    "1782",
    "1242",
    "150",
    "5602",
    "2282",
    "18",
    "22220",
    "7520",
    "1047",
    "253",
    "116",
    "957",
    "8340",
    "3294",
    "6832",
    "528",
];

const LOCATION_DATA: Execution.IResultAttributeHeaderItem[] = [
    {
        attributeHeaderItem: {
            name: "44.500000;-89.500000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1808",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.000000;-80.500000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1903",
        },
    },
    {
        attributeHeaderItem: {
            name: "44.000000;-72.699997",
            uri: "/gdc/md/projectId/obj/694/elements?id=1870",
        },
    },
    {
        attributeHeaderItem: {
            name: "31.000000;-100.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1895",
        },
    },
    {
        attributeHeaderItem: {
            name: "44.500000;-100.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1844",
        },
    },
    {
        attributeHeaderItem: {
            name: "41.700001;-71.500000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1898",
        },
    },
    {
        attributeHeaderItem: {
            name: "44.000000;-120.500000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1865",
        },
    },
    {
        attributeHeaderItem: {
            name: "43.000000;-75.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1848",
        },
    },
    {
        attributeHeaderItem: {
            name: "44.000000;-71.500000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1885",
        },
    },
    {
        attributeHeaderItem: {
            name: "41.500000;-100.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1878",
        },
    },
    {
        attributeHeaderItem: {
            name: "38.500000;-98.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1833",
        },
    },
    {
        attributeHeaderItem: {
            name: "33.000000;-90.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1892",
        },
    },
    {
        attributeHeaderItem: {
            name: "40.000000;-89.000000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1882",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.000000;-75.500000",
            uri: "/gdc/md/projectId/obj/694/elements?id=1888",
        },
    },
    {
        attributeHeaderItem: {
            name: "41.599998;-72.699997",
            uri: "/gdc/md/projectId/obj/694/elements?id=1928",
        },
    },
    {
        attributeHeaderItem: {
            name: "34.799999;-92.199997",
            uri: "/gdc/md/projectId/obj/694/elements?id=1908",
        },
    },
    {
        attributeHeaderItem: {
            name: "40.273502;-86.126976",
            uri: "/gdc/md/projectId/obj/694/elements?id=1852",
        },
    },
    {
        attributeHeaderItem: {
            name: "38.573936;-92.603760",
            uri: "/gdc/md/projectId/obj/694/elements?id=1915",
        },
    },
    {
        attributeHeaderItem: {
            name: "27.994402;-81.760254",
            uri: "/gdc/md/projectId/obj/694/elements?id=1866",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.876019;-117.224121",
            uri: "/gdc/md/projectId/obj/694/elements?id=1886",
        },
    },
    {
        attributeHeaderItem: {
            name: "45.367584;-68.972168",
            uri: "/gdc/md/projectId/obj/694/elements?id=1902",
        },
    },
    {
        attributeHeaderItem: {
            name: "44.182205;-84.506836",
            uri: "/gdc/md/projectId/obj/694/elements?id=1857",
        },
    },
    {
        attributeHeaderItem: {
            name: "33.247875;-83.441162",
            uri: "/gdc/md/projectId/obj/694/elements?id=1817",
        },
    },
    {
        attributeHeaderItem: {
            name: "20.716179;-158.214676",
            uri: "/gdc/md/projectId/obj/694/elements?id=1925",
        },
    },
    {
        attributeHeaderItem: {
            name: "66.160507;-153.369141",
            uri: "/gdc/md/projectId/obj/694/elements?id=1851",
        },
    },
    {
        attributeHeaderItem: {
            name: "35.860119;-86.660156",
            uri: "/gdc/md/projectId/obj/694/elements?id=1927",
        },
    },
    {
        attributeHeaderItem: {
            name: "37.926868;-78.024902",
            uri: "/gdc/md/projectId/obj/694/elements?id=1874",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.833851;-74.871826",
            uri: "/gdc/md/projectId/obj/694/elements?id=1839",
        },
    },
    {
        attributeHeaderItem: {
            name: "37.839333;-84.270020",
            uri: "/gdc/md/projectId/obj/694/elements?id=1930",
        },
    },
    {
        attributeHeaderItem: {
            name: "47.650589;-100.437012",
            uri: "/gdc/md/projectId/obj/694/elements?id=1841",
        },
    },
    {
        attributeHeaderItem: {
            name: "46.392410;-94.636230",
            uri: "/gdc/md/projectId/obj/694/elements?id=1818",
        },
    },
    {
        attributeHeaderItem: {
            name: "36.084621;-96.921387",
            uri: "/gdc/md/projectId/obj/694/elements?id=1854",
        },
    },
    {
        attributeHeaderItem: {
            name: "46.965260;-109.533691",
            uri: "/gdc/md/projectId/obj/694/elements?id=1807",
        },
    },
    {
        attributeHeaderItem: {
            name: "47.751076;-120.740135",
            uri: "/gdc/md/projectId/obj/694/elements?id=1847",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.419220;-111.950684",
            uri: "/gdc/md/projectId/obj/694/elements?id=1871",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.113014;-105.358887",
            uri: "/gdc/md/projectId/obj/694/elements?id=1834",
        },
    },
    {
        attributeHeaderItem: {
            name: "40.367474;-82.996216",
            uri: "/gdc/md/projectId/obj/694/elements?id=1836",
        },
    },
    {
        attributeHeaderItem: {
            name: "32.318230;-86.902298",
            uri: "/gdc/md/projectId/obj/694/elements?id=1921",
        },
    },
    {
        attributeHeaderItem: {
            name: "42.032974;-93.581543",
            uri: "/gdc/md/projectId/obj/694/elements?id=1863",
        },
    },
    {
        attributeHeaderItem: {
            name: "34.307144;-106.018066",
            uri: "/gdc/md/projectId/obj/694/elements?id=1891",
        },
    },
    {
        attributeHeaderItem: {
            name: "33.836082;-81.163727",
            uri: "/gdc/md/projectId/obj/694/elements?id=1914",
        },
    },
    {
        attributeHeaderItem: {
            name: "41.203323;-77.194527",
            uri: "/gdc/md/projectId/obj/694/elements?id=1907",
        },
    },
    {
        attributeHeaderItem: {
            name: "34.048927;-111.093735",
            uri: "/gdc/md/projectId/obj/694/elements?id=1916",
        },
    },
    {
        attributeHeaderItem: {
            name: "39.045753;-76.641273",
            uri: "/gdc/md/projectId/obj/694/elements?id=1901",
        },
    },
    {
        attributeHeaderItem: {
            name: "42.407211;-71.382439",
            uri: "/gdc/md/projectId/obj/694/elements?id=1887",
        },
    },
    {
        attributeHeaderItem: {
            name: "36.778259;-119.417931",
            uri: "/gdc/md/projectId/obj/694/elements?id=1910",
        },
    },
    {
        attributeHeaderItem: {
            name: "44.068203;-114.742043",
            uri: "/gdc/md/projectId/obj/694/elements?id=1926",
        },
    },
    {
        attributeHeaderItem: {
            name: "43.075970;-107.290283",
            uri: "/gdc/md/projectId/obj/694/elements?id=1913",
        },
    },
    {
        attributeHeaderItem: {
            name: "35.782169;-80.793457",
            uri: "/gdc/md/projectId/obj/694/elements?id=1896",
        },
    },
    {
        attributeHeaderItem: {
            name: "30.391830;-92.329102",
            uri: "/gdc/md/projectId/obj/694/elements?id=1912",
        },
    },
];
const SEGMENT_BY_DATA: Execution.IResultAttributeHeaderItem[] = [
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "General Goods",
            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
    {
        attributeHeaderItem: {
            name: "Toy Store",
            uri: "/gdc/md/projectId/obj/790/elements?id=2029",
        },
    },
];
const TOOLTIP_TEXT_DATA: Execution.IResultAttributeHeaderItem[] = [
    {
        attributeHeaderItem: {
            name: "Wisconsin",
            uri: "/gdc/md/projectId/obj/694/elements?id=1808",
        },
    },
    {
        attributeHeaderItem: {
            name: "West Virginia",
            uri: "/gdc/md/projectId/obj/694/elements?id=1903",
        },
    },
    {
        attributeHeaderItem: {
            name: "Vermont",
            uri: "/gdc/md/projectId/obj/694/elements?id=1870",
        },
    },
    {
        attributeHeaderItem: {
            name: "Texas",
            uri: "/gdc/md/projectId/obj/694/elements?id=1895",
        },
    },
    {
        attributeHeaderItem: {
            name: "South Dakota",
            uri: "/gdc/md/projectId/obj/694/elements?id=1844",
        },
    },
    {
        attributeHeaderItem: {
            name: "Rhode Island",
            uri: "/gdc/md/projectId/obj/694/elements?id=1898",
        },
    },
    {
        attributeHeaderItem: {
            name: "Oregon",
            uri: "/gdc/md/projectId/obj/694/elements?id=1865",
        },
    },
    {
        attributeHeaderItem: {
            name: "New York",
            uri: "/gdc/md/projectId/obj/694/elements?id=1848",
        },
    },
    {
        attributeHeaderItem: {
            name: "New Hempshire",
            uri: "/gdc/md/projectId/obj/694/elements?id=1885",
        },
    },
    {
        attributeHeaderItem: {
            name: "Nebraska",
            uri: "/gdc/md/projectId/obj/694/elements?id=1878",
        },
    },
    {
        attributeHeaderItem: {
            name: "Kansas",
            uri: "/gdc/md/projectId/obj/694/elements?id=1833",
        },
    },
    {
        attributeHeaderItem: {
            name: "Mississippi",
            uri: "/gdc/md/projectId/obj/694/elements?id=1892",
        },
    },
    {
        attributeHeaderItem: {
            name: "Illinois",
            uri: "/gdc/md/projectId/obj/694/elements?id=1882",
        },
    },
    {
        attributeHeaderItem: {
            name: "Delaware",
            uri: "/gdc/md/projectId/obj/694/elements?id=1928",
        },
    },
    {
        attributeHeaderItem: {
            name: "Connecticut",
            uri: "/gdc/md/projectId/obj/694/elements?id=1908",
        },
    },
    {
        attributeHeaderItem: {
            name: "Arkansas",
            uri: "/gdc/md/projectId/obj/694/elements?id=1852",
        },
    },
    {
        attributeHeaderItem: {
            name: "Indiana",
            uri: "/gdc/md/projectId/obj/694/elements?id=1915",
        },
    },
    {
        attributeHeaderItem: {
            name: "Missouri",
            uri: "/gdc/md/projectId/obj/694/elements?id=1866",
        },
    },
    {
        attributeHeaderItem: {
            name: "Florida",
            uri: "/gdc/md/projectId/obj/694/elements?id=1886",
        },
    },
    {
        attributeHeaderItem: {
            name: "Nevada",
            uri: "/gdc/md/projectId/obj/694/elements?id=1902",
        },
    },
    {
        attributeHeaderItem: {
            name: "Maine",
            uri: "/gdc/md/projectId/obj/694/elements?id=1857",
        },
    },
    {
        attributeHeaderItem: {
            name: "Michigan",
            uri: "/gdc/md/projectId/obj/694/elements?id=1817",
        },
    },
    {
        attributeHeaderItem: {
            name: "Georgia",
            uri: "/gdc/md/projectId/obj/694/elements?id=1925",
        },
    },
    {
        attributeHeaderItem: {
            name: "Hawaii",
            uri: "/gdc/md/projectId/obj/694/elements?id=1851",
        },
    },
    {
        attributeHeaderItem: {
            name: "Alaska",
            uri: "/gdc/md/projectId/obj/694/elements?id=1927",
        },
    },
    {
        attributeHeaderItem: {
            name: "Tennessee",
            uri: "/gdc/md/projectId/obj/694/elements?id=1874",
        },
    },
    {
        attributeHeaderItem: {
            name: "New Jersey",
            uri: "/gdc/md/projectId/obj/694/elements?id=1839",
        },
    },
    {
        attributeHeaderItem: {
            name: "Kentucky",
            uri: "/gdc/md/projectId/obj/694/elements?id=1930",
        },
    },
    {
        attributeHeaderItem: {
            name: "North Dakota",
            uri: "/gdc/md/projectId/obj/694/elements?id=1841",
        },
    },
    {
        attributeHeaderItem: {
            name: "Minnesota",
            uri: "/gdc/md/projectId/obj/694/elements?id=1818",
        },
    },
    {
        attributeHeaderItem: {
            name: "Oklahoma",
            uri: "/gdc/md/projectId/obj/694/elements?id=1854",
        },
    },
    {
        attributeHeaderItem: {
            name: "Montana",
            uri: "/gdc/md/projectId/obj/694/elements?id=1807",
        },
    },
    {
        attributeHeaderItem: {
            name: "Washington",
            uri: "/gdc/md/projectId/obj/694/elements?id=1847",
        },
    },
    {
        attributeHeaderItem: {
            name: "Utah",
            uri: "/gdc/md/projectId/obj/694/elements?id=1871",
        },
    },
    {
        attributeHeaderItem: {
            name: "Colorado",
            uri: "/gdc/md/projectId/obj/694/elements?id=1834",
        },
    },
    {
        attributeHeaderItem: {
            name: "Ohio",
            uri: "/gdc/md/projectId/obj/694/elements?id=1836",
        },
    },
    {
        attributeHeaderItem: {
            name: "Utah",
            uri: "/gdc/md/projectId/obj/694/elements?id=1921",
        },
    },
    {
        attributeHeaderItem: {
            name: "Iowa",
            uri: "/gdc/md/projectId/obj/694/elements?id=1863",
        },
    },
    {
        attributeHeaderItem: {
            name: "New Mexico",
            uri: "/gdc/md/projectId/obj/694/elements?id=1891",
        },
    },
    {
        attributeHeaderItem: {
            name: "South Carolina",
            uri: "/gdc/md/projectId/obj/694/elements?id=1914",
        },
    },
    {
        attributeHeaderItem: {
            name: "Pennsylvania",
            uri: "/gdc/md/projectId/obj/694/elements?id=1907",
        },
    },
    {
        attributeHeaderItem: {
            name: "Arizona",
            uri: "/gdc/md/projectId/obj/694/elements?id=1916",
        },
    },
    {
        attributeHeaderItem: {
            name: "Marryland",
            uri: "/gdc/md/projectId/obj/694/elements?id=1901",
        },
    },
    {
        attributeHeaderItem: {
            name: "Massachusetts",
            uri: "/gdc/md/projectId/obj/694/elements?id=1887",
        },
    },
    {
        attributeHeaderItem: {
            name: "California",
            uri: "/gdc/md/projectId/obj/694/elements?id=1910",
        },
    },
    {
        attributeHeaderItem: {
            name: "Idaho",
            uri: "/gdc/md/projectId/obj/694/elements?id=1926",
        },
    },
    {
        attributeHeaderItem: {
            name: "Wyoming",
            uri: "/gdc/md/projectId/obj/694/elements?id=1913",
        },
    },
    {
        attributeHeaderItem: {
            name: "North Carolina",
            uri: "/gdc/md/projectId/obj/694/elements?id=1896",
        },
    },
    {
        attributeHeaderItem: {
            name: "Louisiana",
            uri: "/gdc/md/projectId/obj/694/elements?id=1913",
        },
    },
    {
        attributeHeaderItem: {
            name: "Waikapu",
            uri: "/gdc/md/projectId/obj/694/elements?id=1896",
        },
    },
];

export function getExecutionResult(
    isWithLocation = false,
    isWithSegmentBy = false,
    isWithTooltipText = false,
    isWithSize = false,
    isWithColor = false,
): Execution.IExecutionResult {
    const data = [];
    const metricHeaderItems: Execution.IResultMeasureHeaderItem[] = [];
    const attrHeaderItems: Execution.IResultAttributeHeaderItem[][] = [];

    if (isWithSize) {
        data.push(SIZE_DATA);
        metricHeaderItems.push({
            measureHeaderItem: {
                name: "PushPin Value [Size]",
                order: 0,
            },
        });
    }

    if (isWithColor) {
        data.push(COLOR_DATA);
        metricHeaderItems.push({
            measureHeaderItem: {
                name: "PushPin Value [Color]",
                order: isWithSize ? 1 : 0,
            },
        });
    }

    if (isWithLocation) {
        attrHeaderItems.push(LOCATION_DATA);
    }

    if (isWithSegmentBy) {
        attrHeaderItems.push(SEGMENT_BY_DATA);
    }

    if (isWithTooltipText) {
        attrHeaderItems.push(TOOLTIP_TEXT_DATA);
    }

    const headerItems: Execution.IResultHeaderItem[][][] = [[...attrHeaderItems]];

    if (metricHeaderItems.length) {
        headerItems.unshift([metricHeaderItems]);
    }

    return {
        data,
        paging: {
            count: [2, 50],
            offset: [0, 0],
            total: [2, 50],
        },
        headerItems,
    };
}
