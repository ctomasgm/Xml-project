/*
* Created by
* Carlos Garcia 320605
* Hector Aguirre 320793
* Alejandro Aguirre 320646 
* Victor Aguilar 320663
*/ 


function main() {
    console.log(Nombre('name1'));
}

function Elemento() {
    
}

function Nombre(entrada) {
    const primero = entrada.substring(0, 1); 
    const resto = entrada.substring(1); 
    if(entrada.substring(0, 3).toLowerCase() === 'xml')
        return false;
    
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
    return false;
}

function Letra(entrada) {
    return /^[a-zA-Z]$/.test(entrada);
}

function Digito(entrada) {
    return /^[0-9]$/.test(entrada);
}

function Contenido() {
    
}

function Atributos(entrada) {
    if(entrada === '')
        return true;
    if(entrada.substring(0, 1) === ' '){
        const equalSign = entrada.indexOf('=');
        if(equalSign === -1)
            return false;
        if(Nombre(entrada.substring(1,equalSign))){
            if(entrada.substring(equalSign+1, equalSign+2) === '"'){
                const closingQuotes = entrada.substring(equalSign+2).indexOf('"');
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



main();


