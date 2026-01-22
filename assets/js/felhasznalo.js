const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'

let currentEditingMosdo = null;

const init = async () => {
    document.getElementById('reloadBudik').addEventListener('click', () => showMosdok());
    await showMosdok();
}

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

const showMosdok = async function () {
    const arr = await fetchGET();
    const aEpulet = document.getElementById('aEpulet');
    const bEpulet = document.getElementById('bEpulet');
    
    while (aEpulet.firstChild) {
        aEpulet.removeChild(aEpulet.firstChild);
    }
    while (bEpulet.firstChild) {
        bEpulet.removeChild(bEpulet.firstChild);
    }
    
    const aTitle = document.createElement('h2');
    aTitle.textContent = 'A Épület';
    aEpulet.appendChild(aTitle);
    
    const bTitle = document.createElement('h2');
    bTitle.textContent = 'B Épület';
    bEpulet.appendChild(bTitle);
    
    const aContainer = document.createElement('div');
    aContainer.classList.add('kartya-container');
    aEpulet.appendChild(aContainer);
    
    const bContainer = document.createElement('div');
    bContainer.classList.add('kartya-container');
    bEpulet.appendChild(bContainer);
    
    arr.forEach(element => {
        const card = document.createElement('div');
        card.classList.add('mosdo-kartya');
        
        const tipus = document.createElement('h3');
        tipus.textContent = element.tipus;
        card.appendChild(tipus);
        
        const epuletEmelet = document.createElement('p');
        epuletEmelet.classList.add('info-text');
        epuletEmelet.textContent = `${element.epulet} épület ${element.emelet}. emelet`;
        card.appendChild(epuletEmelet);
        
        const mukodik = document.createElement('p');
        mukodik.classList.add('info-text');
        mukodik.textContent = `Mukodik: ${element.mukodik ? 'Igen' : 'Nem'}`;
        card.appendChild(mukodik);
        
        const foglalt = document.createElement('p');
        foglalt.classList.add('info-text');
        foglalt.textContent = `Foglalt: ${element.foglalt ? 'Igen' : 'Nem'}`;
        card.appendChild(foglalt);
        
        const papir = document.createElement('p');
        papir.classList.add('info-text');
        papir.textContent = `WC papir: ${element.papir ? 'Igen' : 'Nem'}`;
        card.appendChild(papir);
        
        const csap = document.createElement('p');
        csap.classList.add('info-text');
        csap.textContent = `Csap: ${element.csap ? 'Igen' : 'Nem'}`;
        card.appendChild(csap);
        
        const tisztasag = document.createElement('p');
        tisztasag.classList.add('info-text');
        tisztasag.textContent = `Tisztasag: ${element.tisztasag}/5`;
        card.appendChild(tisztasag);

        const modositas = document.createElement('button');
        modositas.textContent = 'Modositas';
        modositas.addEventListener('click', () => modalMegjelenitese(element, URL));
        card.appendChild(modositas);
        
        if (element.epulet === 'A') {
            aContainer.appendChild(card);
        } else {
            bContainer.appendChild(card);
        }
    });
};



const modalMegjelenitese = function (mosdo, url) {
    const modal = document.getElementById('modal');
    document.body.style.overflow = 'hidden';
    currentEditingMosdo = { ...mosdo };

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
        currentEditingMosdo = null;
    });
    modal.appendChild(xButton)

    modal.classList.remove('hide');
    modal.classList.add('show');
    
    const allowedFields = ['mukodik', 'foglalt', 'papir', 'csap', 'tisztasag'];
    
    for (const [key, value] of Object.entries(mosdo)) {
        if (!allowedFields.includes(key)) continue;

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

const pToInput = function (key, value, erekElement) {
    const input = document.createElement('input');
    input.type = (key === 'tisztasag') ? 'number' : 'checkbox';
    
    if (key === 'tisztasag') {
        input.value = value;
        input.min = '1';
        input.max = '5';
    } else {
        input.checked = value;
    }
    
    erekElement.replaceWith(input);
    input.focus();
    
    const saveChange = () => {
        if (key === 'tisztasag') {
            const numValue = parseInt(input.value);
            if (numValue < 1 || numValue > 5) {
                alert('Tisztasag ertekenek 1 es 5 kozott kell lennie!');
                return;
            }
            currentEditingMosdo[key] = numValue;
            erekElement.textContent = numValue;
        } else {
            currentEditingMosdo[key] = input.checked;
            erekElement.textContent = input.checked ? 'Igen' : 'Nem';
        }
        input.replaceWith(erekElement);
    };
    
    input.addEventListener('blur', saveChange);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveChange();
    });
};

const putMosdoByID = async function (id, url) {
    try {
        if (!currentEditingMosdo) {
            throw new Error('Nincs szerkesztett adat');
        }

        const obj = {
            tipus: currentEditingMosdo.tipus,
            epulet: currentEditingMosdo.epulet,
            emelet: currentEditingMosdo.emelet,
            mukodik: currentEditingMosdo.mukodik,
            foglalt: currentEditingMosdo.foglalt,
            papir: currentEditingMosdo.papir,
            csap: currentEditingMosdo.csap,
            tisztasag: currentEditingMosdo.tisztasag
        };

        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        
        if (!response.ok) {
            throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
        }

        console.log('Mosdo sikeresen modositva');
        document.body.style.overflow = 'scroll';
        document.getElementById('modal').classList.add('hide');
        document.getElementById('modal').classList.remove('show');
        currentEditingMosdo = null;
        await showMosdok();
    } catch (err) {
        alert(`Hiba a menteskor: ${err.message}`);
        console.error(err);
    }
};

const deleteMosdoByID = async function (id, url) {
    try {
        const confirmed = confirm('Biztosan torold ki ezt a mosdot?');
        if (!confirmed) {
            return;
        }

        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
        }

        console.log('Mosdo sikeresen torolve');
        document.body.style.overflow = 'scroll';
        document.getElementById('modal').classList.add('hide');
        document.getElementById('modal').classList.remove('show');
        currentEditingMosdo = null;
        await showMosdok();
    } catch (err) {
        alert(`Hiba a torldes kozeban: ${err.message}`);
        console.error(err);
    }
};

document.addEventListener('DOMContentLoaded', init);