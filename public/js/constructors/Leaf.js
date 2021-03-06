window.menuHTML =
 `<div class="menu">
      <ul>
        <li tabindex="2"> Edit <div class="editButton"></div></li>
        <li tabindex="2"> Broadcast <div class="broadcastButton"></div> </li>
        <li tabindex="2"> Listen <div class="listenButton"></div> </li>
        <li tabindex="2"> Save <div class="saveButton"></div> </li>
      </ul>
    </div>`

window.entityHeader = 
`<div class="entityHeader">
    <table>
      <tr>
        <td class="headerTitle"></td>
      </tr>
    </table>
    <div class="menuButton"></div>
    <div class="removeButton"></div>
    ${window.menuHTML}
  </div>`



function Leaf(xPos, yPos, width, height){
  xPos || (xPos = 150);
  yPos || (yPos = 150);
  width || (width = 400);
  height || (height = 300);

  let nodeId = `leaf${nextIdNum('.leaf')}`
  let tempNode = document.createElement('div');
  tempNode.innerHTML = 
  `<div showMenu="false" broadcast="true" listen="true" style="left: ${xPos}px; top: ${yPos}px; width: ${width}px; height: ${height}px; position: absolute;background: white" tabindex="1" class="leaf" id="${nodeId}">${window.entityHeader}</div>`
  this.element = tempNode.firstElementChild;
  // this.entityHeader = this.element.querySelector('.entityHeader')

  initLeafListeners(this.element);

};

Leaf.prototype.render = function(){
  return this.element
}

