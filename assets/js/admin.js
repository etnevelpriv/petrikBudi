import { Mosdo } from "./mosdo.js";
const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'

let currentEditId = null;

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

    if (currentEditId) {
        const obj = {
            tipus: tipus,
            epulet: epulet,
            emelet: Number(emelet),
            mukodik: mukodik,
            foglalt: foglalt,
            papir: papir,
            csap: csap,
            tisztasag: Number(tisztasag)
        };
        await modifyMosdoByID(currentEditId, obj);
        currentEditId = null;
        resetForm();
        document.getElementById('uploadFormButton').textContent = 'Feltoltes';
    } else {
        const mosdo = new Mosdo(tipus, epulet, Number(emelet), mukodik, foglalt, papir, csap, Number(tisztasag));
        console.log(mosdo.toString())
        await mosdo.postMosdoToDB(URL);
        resetForm();
    }
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
        button.addEventListener('click', () => populateFormWithData(element));
    });
};

const populateFormWithData = function (mosdo) {
    currentEditId = mosdo.id;
    
    document.getElementById('tipusInput').value = mosdo.tipus;
    document.querySelector(`input[name="epulet"][value="${mosdo.epulet}"]`).checked = true;
    document.getElementById('emeletInput').value = mosdo.emelet;
    document.getElementById('mukodikInput').checked = mosdo.mukodik;
    document.getElementById('foglaltInput').checked = mosdo.foglalt;
    document.getElementById('papirInput').checked = mosdo.papir;
    document.getElementById('csapInput').checked = mosdo.csap;
    document.getElementById('tisztasagInput').value = mosdo.tisztasag;
    
    document.getElementById('uploadFormButton').textContent = 'Mentes';
    document.getElementById('szoveg').textContent = 'Modositas';
    
    if (!document.getElementById('deleteFormButton')) {
        const deleteButton = document.createElement('button');
        deleteButton.id = 'deleteFormButton';
        deleteButton.textContent = 'Torles';
        deleteButton.addEventListener('click', async () => {
            await deleteMosdoByID(currentEditId);
            currentEditId = null;
            resetForm();
            document.getElementById('uploadFormButton').textContent = 'Feltoltes';
        });
        document.getElementById('uploadFormButton').parentNode.appendChild(deleteButton);
    }
    
    if (!document.getElementById('backFormButton')) {
        const backButton = document.createElement('button');
        backButton.id = 'backFormButton';
        backButton.textContent = 'Vissza';
        backButton.addEventListener('click', () => {
            currentEditId = null;
            resetForm();
            document.getElementById('uploadFormButton').textContent = 'Feltoltes';
        });
        document.getElementById('uploadFormButton').parentNode.appendChild(backButton);
    }
    
    window.scrollTo(0, 0);
};

const resetForm = function () {
    document.getElementById('tipusInput').value = '';
    document.querySelectorAll('input[name="epulet"]').forEach(el => el.checked = false);
    document.getElementById('emeletInput').value = '';
    document.getElementById('mukodikInput').checked = false;
    document.getElementById('foglaltInput').checked = false;
    document.getElementById('papirInput').checked = false;
    document.getElementById('csapInput').checked = false;
    document.getElementById('tisztasagInput').value = '1';
    
    document.getElementById('szoveg').textContent = 'Feltoltes';
    
    const deleteButton = document.getElementById('deleteFormButton');
    if (deleteButton) {
        deleteButton.remove();
    }
    
    const backButton = document.getElementById('backFormButton');
    if (backButton) {
        backButton.remove();
    }
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
