const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'

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
        
        if (element.epulet === 'A') {
            aContainer.appendChild(card);
        } else {
            bContainer.appendChild(card);
        }
    });
};

document.addEventListener('DOMContentLoaded', init);