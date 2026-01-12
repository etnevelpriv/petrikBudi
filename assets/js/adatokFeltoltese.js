import { Mosdo } from "./mosdo.js";

const init = async function () {
    const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'
    // fetchGET(URL);
    // fetchPUT(URL);
};

const fetchGET = async function (url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
        };
        const databaseArray = await response.json()
        // fetchDELETE(url, databaseArray)
    } catch (err) {
        throw new Error(err);
    };
};

const fetchDELETE = async function (url, arr) {

    const id = 50;
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
        };
        console.log(await response.text())
    } catch (err) {
        throw new Error(err);
    };
};

const getFormInputs = function () {
    const id = document.getElementById('idInput');
    const tipus = document.getElementById('tipusInput');
    const helyszin = document.getElementById('helyszinInput');
    const mukodik = document.getElementById('mukodikInput');
    const foglalt = document.getElementById('foglaltInput');
    const papir = document.getElementById('papirInput');
    const csap = document.getElementById('csapInput');
    const tisztasag = document.getElementById('tisztasagInput');

    const idValue = id.value;
    const tipusValue = tipus.value;
    const helyszinValue = helyszin.value;
    const mukodikValue = mukodik.checked;
    const foglaltValue = foglalt.checked;
    const papirValue = papir.checked;
    const csapValue = csap.checked;
    const tisztasagValue = tisztasag.value;

    const idName = id.name;
    const tipusName = tipus.name;
    const helyszinName = helyszin.name;
    const mukodikName = helyszin.name;
    const foglaltName = helyszin.name;
    const papirPapir = helyszin.name;
    const csapPapir = helyszin.name;
    const tisztasagPapir = tisztasag.name;

    const mosdo = new Mosdo(Number(id.value), tipus.value, helyszin.value, mukodik.checked, foglalt.checked, papir.checked, csap.checked, Number(tisztasag.value));
    console.log(mosdo.toString())
    console.log(`gatya`)
};

const fetchPUT = async function () {

};

document.addEventListener('DOMContentLoaded', init);
document.getElementById('uploadFormButton').addEventListener('click', getFormInputs);