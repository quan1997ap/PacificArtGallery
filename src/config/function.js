// cac function thuong dung
export function subStringWord(string, wordNumber) {
  if (string != "" && string != undefined) {
    let res = string.toString().split(" ");
    var content = res.slice(0, wordNumber).toString();
    var regex = /,/gi;
    resultString = content.replace(regex, ` `);

    if(res.length > wordNumber){
        return resultString + " ...";
    }
    else {
        return resultString
    }
  }
}
