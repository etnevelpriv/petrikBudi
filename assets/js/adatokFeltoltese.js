import { Mosdo } from "./mosdo.js";

const init = async function () {
    const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'
    // fetchGET(URL);
    // fetchDELETE(URL);
    document.getElementById('uploadFormButton').addEventListener('click', () => getFormInputs(URL));
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

const getFormInputs = async function (url) {
    const id = document.getElementById('idInput').value;
    const tipus = document.getElementById('tipusInput').value;
    const helyszin = document.getElementById('helyszinInput').value;
    const mukodik = document.getElementById('mukodikInput').checked;
    const foglalt = document.getElementById('foglaltInput').checked;
    const papir = document.getElementById('papirInput').checked;
    const csap = document.getElementById('csapInput').checked;
    const tisztasag = document.getElementById('tisztasagInput').value;

    const mosdo = new Mosdo(Number(id), tipus, helyszin, mukodik, foglalt, papir, csap, Number(tisztasag));
    console.log(mosdo.toString())
    await mosdo.postMosdoToDB(url);
};

document.addEventListener('DOMContentLoaded', init);
