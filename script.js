primer=true
var m=prompt("Indique el numero de minas")
var tablero
var destapados
var bombasTapadas
function main(){
    var x=prompt("Indique numero de columnas")
    var y=prompt("Indique el numero de filas")
    tablero=new Array(y)
    destapados=new Array(y)
    tabla=document.getElementsByTagName("table")[0]
    for(var i=0;i<y;i++){
        linea=document.createElement("tr")
        tabla.appendChild(linea)
        tablero[i]=new Array(x)
        destapados[i]=new Array(x)
        for(var j=0;j<x;j++){
            casilla=document.createElement("td")
            casilla.setAttribute("onClick","destapar("+i+","+j+")")
            casilla.addEventListener('contextmenu',function(ev){
                var casilla = ev.target
                y=Number(casilla.getAttribute("Onclick").charAt(9))
                x=Number(casilla.getAttribute("Onclick").charAt(11))
                ev.preventDefault()
                ponerBandera(y,x)
                return false
            },false)
            casilla.style.backgroundImage='url("btn.png")'
            linea.appendChild(casilla)
            tablero[i][j]=0
            destapados[i][j]=false
        }
    }
}
function ponerMinas(minas,primY,primX){
    puestas=0
    alrededor=0
    while(puestas!=minas){
        y=Math.floor(Math.random()*tablero.length)
        x=Math.floor(Math.random()*tablero[0].length)
        if(tablero[y][x]==0 && (x!=primX || y!=primY)){
            tablero[y][x]=-1
            puestas++
        }
    }
    for(var i=0;i<tablero[0].length;i++){
        for(var j=0;j<tablero.length;j++){
            if(tablero[j][i]!=-1){
                alrededor=0
                //comprueba alrededor
                for(var x=i-1;x<=i+1;x++){
                    if(x>=0 && x<tablero[0].length){//comprueba que no se salga horizontal
                        for(var y=j-1;y<=j+1;y++){
                            if(y>=0 && y<tablero.length){//comprueba que no se salga vertical
                                if(tablero[y][x]==-1){//comprueba si es una mina
                                    alrededor++
                                }
                            }
                        }
                    }
                }
                tablero[j][i]=alrededor
            }
        }
    }
}

function destapar(y,x){
    x=Number(x)
    y=Number(y)
    if(primer){
        ponerMinas(m,y,x)
        primer=false
    }
    if(!destapados[y][x]){
        muestra(y,x)
    }
    
}
function muestra(y,x){
    casilla=document.getElementsByTagName("table")[0]
    casilla=casilla.getElementsByTagName("tr")[y]
    casilla=casilla.getElementsByTagName("td")[x]
    if(casilla.style.backgroundImage!='url("bandera.png")'){
        destapados[y][x]=true
        if(tablero[y][x]==0){
            casilla.style.backgroundImage='url("0.png")'
            console.log(x+", "+y)
            for(var i=x-1;i<=x+1;i++){
                if(i>=0 && i<tablero[0].length){//comprueba que no se salga horizontal
                    for(var j=y-1;j<=y+1;j++){
                        if(j>=0 && j<tablero.length){//comprueba que no se salga vertical
                            destapar(j,i)
                        }
                    }
                }
            }
        }else if(tablero[y][x]==1){
            casilla.style.backgroundImage='url("1.png")'
        }else if(tablero[y][x]==2){
            casilla.style.backgroundImage='url("2.png")'
        }else if(tablero[y][x]==3){
            casilla.style.backgroundImage='url("3.png")'
        }else if(tablero[y][x]==4){
            casilla.style.backgroundImage='url("4.png")'
        }else if(tablero[y][x]==5){
            casilla.style.backgroundImage='url("5.png")'
        }else if(tablero[y][x]==6){
            casilla.style.backgroundImage='url("6.png")'
        }else if(tablero[y][x]==7){
            casilla.style.backgroundImage='url("7.png")'
        }else if(tablero[y][x]==8){
            casilla.style.backgroundImage='url("8.png")'
        }else if(tablero[y][x]==-1){
            casilla.style.backgroundImage='url("minaQuePeta.png")'
            for(var i=0;i<tablero.length;i++){
                for(var j=0;j<tablero[0].length;j++){
                    casilla=document.getElementsByTagName("table")[0]
                    casilla=casilla.getElementsByTagName("tr")[i]
                    casilla=casilla.getElementsByTagName("td")[j]
                    casilla.removeAttribute("OnClick")
                    if(tablero[i][j]==-1 && (i!=y || j!=x)){
                        if(casilla.style.backgroundImage=='url("btn.png")'){
                            casilla.style.backgroundImage='url("restoDeMinas.png")'
                        }else if(casilla.style.backgroundImage=='url("bandera.png")'){
                            casilla.style.backgroundImage='url("minaBandera.png")'
                        }
                    }
                }
            }
        }
    }
    if(haGanado()){
        for(var i=0;i<tablero.length;i++){
            for(var j=0;j<tablero[0].length;j++){
                if(tablero[i][j]==-1 && (i!=y || j!=x)){
                    casilla=document.getElementsByTagName("table")[0]
                    casilla=casilla.getElementsByTagName("tr")[i]
                    casilla=casilla.getElementsByTagName("td")[j]
                    casilla.style.backgroundImage='url("restoDeMinas.png")'
                }
            }
        }
        alert("Has ganado!!!!!!!!!!!!!!!!:DDDDDDDDDDDDDD")
    }
}
function haGanado(){
    var gana=false
    var num=0
    for(var i=0;i<destapados.length;i++){
        for(var y=0;y<destapados[0].length;y++){
            if(destapados[i][y]){
                num++
            }
        }
    }
    if(num==((tablero.length*tablero[0].length)-m)){
        gana=true
    }
    return gana
}
function ponerBandera(y,x){
    casilla=document.getElementsByTagName("table")[0]
    casilla=casilla.getElementsByTagName("tr")[y]
    casilla=casilla.getElementsByTagName("td")[x]
    if(casilla.style.backgroundImage=='url("btn.png")'){
        casilla.style.backgroundImage='url("bandera.png")'
        casilla.addEventListener('contextmenu',function(ev){
            var casilla = ev.target
            y=Number(casilla.getAttribute("Onclick").charAt(9))
            x=Number(casilla.getAttribute("Onclick").charAt(11))
            ev.preventDefault()
            ponerBandera(y,x)
            return false
        },false)
    }else if(casilla.style.backgroundImage=='url("bandera.png")'){
        casilla.style.backgroundImage='url("btn.png")'
        
    }

}
