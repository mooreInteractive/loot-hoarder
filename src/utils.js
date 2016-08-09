export const placeItemInSlot = (player, item, slot, placeNow = true) => {
    let invSlots = player.backpack;
    let itemInvIndex = player.inventory.indexOf(item);

    if(invSlots[slot.y][slot.x].invItem === -1){
        let itemFits = true;
        //Empty Slot in backpack found...
        item.shape.forEach((irow, iy) => {
            irow.forEach((icol, ix) => {
                if(icol === 1){
                    if(!invSlots[slot.y + iy] || !invSlots[slot.y + iy][slot.x + ix]){ itemFits = false; return false; }
                    if(invSlots[slot.y + iy][slot.x + ix].invItem != -1){
                        itemFits = false;
                    }
                }
            });
        });

        if(itemFits && placeNow){
            let firstSlot = true;
            //Set backpack to item's shape
            item.shape.forEach((irow, iy) => {
                irow.forEach((icol, ix) => {
                    if(icol === 1){
                        let relSlot = invSlots[slot.y + iy][slot.x + ix];
                        if(itemInvIndex > -1){
                            relSlot.invItem = itemInvIndex;
                        } else {
                            relSlot.invItem = player.inventory.length;
                        }
                        if(relSlot.sprite){relSlot.sprite.tint = 0xCDCDCD;}
                        if(firstSlot){
                            item.inventorySlot = {y:(slot.y + iy), x:(slot.x + ix)};
                            firstSlot = false;
                        }
                    }
                });
            });

            //console.log('--mm playerbackpack after adding item:', invSlots);

            if(itemInvIndex === -1){
                player.inventory.push(item);
            }
            return true;
        } else {
            return itemFits;
        }
    }
};

export const equipItem = (player, item, slot) => {
    player.equipped[slot.type] = item;
    item.inventorySlot = slot.type;
    console.log('--equipped item:', item, slot);
    player.inventory.splice(player.inventory.indexOf(item), 1);
    player.updateBattleStats();
};

export const unequipItem = (player, item) => {
    player.equipped[item.inventorySlot] = null;
    player.updateBattleStats();
    console.log('--item unequipped...', item);
};

export const removeItemFromBackpack = (backpack, item) => {
    item.shape.forEach((irow, iy) => {
        irow.forEach((icol, ix) => {
            if(icol === 1){
                //console.log('--removing from backpack: ', item.inventorySlot.y + iy, item.inventorySlot.x + ix);
                backpack[item.inventorySlot.y + iy][item.inventorySlot.x + ix].invItem = -1;
                backpack[item.inventorySlot.y + iy][item.inventorySlot.x + ix].sprite.tint = 0xFFFFFF;
            }
        });
    });
};

export const convertScreenPixelsToInventorySlot = () => {};
