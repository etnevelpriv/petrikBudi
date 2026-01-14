let budik = []
const init =  () => {
    document.getElementById('reloadBudik').addEventListener('click', BudikUjratoltese);
}

const BudikUjratoltese = async () => {
    const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'
    budik = await fetchGET(URL);
}

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

document.addEventListener('DOMContentLoaded', init);