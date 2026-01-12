export class Mosdo {
    constructor(id, tipus, helyszin, mukodik, foglalt, papir, csap, tisztasag) {
        if (typeof id != 'number' || id === 0 || id === null) {
            throw new Error(`ID mezo helytelen: ${id}, szamot kell megadni.`)
        };
        if (typeof tipus != 'string' || (tipus != 'Ferfi' && tipus != 'Noi' && tipus != 'Mozgasserult')) {
            throw new Error(`Tipus mezo helytelen: ${tipus}, csak a megadott tipusok kozul lehet valasztani.`)
        };
        if (typeof helyszin != 'string' || helyszin === '' || helyszin === null) {
            throw new Error(`Helyszin mezo helytelen: ${helyszin}, ures a mezo.`)
        };
        if (typeof mukodik != 'boolean') {
            throw new Error(`Mukodik mezo helytelen: ${mukodik}, boolean erteket kell kapjon.`)
        };
        if (typeof foglalt != 'boolean') {
            throw new Error(`Foglalt mezo helytelen: ${foglalt}, boolean erteket kell kapjon.`)
        };
        if (typeof papir != 'boolean') {
            throw new Error(`Papir mezo helytelen: ${papir}, boolean erteket kell kapjon.`)
        };
        if (typeof csap != 'boolean') {
            throw new Error(`Csap mezo helytelen: ${csap}, boolean erteket kell kapjon.`)
        };
        if (typeof tisztasag != 'number' || tisztasag < 1 || tisztasag === null || tisztasag > 5) {
            throw new Error(`Tisztasag mezo helytelen: ${tisztasag}, szamot kell megadni 1 es 5 kozott.`)
        };
        this.id = id;
        this.tipus = tipus;
        this.helyszin = helyszin;
        this.mukodik = mukodik;
        this.foglalt = foglalt;
        this.papir = papir;
        this.csap = csap;
        this.tisztasag = tisztasag;
    };
    toString() {
        return (`ID: ${this.id}. Tipus: ${this.tipus}. Helyszin: ${this.helyszin}. Mukodik: ${this.mukodik}. Foglalt: ${this.foglalt}. Papir: ${this.papir}. Csap: ${this.csap}. Tisztasag: ${this.tisztasag}`);
    };
    async postMosdoToDB(url) {
        const obj = {
            id: this.id,
            tipus: this.tipus,
            helyszin: this.helyszin,
            mukodik: this.mukodik,
            foglalt: this.foglalt,
            papir: this.papir,
            csap: this.csap,
            tisztasag: this.tisztasag,
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await response.text();
            if (!response.ok) {
                throw new Error(`Hibakod: ${response.status}. Hibauzenet: ${response.statusText}. Hibas URL: ${response.url}. Teljes hibauzenet: ${data}`)
            };
            console.log('A fetch sikeres volt' + data);
        } catch (err) {
            throw new Error(err);
        };
    };
};