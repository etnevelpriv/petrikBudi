import { Mosdo } from "./mosdo.js";

const init = async function () {
    document.getElementById('alert').classList.add('hide');
    const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'
    showMosdok(await fetchGET(URL), URL);
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
    console.log('Elindult a torles folyamata')
    if (await alertModalMegjelenites('Ezzel vegleg torlodni fog a mosdo.')) {
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
                } else if (response.status == '400') {
                    throw new Error(`Ez az utolso adat az adatbazisban, legyszi ne torold ki.`);
                } else {
                throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
                };
            };
            console.log(await response.text())
        } catch (err) {
            throw new Error(err);
        };
    };
};

const showMosdok = function (arr, url) {
    const container = document.getElementById('modositasContainer');
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
        button.textContent = 'Modositas';
        card.appendChild(button);
        button.addEventListener('click', () => modalMegjelenitese(element, url))
    });
};

const modalMegjelenitese = function (mosdo, url) {
    const modal = document.getElementById('modal');
    for (const [key, value] of Object.entries(mosdo)) {

        const container = document.createElement('div');
        container.classList.add('modal-row');
        modal.appendChild(container);

        console.log(`${key}: ${value}`);

        const kulcs = document.createElement('p');
        kulcs.classList.add('modal-kulcs');
        kulcs.textContent = key;

        const ertek = document.createElement('p');
        ertek.classList.add('modal-ertek');
        ertek.textContent = value;

        const gomb = document.createElement('i');
        gomb.classList.add('modal-modositas-gomb', 'fa-solid', 'fa-pen-to-square');
        gomb.addEventListener('click', () => pToInput(key, value, ertek));

        container.appendChild(kulcs);
        container.appendChild(ertek);
        container.appendChild(gomb);

    };

    const container = document.createElement('div');
    container.classList.add('modal-buttons');
    modal.appendChild(container);

    const gombTorles = document.createElement('button');
    gombTorles.classList.add('modal-modositas-gomb');
    gombTorles.textContent = 'Torles';
    gombTorles.addEventListener('click', () => deleteMosdoByID(mosdo.id, url));
    container.appendChild(gombTorles);

    const gombMentes = document.createElement('button');
    gombMentes.classList.add('modal-modositas-gomb');
    gombMentes.textContent = 'Mentes';
    gombMentes.addEventListener('click', () => putMosdoByID(mosdo.id, url));
    container.appendChild(gombMentes);
};

const alertModalMegjelenites = function (szoveg) {
    console.log('Alert modal megjelent')
    return new Promise((resolve, reject) => {
        const alertModal = document.getElementById('alert');
        const visszaGomb = document.getElementById('alertVissza');
        const tovabbGomb = document.getElementById('alertTovabb');
        const p = document.getElementById('alertSzoveg');
        p.textContent = szoveg;
        alertModal.classList.add('show');
        alertModal.classList.remove('hide');
        visszaGomb.addEventListener('click', () => {
            alertModal.classList.remove('show');
            alertModal.classList.add('hide');
            resolve(false);
        });
        tovabbGomb.addEventListener('click', () => {
            alertModal.classList.remove('show');
            alertModal.classList.add('hide');
            resolve(true);
        });
    });
};

document.addEventListener('DOMContentLoaded', init);
