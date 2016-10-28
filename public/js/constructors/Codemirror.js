function Codemirror(optStringInit,optFileName){
  if(typeof CodeMirror === "undefined"){
    let cssInclude = document.createElement('link')
    cssInclude.setAttribute('rel', 'stylesheet');
    cssInclude.setAttribute('href', '/lib/codemirror.css')
    document.head.appendChild(cssInclude);
    let jsInclude = document.createElement('script')
    jsInclude.setAttribute('src', '/lib/codemirror.js')
    jsInclude.setAttribute('defer','true');
    document.head.appendChild(jsInclude);
    let jsModeInlucde = document.createElement('script')
    jsModeInlucde.setAttribute('src', '/lib/mode/javascript/javascript.js')
    document.head.appendChild(jsModeInlucde);
  }

  Leaf.call(this)
  this.element.className += ' codemirrorContainer'
  var codemirrorList = document.getElementsByClassName('codemirror')
  this.element.id = optFileName ? optFileName : ('untitled' + codemirrorList.length);
  var header = this.element.getElementsByClassName('entityHeader')[0];
  header.innerText = this.element.id;
  this.element.style.width = '400px';
  this.element.style.height = '400px';
  var codeText = document.createElement('textarea');
  if(optStringInit){
    codeText.value = optStringInit;
  }
  this.element.appendChild(codeText);
  
  //this.element.addEventListener('keydown',broadcastEdits)

  setTimeout(()=>{
    this.element.cm = CodeMirror.fromTextArea(codeText, {
      mode: "javascript",
      lineNumbers: true
    });
   this.element.cm.on('change',broadcastEdits) //Will pass the cm object
},100)

  this.render = function(){
    return this.element;
  }
}

// Peripheral functions for codeMirror. Codemirror sync events.
/* There are two types of events to handle:
 * When any user clicks anywhere in the mirror, 
 * a message is socketized containing the line number.
 * The server can match the identity of the send, and broadcast 
 * the line number to be locked. 
 * 
 * On receiving the line number, the clients will use markText, readOnly
 * 
 * When an edit is made, the line number and the string are broadcast
 * clients will clear the marktext, insert the line, and re-mark the text. 
 */
// function broadcastPos(theMirror){
//   let lineOfCursor = theMirror.getDoc().getCursor().line;
//   let mirrorContainer = theMirror.display.wrapper.parentElement.id;
//   socket.emit('cursorActivity',{lineOfCursor, mirrorContainer});
//   // mark = theMirror.markText({line:lineOfCursor,ch:0},{line:lineOfCursor+1,ch:0},{css: 'background: lightblue',readOnly: true})
//   // console.log(lineOfCursor);
// }

//this is fired on change
function broadcastEdits(theMirror,changeObj){
  //remote changes have an undefined origin. Only fire socket when change is local.
  if(changeObj.origin){
    let mirrorContainer = theMirror.display.wrapper.parentElement.id;
    let changeFrom = changeObj.from;
    let changeTo = changeObj.to;
    let newContent = changeObj.text;
    socket.emit('mirrorChange',{changeFrom, changeTo,newContent,mirrorContainer});
  }
}

socket.on('mirrorChange', data => {

  console.log(data);
  let {changeFrom, changeTo, newContent, mirrorContainer} = data;
  let leaf = document.getElementById(mirrorContainer);
  let theMirror = leaf.cm
  theMirror.getDoc().replaceRange(newContent,changeFrom,changeTo)
})