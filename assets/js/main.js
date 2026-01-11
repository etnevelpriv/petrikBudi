const init = async function () {
    databaseReset();
};

const databaseReset = async function () {
  try {
    const response = await fetch('https://retoolapi.dev/cFJq9K/petrikBudi', {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${await response.text()}`);
    };
    console.log(await response.text());
  } catch (err) {
    throw new Error(err);
  };
};

document.addEventListener('DOMContentLoaded', init)