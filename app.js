/*
* Created by
* Carlos Garcia 320605
* Hector Aguirre 320793
* Alejandro Aguirre 320646 
* Victor Aguilar 320663
*/
const fs = require('fs');
const readline = require('readline');

function main(data) {
    console.log(data)
    console.log(Elemento(data));
}

function Elemento(entrada) {
    return Gansito(entrada) || Pinguinos(entrada);
}

function Gansito(entrada) {
    if(entrada.substring(0, 1) !== '<')
        return false;
    var endOfName = entrada.indexOf(' ');
    if(endOfName === -1)
        endOfName = entrada.indexOf('/');
    if(endOfName === -1)
        return false;
    
    const name = entrada.substring(1, endOfName);
    
    if(!Nombre(name))
        return false;

    if(entrada.substring(entrada.length-2) !== '/>')
        return false;
    
    return Atributos(entrada.substring(name.length+1, entrada.length-2));
}

function Pinguinos(entrada) {
    if(entrada.substring(0, 1) !== '<')
        return false;

    var firstSpace = entrada.indexOf(' ');
    var firstGt = entrada.indexOf('>');
    var endOfName;

    if(firstSpace === -1 && firstGt === -1)
        return false;
    if(firstSpace === -1 && firstGt >= 0)
        endOfName = firstGt;
    if(firstSpace >= 0 && firstGt === -1)
        endOfName = firstSpace;
    if(firstSpace >= 0 && firstGt >= 0)
        endOfName = Math.min(firstSpace, firstGt);
    
    const name = entrada.substring(1, endOfName);
    
    if(!Nombre(name))
        return false;
    
    if(!Atributos(entrada.substring(name.length+1, entrada.indexOf('>'))))
        return false;

    const closingTag = entrada.substring(entrada.length - (name.length+3));
    if(closingTag !== `</${name}>`)
        return false;

    return Contenido(entrada.substring(
        entrada.indexOf('>')+1, entrada.length - (name.length+3)
    ));
}

function Nombre(entrada) {
    const primero = entrada.substring(0, 1); 
    const resto = entrada.substring(1); 
    if(entrada.substring(0, 3).toLowerCase() === 'xml')
        return false;
    
    return L1(primero) && N1(resto);
}

function NombreAttr(entrada) {
    const primero = entrada.substring(0, 1); 
    const resto = entrada.substring(1); 
    
    return L1(primero) && N1(resto);
}

function L1(entrada) {
    return Letra(entrada) || entrada === '_';
}

function N1(entrada) {
    if(entrada === '')
        return true;

    const primero = entrada.substring(0,1); 
    const resto = entrada.substring(1); 

    if(Letra(primero) && N1(resto))
        return true;
    if(Digito(primero) && N1(resto))
        return true;
    if(primero === '-' && N1(resto))
        return true;
    if(primero === '_' && N1(resto))
        return true;   
    if(primero === '.' && N1(resto))
        return true;   
    if(primero === ':' && N1(resto))
        return true;   
    return false;
}

function Letra(entrada) {
    return /^[a-zA-Z]$/.test(entrada);
}

function Digito(entrada) {
    return /^[0-9]$/.test(entrada);
}

function Contenido(entrada) {
    if(entrada === '')
        return true;
    if(Texto(entrada))
        return true;
    if(!entrada.includes('>'))
        return false;

    let i = entrada.indexOf('>');

    while(i !== -1) {
        const primerMitad = entrada.substring(0, i+1);
        const segundaMitad = entrada.substring(i+1);
        if(Elemento(primerMitad) && Contenido(segundaMitad)) {
            // console.log(`sí cumplió [${primerMitad}][${segundaMitad}`)
            return true;
        } else {
            // console.log(`no cumplió [${primerMitad}][${segundaMitad}`)
        }
        i = entrada.indexOf('>', i+1);
    }
    return false;
}

function Atributos(entrada) {
    if(entrada === '')
        return true;
    if(entrada.substring(0, 1) === ' '){
        const equalSign = entrada.indexOf('=');
        if(equalSign === -1)
            return false;
        if(NombreAttr(entrada.substring(1,equalSign))){
            if(entrada.substring(equalSign+1, equalSign+2) === '"'){
                const closingQuotes = entrada.indexOf('"', equalSign+2);
                if(closingQuotes === -1)
                    return false;
                if(Texto(entrada.substring(equalSign+2, closingQuotes))){
                    return Atributos(entrada.substring(closingQuotes+1));
                }

            }
        }
    }
    return false;
}

function Texto(entrada) {
    if(entrada.includes('<'))
        return false;
    if(entrada.includes('>'))
        return false;
    if(/&(?!(lt;|gt;|amp;|apos;|quot;))/.test(entrada))
        return false;   
    if(entrada.includes('"'))
        return false;
    if(entrada.includes("'"))
        return false;
    return true; 
}

function Comentario(entrada) {
    if(entrada.substring(0, 4) !== '<!--')
        return false;
    if(entrada.substring(entrada.length-3) !== '-->')
        return false;
    return Comentexto(entrada.substring(4, entrada.length-3))
    
}

function Comentexto(entrada) {
    if(entrada.includes('--'))
        return false;
    return true;
}

//Leer el archivo de entrada y comenzar la ejecución de nuestro programa
if (process.argv.length < 3) {
    console.error('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}

const readInterface = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
});

let lines = [];
readInterface.on('line', function(line) {
    lines.push(line.trim());
});

readInterface.on('close', () => {
    main(lines.join(''));
})


