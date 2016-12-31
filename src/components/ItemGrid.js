export default class ItemGrid {
    constructor(gameState, startDrag, stopDrag, selectItem, items, backpack, pos={x: 0, y: 0}, dragDrop=true){
        this.gameState = gameState;
        this.items = items;
        this.position = pos;
        this.backpack = backpack;
        this.startDrag = startDrag;
        this.stopDrag = stopDrag;
        this.selectItem = selectItem;
        this.dragDrop = dragDrop;

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        //Grid Background
        let width = 650;
        let height = 260;
        let bgbmd = this.gameState.add.bitmapData(width+10, height+10);
        bgbmd.ctx.beginPath();
        bgbmd.ctx.rect(0, 0, 1, 1);
        bgbmd.ctx.fillStyle = '#131313';
        bgbmd.ctx.fill();
        this.gridSprite = this.gameState.add.sprite(this.position.x, this.position.y, bgbmd);

        this.drawGridTiles();

        this.itemsGroup = this.gameState.add.group();
        this.addItemsToGrid();
    }

    show(){
        this.slotsGroup.visible = true;
        this.itemsGroup.visible = true;
        this.gridSprite.visible = true;
    }

    hide(){
        this.slotsGroup.visible = false;
        this.itemsGroup.visible = false;
        this.gridSprite.visible = false;
    }

    drawGridTiles(){
        this.slotsGroup = this.gameState.add.group();
        for(let i=0; i< this.backpack.length; i++){
            for(let j=0; j< this.backpack[i].length; j++){
                let slot = this.backpack[i][j];
                slot.bmd = this.gameState.add.bitmapData(64, 64);
                slot.bmd.ctx.beginPath();
                slot.bmd.ctx.rect(0, 0, 64, 64);
                slot.bmd.ctx.fillStyle = '#ffffff';

                slot.bmd.ctx.fill();

                let offset = {x: ((65*j)+1), y:((65*i)+1)};
                let x = (this.gridSprite.position.x) + offset.x;
                let y = (this.gridSprite.position.y) + offset.y;
                slot.sprite = this.gameState.add.sprite(x, y, slot.bmd);
                if(this.backpack[i][j].invItem != -1){
                    slot.sprite.tint = 0xCDCDCD;
                }
                this.slotsGroup.add(slot.sprite);
            }
        }
    }

    addItemsToGrid(){
        this.items.forEach((item) => {
            this.addItemSprite(item);
        });
    }

    addItemSprite(item){
        let drawnObject;
        let width = item.shapeWidth*54;
        let height = item.shapeHeight*54;
        let bmd = this.gameState.add.bitmapData(width, height);

        let invSlot = item.inventorySlot;
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, item.shapeWidth*54, item.shapeHeight*54);
        bmd.ctx.fillStyle = '#ababab';
        bmd.ctx.fill();
        //console.log('--placing piece at x,y:', gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2));
        if(item.sprite){
            drawnObject = this.gameState.add.sprite(this.position.x + (65*invSlot.x)+((65*item.shapeWidth - (item.shapeWidth*54))/2), this.position.y + (65*invSlot.y)+((65*item.shapeHeight - (item.shapeHeight*54))/2), item.sprite);
        } else {
            drawnObject = this.gameState.add.sprite(this.position.x + (65*invSlot.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2), this.position.y + (65*invSlot.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2), bmd);
        }
        drawnObject.inputEnabled = true;
        drawnObject.originalPosition = drawnObject.position.clone();

        //- Item Sprite Mouse Events
        drawnObject.events.onInputDown.add((drawnObject) => {
            this.selectItem(drawnObject, item);
        }, this);
        drawnObject.events.onInputOver.add((drawnObject) => {
            this.selectItem(drawnObject, item);
        }, this);
        //Drag n Drop fucntionality, optional, callbacks provided
        if(this.dragDrop){
            drawnObject.input.enableDrag();

            drawnObject.events.onDragStop.add((drawnObject, mousePos) => {
                this.stopDrag(drawnObject, item, mousePos);
            }, this);
            drawnObject.events.onDragStart.add(function(sprite){
                this.startDrag(sprite, item, this.itemsGroup);
            }, this);
        }

        this.itemsGroup.add(drawnObject);
    }

}
