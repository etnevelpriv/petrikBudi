import { Mosdo } from "./mosdo.js";
const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'

const init = async function () {
    document.getElementById('alert').classList.add('hide');
    await showMosdok();
    document.getElementById('uploadFormButton').addEventListener('click', () => getFormInputs());
};

const fetchGET = async function () {

    try {
        const response = await fetch(URL, {
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

const getFormInputs = async function () {
    const tipus = document.getElementById('tipusInput').value;
    const epulet = document.querySelector('input[name="epulet"]:checked').value;
    const emelet = document.getElementById('emeletInput').value;
    const mukodik = document.getElementById('mukodikInput').checked;
    const foglalt = document.getElementById('foglaltInput').checked;
    const papir = document.getElementById('papirInput').checked;
    const csap = document.getElementById('csapInput').checked;
    const tisztasag = document.getElementById('tisztasagInput').value;

    const mosdo = new Mosdo(tipus, epulet, Number(emelet), mukodik, foglalt, papir, csap, Number(tisztasag));
    console.log(mosdo.toString())
    await mosdo.postMosdoToDB(URL);
    showMosdok();
};

const modifyMosdoByID = async function (id, obj) {
    try {
        const response = await fetch(`${URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        if (!response.ok) {
            throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
        };
        console.log(await response.text());
    } catch (err) {
        throw new Error(err);
    };
    showMosdok();
}; 

const deleteMosdoByID = async function (id) {
    console.log('Elindult a torles folyamata')
    if (await alertModalMegjelenites('Ezzel vegleg torlodni fog a mosdo.')) {
        try {
            const response = await fetch(`${URL}/${id}`, {
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
            document.body.style.overflow = 'scroll';
            document.getElementById('modal').classList.add('hide');
            document.getElementById('modal').classList.remove('show');
            console.log(await response.text())
        } catch (err) {
            throw new Error(err);
        };
        showMosdok();
    };
};

const showMosdok = async function () {
    const arr = await fetchGET();
    const container = document.getElementById('modositasContainer');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    arr.forEach(element => {
        const card = document.createElement('div');
        card.classList.add('torles-kartya');
        container.appendChild(card);

        const name = document.createElement('strong');
        name.textContent = `${element.epulet} épület ${element.emelet}. emelet`;
        card.appendChild(name);

        const button = document.createElement('button');
        button.textContent = 'Modositas';
        card.appendChild(button);
        button.addEventListener('click', () => modalMegjelenitese(element, URL));
    });
};

const modalMegjelenitese = function (mosdo) {
    const modal = document.getElementById('modal');
    document.body.style.overflow = 'hidden';

    while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
    }

    const xButton = document.createElement('button');
    xButton.classList.add('xButton');
    xButton.textContent = 'X';
    xButton.addEventListener('click', () => {
        document.body.style.overflow = 'scroll';
        document.getElementById('modal').classList.add('hide');
        document.getElementById('modal').classList.remove('show');
    });
    modal.appendChild(xButton)

    modal.classList.remove('hide');
    modal.classList.add('show');
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
    gombTorles.addEventListener('click', () => deleteMosdoByID(mosdo.id, URL));
    container.appendChild(gombTorles);

    const gombMentes = document.createElement('button');
    gombMentes.classList.add('modal-modositas-gomb');
    gombMentes.textContent = 'Mentes';
    gombMentes.addEventListener('click', () => putMosdoByID(mosdo.id, URL));
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
