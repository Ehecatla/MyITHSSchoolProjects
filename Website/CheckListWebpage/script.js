$('document').ready(function(){ 
    
    var myItemList;
    var $myListDiv = $('.list-div');
    var $editBtn = $('.edit-btn');
    var $addBtn = $('.add-btn');
    var $delBtn = $('.del-btn');
    var $upBtn = $('.up-btn');
    var $downBtn = $('.down-btn');
    var $inputField = $('.input-div input');
    const ITEM_LIST = 'itemList';
     
    
    /* Item */
    
    /**Class Item represents a single task in task list. To create object of Item
     * class one need to send string title and jquery div element to constructor.
    */
    function Item($element, title){
        this.itemTitle = title;
        this.$itemElement = $element;
        this.isMarked = false;
        this.$itemElement.on('click', this.onClick.bind(this));
    }
    
    /**Function render in Item class allows rendering Item objects title on the
     * jquery element it has assigned as its property.
     */
    Item.prototype.render = function(){
        this.$itemElement.html(this.itemTitle);   
        if(this.isMarked){
            this.$itemElement.css('background-color', 'gray');
        } else {
            var parentBackground = this.$itemElement.parent().css('background-color');
            this.$itemElement.css('background-color', parentBackground);
        }
    };
    
    /**Function onClick is listener for Item object that is bound to specific
     * object of Item class at its creation. When respective objects jquery 
     * element is clicked then item become marked on unmarked.
     */
    Item.prototype.onClick = function(){      
        if(this.isMarked){
            this.isMarked = false;
        } else {
            this.isMarked = true;   
        }
        this.render();
    }  
    
    
    /* ItemList */
    
    /**Class ItemList is representation of a list of tasks, it requires div 
     * element as argument when created. 
      */
    function ItemList($listDiv){
        this.$listElement = $listDiv;
        this.items = [];
        this.latestSelectedItems = [];     
    }
    
    /**Method render in ItemList runs through all Item objects that item list
     * has in its property called items and calls their render function.
     */
    ItemList.prototype.render = function(){    
        for(var val of this.items){
            val.render();     
        }                 
    };
    
    /**Function add in ItemList takes string title as parameter and creates new
     * Item object which is the added to ItemList objects array of items and 
     * to its element for display in DOM.
     */
    ItemList.prototype.add = function(title){
        var $itemDiv = $('<div></div>');
        var newItem = new Item ($itemDiv, title);
        
        this.items.push(newItem);    
        this.$listElement.append(newItem.$itemElement);
        this.render(); 
    };
    
    /**Function remove in ItemList removes both Item object and its element
     * representation from ItemList objects properties. Object to be removed 
     * are calculated by checking their isMarked property - if object is marked 
     * then its removed.
     */
    ItemList.prototype.remove = function(){
      for(var i = this.items.length; i>=0;i--){
         if(this.items[i]!==undefined && this.items[i]!== null && this.items[i].isMarked ) {
             this.items[i].$itemElement.remove();
             this.items.splice(i,1);
         }    
      } 
      this.render();
    };   
    
    /**Function moveUp for ItemList moves up one step all Item objects that are
     * marked - have isMarked property with value equal true. Function even renders
     * marked elements visible in DOM representing Item objects so that they show
     * new, accurate position of items in list.   
     */
    ItemList.prototype.moveUp = function(){
        this.countSelectedItems(); 
        var orderedList = [];
        var itemsNr = this.items.length;
        for(let i=0; i < itemsNr; i++){
           
            if($.inArray(this.items[i], this.latestSelectedItems) !== -1){
                
                if(i){                                                  //move only if not on top
                    var toPop = orderedList.pop();
                    orderedList.push(this.items[i]);
                    orderedList.push(toPop);
                    
                    //moving elements in DOM
                    var $elemToMove = this.items[i].$itemElement;
                    var $prevElement = toPop.$itemElement;  
	                if($prevElement.length !== 0){
                        $elemToMove.insertBefore($prevElement);
                    }
                } else {
                    orderedList.push(this.items[i]);
                }  
   
            } else {
                orderedList.push(this.items[i]);
            }
        }
        this.items = orderedList;
    };    
    
    /**Function moveDown for ItemList moves down one step all Item objects that are
     * marked - have isMarked property with value equal true. Function even renders
     * marked elements visible in DOM representing Item objects so that they show
     * new, accurate position of items in list.   
     */
    ItemList.prototype.moveDown = function(){
        this.countSelectedItems();
        var orderedList = [];
        var maxItemNr = this.items.length -1;
        for(let i= maxItemNr; i >= 0; i--){
           
           if($.inArray(this.items[i], this.latestSelectedItems) !== -1){
                
                if(i < maxItemNr){          
                    var prevItem = this.items[i+1];
                    var currentItem = this.items[i];
                    orderedList.splice(i,1); //remove undefined placeholder position
                    orderedList.splice(i+1,0,currentItem);
                    
                    //moving elements in DOM
                    var $elemToMove = currentItem.$itemElement;
                    var $prevElement = prevItem.$itemElement;  
	                if($prevElement.length !== 0){
                        $elemToMove.insertAfter($prevElement);
                    }           
                } else {
                    orderedList[i] = this.items[i];
                } 
                   
            } else {    //no change for that item
                orderedList[i] = this.items[i];
            }
        }
        this.items = orderedList;
    }; 
    
    
    /**Function updateItem in ItemList takes string title as argument and if that
     * title is not empty it updates selected items title and renders it again.
     */
    ItemList.prototype.updateItem = function(newTitle){
        if(this.latestSelectedItems && this.latestSelectedItems.length === 1 && newTitle){
            this.latestSelectedItems[0].itemTitle = newTitle;
            this.latestSelectedItems[0].render();
            console.log(this.items);
        }
    };
    
    /**Function hasOnlyOneSelected in ItemList calls countSelectedItems that
     * count how many Items that are selected in the list and then if only one
     * is selected then this function returns true, otherwise it returns false.
     */
    ItemList.prototype.hasOnlyOneSelected = function(){
        this.countSelectedItems();
        if(this.latestSelectedItems.length === 1){
             return true;
        } else { 
            return false;
        }
    }
    
    /**Function countSelectedItems in ItemList handles counting of Items that 
     * are actually selected in ItemList. It first empties latestSelectedItems
     * property to remove old selections memory, then it goes through list of 
     * items and every that isMarked is being added to ItemList objects property
     * latestSelectedItems.
     */
    ItemList.prototype.countSelectedItems = function(){
        this.latestSelectedItems = [];                                          //avoid duplicates
        var allSelected = [];     
        for(let value of this.items){
            if(value.isMarked){
                allSelected.push(value);
            }
        }
        this.latestSelectedItems = allSelected;
    }
    
    
    
    /* Program */
    
    loadList();
    $editBtn.prop('disabled', true);
   
    //wjem add button is clicked add new task and save list
    $addBtn.on('click', function(){    
        var newItemTitle = $inputField.val();
        if(newItemTitle){
            myItemList.add(newItemTitle);
            $inputField.val('');
        }  
        saveList(myItemList);
    });
    
    //when delete button is clicked remove marked items and save list   
    $delBtn.on('click', function(){
        myItemList.remove();
        saveList(myItemList);
    })  
    
    //when up button is clicked move marked items and save list
    $upBtn.on('click', function(){
        myItemList.moveUp();
        saveList(myItemList);
    });
    
    //when down button is clicked move items if marked and save
    $downBtn.on('click', function(){
        myItemList.moveDown();
        saveList(myItemList);
    });
    
    //when edit button is clicked it changes to save and it works onl as save button then
    $editBtn.on('click', function(){
        if($(this).text() === 'Edit'){
            $inputField.val( myItemList.latestSelectedItems[0].itemTitle);
            $(this).text('Save');
            //disable other buttons
            $addBtn.prop('disabled', true);
            $delBtn.prop('disabled', true);
            $upBtn.prop('disabled', true);
            $downBtn.prop('disabled', true);
        } else if ($(this).text() === 'Save'){
            let inputVal = $.trim( $inputField.val() );
            if(inputVal.length > 0){                //disallow updating to empty or just space input
                myItemList.updateItem($inputField.val());
                $(this).text('Edit');
                controlEditAvailability();
                saveList(myItemList);
                $inputField.val('');
                //enable other buttons
                $addBtn.prop('disabled', false);
                $delBtn.prop('disabled', false);
                $upBtn.prop('disabled', false);
                $downBtn.prop('disabled', false); 
            }
        }   
    });
    
    //each time person clicks anywhere on list, control if edit should be enabled
    $myListDiv.on('click', controlEditAvailability);
    
    /**Function controlEditAvailability controlls availablity of edit button. If
     * no edition is in progress (button is named Edit instead of Save) then it 
     * checks how many item rows that are selected at the moment and if only one
     * is selected then it enables edit button, otherwise it disables it.
     */
    function controlEditAvailability(){
        if($editBtn.text() === 'Edit' ){  
            if (myItemList.hasOnlyOneSelected()){
                $editBtn.prop('disabled', false);
            } else {
                $editBtn.prop('disabled', true);
            }
        }
    }
    
    /**Function saveList takes ItemList as argument and retrieves all Item names
     * from its items array property. Then it parses them to one string and saves
     * in local storage with key ITEM_LIST. Every time this function run it
     * removes possible old list from storage by clearing it first.
     */
    function saveList(anItemListObject){
        localStorage.clear()
        var arrayToSave = [];
        for (let value of anItemListObject.items){
            arrayToSave.push(value.itemTitle);
        }
        var listAsString = JSON.stringify(arrayToSave);
        localStorage.setItem(ITEM_LIST, listAsString);
    }
    
    /**Function loadList is used to load previously saved names for task list
     * from local storage. If there is itemList to load then this function 
     * recreates Item objects from saved names.
     */
    function loadList(){
        myItemList = new ItemList($myListDiv);
        if(localStorage.getItem(ITEM_LIST)) {
            var listInString = localStorage.getItem(ITEM_LIST);
            var arrayOfNames = JSON.parse(listInString);
            var listSize = arrayOfNames.length;
            for (let i = 0; i < listSize; i++){
                let itemName = arrayOfNames[i]
                if(itemName){
                    myItemList.add(itemName);    
                }        
            }                   
        } 
    }
    
    
});



