import { Mosdo } from "./mosdo.js";

const init = async function () {
    const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'
    printMosdok(await fetchGET(URL), URL);
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
        return (await response.json());
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

const deleteMosdoByID = async function (id, url) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            if (response.status == '404') {
                throw new Error(`Nincs ilyen ID valoszinuleg, probalkozz egy masikkal.`);

            };
            throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
        };
        console.log(await response.text())
    } catch (err) {
        throw new Error(err);
    };
};

const printMosdok = function (arr, url) {
    const container = document.getElementById('torlesContainer');
    // console.log(arr)
    arr.forEach(element => {
        const card = document.createElement('div');
        card.classList.add('torles-kartya');
        container.appendChild(card);

        const id = document.createElement('h3');
        id.textContent = element.id;
        card.appendChild(id);

        const name = document.createElement('strong');
        name.textContent = element.helyszin;
        card.appendChild(name);

        const button = document.createElement('button');
        button.textContent = 'Torles';
        card.appendChild(button);
        button.addEventListener('click', () => deleteMosdoByID(element.id, url))
    });
};

document.addEventListener('DOMContentLoaded', init);
