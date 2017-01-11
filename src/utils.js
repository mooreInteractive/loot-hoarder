export const setResponsiveWidth = (sprite, percent, parent) => {
    let percentWidth = (sprite.texture.width - (parent.width / (100 / percent))) * 100 / sprite.texture.width;
    sprite.width = parent.width / (100 / percent);
    sprite.height = sprite.texture.height - (sprite.texture.height * percentWidth / 100);
};

export const tryToPlaceItemInBackpack = (item, items, backpack) => {
    let itemPlaced = false;
    for(let y = 0; y < backpack.length; y++){
        let row = backpack[y];
        for(let x = 0; x < row.length; x++){
            itemPlaced = placeItemInSlot(backpack, items, item, {x,y});
            if(itemPlaced){break;}
        }
        if(itemPlaced){break;}
    }
    return itemPlaced;
};

export const placeItemInSlot = (backpack, items, item, slot, placeNow = true) => {
    let invSlots = backpack;
    let itemInvIndex = items.indexOf(item);
    let validSlot = slot != null && slot.x > -1 && slot.y > -1;
    //console.log('--place Item slot:', slot, validSlot);
    if(validSlot && invSlots[slot.y][slot.x].invItem === -1){
        let itemFits = true;
        //Empty Slot in backpack found...
        item.shape.forEach((irow, iy) => {
            irow.forEach((icol, ix) => {
                if(icol === 1){
                    if(!invSlots[slot.y + iy] || !invSlots[slot.y + iy][slot.x + ix]){
                        itemFits = false;
                        return false;
                    }
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
                            relSlot.invItem = items.length;
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
                items.push(item);
            }
            return true;
        } else {
            return itemFits;
        }
    }

    return false;
};

export const equipItem = (player, item, slot) => {
    player.equipped[slot.type] = item;
    item.inventorySlot = slot.type;
    // console.log('--equipped item:', item, slot);
    let itemInInv = player.inventory.indexOf(item);
    if(itemInInv > -1){
        player.inventory.splice(itemInInv, 1);
    }
    player.updateBattleStats();

    /* track equipped */
    window.ga('send', 'event', 'gane_items', 'equip_item', item.name);
};

export const unequipItem = (player, item) => {
    player.equipped[item.inventorySlot] = null;
    player.updateBattleStats();
    // console.log('--item unequipped...', item);
};

export const removeItemFromBackpack = (backpack, item) => {
    item.shape.forEach((irow, iy) => {
        irow.forEach((icol, ix) => {
            if(icol === 1){
                backpack[item.inventorySlot.y + iy][item.inventorySlot.x + ix].invItem = -1;
                backpack[item.inventorySlot.y + iy][item.inventorySlot.x + ix].sprite.tint = 0xFFFFFF;
            }
        });
    });
};

export const convertSecondsToTime = (seconds) => {
    let timeString = '0:00';
    let minutes = Math.floor(seconds/60);
    let secondsLeft = seconds%60 < 10 ? '0'+seconds%60 : seconds%60;

    if(minutes < 0 ){minutes = 0;}
    if(seconds%0 < 0){secondsLeft = '00';}

    timeString = `${minutes}:${secondsLeft}`;

    return timeString;
};

export const convertSecondsToTimeWithHours = (seconds) => {
    let timeString = '00:00:00';
    let hours = Math.floor(seconds/3600);
    let minutes = seconds/60 > 59 ? Math.floor((seconds%3600)/60) : Math.floor(seconds/60);
    let secondsLeft = seconds%60 < 10 ? '0'+seconds%60 : seconds%60;

    if(hours < 0 ){hours = '';}
    if(minutes < 10 ){minutes = '0'+minutes;}
    if(minutes <= 0 ){minutes = '00';}
    if(seconds%0 <= 0){secondsLeft = '00';}

    timeString = `${hours}${hours ? ':' : ''}${minutes}:${secondsLeft}`;

    return timeString;
};

export const identifyScroll = (scroll) => {
    scroll.name = scroll.hiddenName;
    scroll.description = scroll.hiddenDescription;
    scroll.value = scroll.hiddenValue;
    scroll.identified = true;
};
