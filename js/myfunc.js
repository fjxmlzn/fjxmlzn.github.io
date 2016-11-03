function changeHiddenById(oDiv){
    var vDiv = document.getElementById(oDiv);
    vDiv.style.display = (vDiv.style.display == 'none')?'block':'none';
}

function changeHiddenByClass(oDiv){
    var vDivs = document.getElementsByClassName(oDiv);
    for (i = 0; i < vDivs.length; i++) {
        vDivs[i].style.display = (vDivs[i].style.display == 'none')?'block':'none';
    }
}