const init = async function () {
    const URL = 'https://retoolapi.dev/cFJq9K/petrikBudi'
    // fetchGET(URL);
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

    for(const element of arr) {
        const id = element.id;
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
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
};

document.addEventListener('DOMContentLoaded', init)