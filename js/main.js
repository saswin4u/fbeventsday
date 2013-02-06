/*
    CREATED BY
    ----------

    Name  : Sylvester Aswin Stanley
    Email : sylvester.aswinstanley@gmail.com
    Date  : 02/02/2013


    ALGORITHUM IMPLEMENTED
    ----------------------

    1. Consider an unfinite grid with a fixed left edge.
    2. Each event is grid wide and the height and vertical position is decided on start and ending time.
    3. Place all the colliding events in a column as far left as possible.
    4. Once all the columns are placed the width of each colliding column with (1/n) of total container width.
    5. Non-colliding event will have width equal to the container width

    ALGORITHUM COMPLEXITY
    ---------------------

    O(N)

*/
var App, //Global Object with Button Action Events
    AppDirect,//Global Objevt with the function to convert given object to desired format
    /*
        THE EVENT OBJECT CONVERTION FUNCTION CAN BE DIRECTED CALLED USING THE BELOW FUNCTION !!!!IMPORTANT!!!!!

        AppDirect.getThingsDone( input object );
    */
    preDefinedEvents = [{name : 'eBuildInObject1', hook:'returnBtnEvent'}, {name : 'eBuildInObject2', hook : 'returnBtnEvent'}, {name : 'eBuildInObject3', hook : 'returnBtnEvent'}];
(function ($, document, undefined) {
    "use strict";
    var config = {
            /* Sample Event 1 */
            eBuildInObject1 : [{"id" : 1, "start" : 60, "end" : 120}, {"id" : 2, "start" : 100, "end" : 240}, {"id" : 3, "start" : 180, "end" : 400}, {"id" : 4, "start" : 320, "end" : 460}, {"id" : 5, "start" : 600, "end" : 700}, {"id" : 6, "start" : 90, "end" : 150}, {"id" : 7, "start" : 110, "end" : 180}, {"id" : 8, "start" : 200, "end" : 350}, {"id" : 9, "start" : 130, "end" : 170}, {"id" : 10, "start" : 120, "end" : 180}, {"id" : 11, "start" : 200, "end" : 180}, {"id" : 12, "start" : 330, "end" : 420}, {"id" : 13, "start" : 210, "end" : 270}, {"id" : 14, "start" : 240, "end" : 270}, {"id" : 15, "start" : 270, "end" : 300}, {"id" : 16, "start" : 300, "end" : 330}, {"id" : 17, "start" : 480, "end" : 600}],
            /* Sample Event 2 */
            eBuildInObject2 : [{"id" : 1, "start" : 60, "end" : 120}, {"id" : 2, "start" : 100, "end" : 240}, {"id" : 3, "start" : 700, "end" : 720}],
            /* Sample Event 3 */
            eBuildInObject3 : [{"id" : 1, "start" : 60, "end" : 120}, {"id" : 2, "start" : 90, "end" : 180}, {"id" : 3, "start" : 120, "end" : 330}, {"id" : 4, "start" : 150, "end" : 240}, {"id" : 5, "start" : 210, "end" : 300}, {"id" : 6, "start" : 270, end : 360}]    
        },
        /* Place holder cache to append the events. Hard coded for now */
        appendTarget = $('#inner-wrap'),
        /*  Get the width of the placeholder target */
        block_width = appendTarget.width(),
        /*  Get the height of the placeholder target */
        block_height = appendTarget.height(),
        /* MODULAR PATTERN
            
            MODULE TO CREATE EVENTS ONCE THE EVENT OBJECT IS CREATED

            @returns singleton
                createElement

                    @param event object
                    @param target container (private variable which was configured above)

         */
        buildBlocks = (function () {
            var instance;
            function init() {
                return {
                    /*
                        FUNCTION TO CREATE VARIOUS EVENTS DEPENDING ON THE EVENT OBJECT

                        DOES A EACH LOOP.
                        CREATES DOCUMENTS FRAGMENTS OF THE NECESSARY <div> ELEMENTS

                        APPENDS THE ENTRIRE FRAGEMENT TO THE DOM ONE SHOT. 
                    */
                    createElement : function (object, target) {
                        var frag = document.createDocumentFragment(),
                            div,
                            zIndex = 10000,
                            $target = target.find('.span12');
                        //Load object data to textarea
                        this.loadData(object); 
                        $.each(object, function(index, o){
                            div = $('<div />')
                                //THE CSS OBJECT WHICH HAS TO BE APPENDED TO EACH EVENT DEOENDING ON THE INDIVIDUAL EVENT OBJECT
                                .css({
                                    'top' : o.top,
                                    'width' : o.width,
                                    'height' : o.height,
                                    'left' : o.left,
                                    'position' : 'absolute',
                                    'zIndex' : zIndex + index
                                })
                                //ADD A CLASS WITH SOME PRE-DEFINED STYLES
                                .addClass('event-block')
                                //ADD SOME DYNAMIC CONTENT TO DISPLAY
                                .html('<h1>Sample Item ' + o.id + '</h1><p>Sample Location</p>');
                            //ADD THE CREATED DOM ELEMENT TO THE TEMPORARY DOCUMENT FRAGMENT  
                            frag.appendChild(div[0]);
                        });
                        //APPEND ALL THE FRAG ELEMENTS TO THE TARGET ELEMENT IN ONE SHOT
                        $target.empty();
                        $target[0].appendChild(frag);
                    },
                    /*
                        FUNCTION TO CONVERT THE OBJECT CREATED TO PRETTY JSON FORMAT

                        LIBRARY USED : www.json2.org

                        @param event object

                        @return event object in a pretty format
                    */
                    convertDataToJSON : function(obj){
                        var step = 4;
                        //MAKE SURE THE INPUT OBJECT IS AN OBJECT ELSE RETURN NOTHING
                        if(typeof obj === 'undefined') {return;}
                        if(typeof obj === 'object'){ return JSON.stringify(obj, null, step); }
                    },
                    /*
                        FUNCTION TO LOAD THE PRETTY PRINT JSON DATA TO THE TEXTAREA

                        @param event object
                    */
                    loadData : function(obj){
                        var that = this,
                            showObjects = $('#renderResults').find('textarea');
                        //SET VALUE OF THE <textarea>
                        showObjects.val(that.convertDataToJSON(obj));
                    },
                    /*
                        FUNCTION TO ATTACH BUTTON EVENT

                        THIS FUNCTION WILL ATTACH A CLICK EVENT TO THE SHOW BUTTON AND WILL ALSO HANDLE THE CLICK EVENTS
                    */
                    appendBtnEvent : function(){
                        var that = this,
                            showRenderBtn = $('#showRenderBtn'), //Reference to "Show Object" Button
                            targetContainer = $('#renderResults'), //Reference to <div> which will have 
                            inputTextField = $('#enterObjectValueInputField'),//Referece to Input Field
                            inputTextFieldWidth = inputTextField.width(),//Width of the input field
                            appendEl = $('.append'),//Div Continaer which holds all the buttons
                            actionSelectEl = '.btn[data-toggle="dropdown"]', // Class reference to dropdown buttons
                            $actionSelectEl = $(actionSelectEl), //Element reference to the dropdown button
                            $actionSelectElSpan = $actionSelectEl.find('span.text'),//Text El Reference inside the drop down button
                            renderSelectEl = '.btn[data-toggle="render"]',//Class reference to the Render Button
                            $renderSelectEl = $(renderSelectEl),//Element Reference to the Render Button
                            outerDivId = 'selectionBtnToolbar',//Name of outer ID which holds the in-build events
                            eventHandlerObject;//Empty Variable
                        /*
                            Event handler for "Show Object" button
                        */
                        showRenderBtn.on('click', function(e){
                            e.preventDefault();
                            eventHandlerObject.showRenderBtnHandler($(this));
                        });
                        /*
                            Event handler for "Action Select" drop down button
                        */
                        appendEl.on('click', actionSelectEl, function(e){
                            e.preventDefault();
                            eventHandlerObject.showToggleMenuHandler($(this));
                        });
                        /*
                            Event handler for "a" links inside the dropdown
                        */
                        appendEl.on('click', '.dropdown-menu a', function(e){
                            e.preventDefault();
                            eventHandlerObject.actionSelectionHandler($(this));
                        });
                        /*
                            Event handler for "Render" button
                        */
                        appendEl.on('click', renderSelectEl, function(e){
                            e.preventDefault();
                            App.loadPlainJSText( inputTextField );

                        });
                        eventHandlerObject = {
                            /*
                                EVENT HANDLER FUNCTION FOR THE "SHOW OBJECT" BUTTON CLICK

                                @param el
                            */
                            showRenderBtnHandler : function($this){
                                var className = targetContainer.attr('class'),//Get Button Class
                                    classNameShowIndex = className.indexOf('shown');//Get the index of text "shown" in the class
                                //Change the text depending on the state of the textarea
                                $this.find('span').html(classNameShowIndex > 0 ? 'Show' : 'Hide');
                                //Toggle pre-defined classes so that the UI will change accordingly.
                                targetContainer.toggleClass('hidden')
                                               .toggleClass('shown');
                                //SCROLL THE UI THE REQUIRED POSITION
                                this.scrollUI(targetContainer);
                            },
                            /*
                                FUNCTION TO SCROLL THE UI SO THAT THE TEXTAREA IS VISIBLE

                                @param DOM element which has to be focused
                            */
                            scrollUI : function(el){
                                $("html:not(:animated),body:not(:animated)").animate({
                                        scrollTop: el.offset().top
                                    }, 500);
                            },
                            /*
                                EVENT HANDLER FUNCTION FOR THE "ACTION SELECT" BUTTON CLICK

                                @param el
                            */
                            showToggleMenuHandler : function($this){
                                $this.closest('.btn-group')
                                    .toggleClass('open');
                            },
                            /*
                                EVENT HANDLER FUNCTIONS FOR THE LINKS IN THE DROPDOWN LIST

                                @param el
                            */
                            actionSelectionHandler : function($this){
                                var selectedValue = $this.text().toLowerCase().substring(0, 5); //Get the text of the element and do a substring to 5 characters
                                //Switch case
                                switch(selectedValue){
                                    /*
                                        CONDITIONS TO HANDLE WHEN THE PLAIN TEXT OR SERVER URL IS CLICKED
                                    */
                                    case 'plain':
                                    case 'serve':
                                        inputTextField.attr('disabled', false) //Enable the text button  
                                            .attr('placeholder', (selectedValue === 'plain') ? 'Enter the object eg., {"id" : 1, "start" : 60, "end" : 120}' : 'Enter URL')//Set the placeholder
                                            .show();//Show the Input Field
                                        $('#' + outerDivId).hide();//Hide the In-Build Events Div
                                        break;
                                    /*
                                        CONDITIONS TO HANDLE WHEN THE IN-BUILD OPTION IS SELECTED
                                    */
                                    case 'in-bu':
                                        var outerDiv = $('<div class="btn-toolbar" id="'+ outerDivId +'"></div>'),//Outermost div
                                            innerDiv = $('<div class="btn-group"></div>').appendTo(outerDiv),//Inner Div
                                            outerDivLength = $('#' + outerDivId).length,//Get the Length of the outer div
                                            indi_width = (inputTextFieldWidth/(preDefinedEvents.length)) - 20,//Computer the widh of each element
                                            div;//Empty Variable

                                        if(outerDivLength <= 0){//If OuterDiv is not present in the DOM. Create them
                                            $.each(preDefinedEvents, function(index, value){
                                                div = $('<a class="btn invoke-builtin">')
                                                    .attr({ href : value.name })
                                                    .css({ width : indi_width + 'px' })
                                                    .data('eventhook', value.hook)
                                                    .html('Event ' + (index + 1));
                                                innerDiv.append(div);
                                            });
                                            outerDiv.append(innerDiv)
                                                .insertAfter(inputTextField.hide());
                                        }else{//If the OuterDiv is present in the DOM just show it.`
                                            $('#' + outerDivId).show();
                                            inputTextField.hide();
                                        }
                                        this.appendActionToEventEl();
                                        break;
                                }   
                                $renderSelectEl.prop("disabled", (selectedValue === 'in-bu') ? true : false)//Enable or Disable the Render button depending on the condition
                                            .data('trigger', selectedValue);//Add a data-trigger to the button
                                $actionSelectEl.trigger('click');//Click on the "Action Button" so that it hides the drop-down list
                                $actionSelectElSpan.text(selectedValue + '...');//Replace the text of the Action Buton to show the selected option
                            },
                            /*
                                FUNCTION TO APPEND EVENTS TO THE LINKS INSIDE THE DROP DOWN LIST
                            */
                            appendActionToEventEl : function(){
                                appendEl.unbind('click.inbuild').on('click.inbuild', '.invoke-builtin', function(e){
                                    e.preventDefault();
                                    var $this = $(this);
                                    /*
                                        Call the respective funtion in the Global Object

                                        @param event variable name in config
                                    */
                                    App[$this.data('eventhook')]( $this.attr('href') );
                                });
                            }
                        };
                    }
                };
            }
            /*
                INITIAL LOAD RETURN FUNCTION TO LOAD THIS MODULE WITH THE NECESSARY FUNCTIONS
            */
            return {
                load : function(){
                    if(!instance){ instance = init(); }
                    return instance;
                }
            };
        }()),
        /*
            MODULAR PATTERN

            MODULE TO CREATE THE DATES ON THE LEFT HAND SIDE DYNAMIC.

            @return singleton
                createDivs
        */
        buildDate = (function(){
            var instance;
            function init(){
                return{
                    /*
                        FUNCTION TO CREATE THE TIMING <div> ON THE LEFT HAND SITE DEPENDING ON THE START AND END TIME

                        LOOPS THROUGHT THE START AND ENDTIME WITH THE PROVIDED INCREMENT VALUES

                        CONVERTS THE CORRESPONDING TIME TO DISPLAY TIME USING THE TIME LOGIC

                        CREATES DOCUMENTS FRAGMENTS OF THE <div> WITH THE CORRESPONDING TIME

                        ONCE THE LOOP IS COMPLETE APPENDS IT TO THE TARGET <div>
                    */
                    createDivs : function(){
                        var frag = document.createDocumentFragment(),
                            div,
                            increament = 30, //Incremental Value
                            divider = 60, //time interval
                            startTime = 0,//staring time
                            endTime = 720,//ending time
                            displayTimeStart = 9,//starting time to convert to text
                            resetCount = 0,//reset flag
                            modValue,//Modulas Value
                            outputText, //Final Output Text
                            targetEl = $('#timing');

                        /* LOOP FROM startTime to endTime */
                        for(startTime; startTime <= endTime; startTime = startTime + increament){
                            //Find the Modulas of startTime & divider
                            modValue = startTime % divider;
                            // Moulas == 0, then its a whole time
                            if(modValue === 0){
                                //Create the content which has to go inside the <div> 
                                outputText = ((displayTimeStart > 12) ? (displayTimeStart - 12).toString() : displayTimeStart.toString()) + ":00" + '<span class="time-small">' +((displayTimeStart >= 12)?' pm':' am') + '</span>';
                                //Increament the reset counter
                                ++resetCount;
                                
                            }else{
                                //Create the content which has to go inside the <div> 
                                outputText = '<span class="time-small">' + ((displayTimeStart > 12) ? (displayTimeStart - 12).toString() : displayTimeStart.toString()) + ":30" + ((displayTimeStart >= 12)?' pm':' am') + '</span>';
                                //Reset counter to 0
                                resetCount = 0;
                                //Increament the displayTime since we have cross the half hour mark
                                ++displayTimeStart;
                            }
                            //Create the <div>
                            div = $('<div />')
                                .css({
                                    'height' : '29.5px',
                                    'text-align' : 'right'
                                })
                                //Append the content
                                .html(outputText);
                            //Add the <div> to the fragment
                            frag.appendChild(div[0]);
                        }
                        //Append the fragmenet to the target container
                        targetEl.empty();
                        targetEl[0].appendChild(frag);
                    }
                };
            }
            return{
                /*
                    INITIAL LOAD RETURN FUNCTION TO LOAD THIS MODULE WITH THE NECESSARY FUNCTIONS
                */
                load : function(){
                    if(!instance){ instance = init(); instance.createDivs();}
                    return instance;
                }
            };
        }()),
        /*
            MODULAR PATTERN

            MODULE TO CREATE THE EVENT OBJECT WITH THE NECESSARY VALUES

            @return singleton
                getThingsDone
        */
        layOutDay = (function(){
            var instance;
            function init(){
                return{
                    /*
                        THIS IS THE FUNCTION WHERE THE MAGIC HAPPENS

                        @param events
                    */
                    getThingsDone : function(events){
                        var that = this;
                        that.columns = []; //Final Columns Array - Object Scope
                        that.lastEventEnding = null; //Last Event ending variable - Object Scope
                        that.baseEvents = events; //Events input - Global Scope
                        that.maxEndTime = block_width;//Width of the Container
                        /*
                            CALL METHOD TO MODIFY THE OBJECT TO HAVE BASIC PRE-DEFINED VALUES

                            @param original events object

                            USED THE PROXY OBJECT SO THAT I CAN EXECUTE THE FUNCTION IN THE CONTEXT OF THIS OBJECT
                        */
                        $.proxy(that.getInitialObjectBuild(that.baseEvents), that);
                        /*
                            CALL METHOD TO SORT THE ARRAY FROM FIRST startTime AND SECOND endTime

                            @param modified events object

                            USED THE PROXY OBJECT SO THAT I CAN EXECUTE THE FUNCTION IN THE CONTEXT OF THIS OBJECT
                        */
                        $.proxy(that.sortEventsBystartAndend(that.modifiedEvent), that);
                        /*
                            CALL METHOD TO FIND THE COLLIDING EVENTS AND ARRANGE THE COLUMNS

                            @param modified events object

                            USED THE PROXY OBJECT SO THAT I CAN EXECUTE THE FUNCTION IN THE CONTEXT OF THIS OBJECT
                        */
                        $.proxy(that.loopThroughEvent(that.modifiedEvent), that);
                        return that.modifiedEvent;
                    },
                    /* 
                        UPDATE THE INPUT OBJECT WITH THE BASIC PRE-DEFINED VALUES
                        :: ID
                        :: TOP
                        :: HEIGHT
                        :: BOTTOM
                    */
                    getInitialObjectBuild : function(obj){
                        this.modifiedEvent = $.map( obj, function(o, index){
                                //MAKE SURE THE START TIME IS GREATER THAN THE END TIME
                                if((o.start < o.end) && ( o.end <= block_height )){
                                    return{
                                        id : o.id,
                                        top : o.start,
                                        height : (o.end - o.start) - 2, // 2 is to take into consideration the padding on the top and the bottom of the container
                                        bottom : o.end
                                    };
                                }else{//ELSE RETURN NULL. MEANING OMIT THAT OBJECT FROM THE NEW ARRAY
                                    return null;
                                }
                            } );
                    },
                    /*
                        FUNCTION TO SORT THE EVENTS BY START TIME AND THEN BY END TIME

                        @param modified object
                    */
                    sortEventsBystartAndend : function(obj){
                        this.modifiedEvent = obj.sort(function(e1,e2){
                            if(e1.top < e2.top) {return -1;}
                            if(e1.top > e2.top) {return 1;}
                            if(e1.bottom < e2.bottom) {return -1;}
                            if(e1.bottom > e2.bottom) {return 1;}
                            return 0;
                        });
                    },
                    /*
                        THIS IS THE MAIN FUNCTION WHERE WE FIND THE COLLIDING EVENTS AND THEN COMPUTE THE WIDTH

                        @param modified object
                    */
                    loopThroughEvent : function(obj){
                        var that = this,
                            col;
                        /*
                            LOOP THROUGH THE ENTIRE SORTED OBJECT LIST 
                        */
                        $(obj).each(function(index, e){
                            /*
                                THIS IS THE FINAL FUNCTION WHICH RUNS ONCE ALL THE COLLIDING EVENTS ARE PALCED IN THE PROBLEM.

                                THIS WILL HELP TO RESET THE COLUMNS AND START REFRESH
                            */
                            if(that.lastEventEnding !== null && e.top >= that.lastEventEnding){
                                that.arrangeEventColumns(that.columns, block_width);
                                that.columns = [];
                                that.lastEventEnding = null;
                            }
                            //Place variable to check if this element is already placed
                            var placed = false,
                                i = 0, 
                                len = that.columns.length;
                            /*
                                LOOP THROUGH THE ENTIRE COLUMN LIST

                                1. CHECK IF THE LAST ELEMENT IN THE RESPECTIVE COLUMN IS COLLIDING WITH THE CURRENT ELEMENT IN THE LOOP.

                                2. IF IT DOES NOT COLLIDE PUSH THIS ELEMENT INTO THAT COLUMN

                                3. ELSE CONTINUE
                            */
                            for( i ; i < len; i++){
                                col = that.columns[i];
                                if(!that.findCollidingEvent(col[col.length - 1], e)){
                                    col.push(e);
                                    placed = true;
                                    break;
                                }
                            }
                            /*
                                IF THE ELEMENT IS COLLIDING THEN ADD THE ELEMENT TO A NEW COLUMN
                            */
                            if(!placed){
                                that.columns.push( [e] );
                            }
                            /*
                                CREATE A NEW REFERENCE TO THE LAST EVENT IN THAT COLUMN
                            */
                            if(that.lastEventEnding === null || e.bottom > that.lastEventEnding){
                                that.lastEventEnding = e.bottom;
                            }
                            /*
                                CALL THE FUNCTION TO COMPUTE THE WIDTH OF EACH OF THE ELEMENT IN THE COLUMNS
                            */
                            if(that.columns.length > 0){
                                that.arrangeEventColumns(that.columns, block_width);
                            }
                        });
                    },
                    /*
                        FUNCTION TO DETERMINE THE WIDTH AND THE LEFT POSITION OF THE EVENT ELEMENT

                        LEFT = (1/N) * CONTAINER WIDTH ----- WHERE N = NUMBER OF COLUMNS IN THAT LIST

                        WIDTH = CONTAINER WIDTH / N -------- WHERE N = NUMBER OF COLUMNS IN THAT LIST
                    */
                    arrangeEventColumns : function(columns, block_width){
                        var n = columns.length,
                            i,
                            j,
                            individual,
                            col,
                            colLength,
                            indi_width;

                        for(i = 0; i < n; i++){
                            col = columns[i];
                            colLength = col.length;
                            indi_width = block_width/n;
                            for(j = 0; j < colLength; j++){
                                individual = col[j];
                                individual.left = (i / n) * block_width;
                                individual.width = indi_width - 5;
                            }
                        }
                    },
                    /*
                        FUNCTION WILL RETURN TRUE: COLLIDING EVENT || FALSE: NON-COLLIDING EVENT
                    */
                    findCollidingEvent : function(a,b){
                        return (a.bottom >= b.top) && (a.top <= b.bottom);
                    }

                };
            }
            return{
                load : function(){
                    if(!instance){ instance = init(); }
                    return instance;
                }
            };
        }()),
        /*
            MODULAR PATTERN
            
            MODULE WILL BE A GLOBAL OBJECT WHICH WILL HANDLE MOST OF THE UI EVENTS

            @returns singleton
                createElement

                    @param event object
                    @param target container (private variable which was configured above)
        */
        uiEventAction = (function(){
            var instance,
                eventObj = layOutDay.load(), //Load the Layoutday Object
                dateObj = buildDate.load(),// Load the Date Object
                buildObj = buildBlocks.load(),//Load the build element object;
                completeEvents;

            function init(){
                buildObj.appendBtnEvent(); //Append Button Click Event
                return {
                    /*
                        EVENT HANDLER FUNCTION WHEN THE PLAIN JSON TEXT IS SELECTED AND RENDER BUTTON IS CLICKED
                    */
                    loadPlainJSText : function(el){
                        var elText = el.val(),
                            me = this,
                            objectText;
                        if(elText && elText !== ''){
                            try{//Try to create a JSOn object from the input text using $.parseJSON
                                me.objectText = $.parseJSON(elText);
                                me.returnBtnEvent(objectText);
                            }catch(err){//If JSON creation fails this function will fire
                                alert('Unacceptable Input Type' + err);
                            }
                        }else{
                            alert('Text box cannot be empty');
                        }

                    },
                    loadServerUrl : function(){
                        //Yet to be implemented
                    },
                    /*
                        COMMON FUNCTION WHICH WILL CONVERT THE GIVEN OBJECT TO THE DESIRED OBJECT

                        CREATE THE EVENT DIVS IN THE CONTAINER
                    */
                    returnBtnEvent : function(value){
                        var eObject;
                        if(value){
                            eObject = config[value]; //This is Evil. Need to fix
                        }else{
                            eObject = this.objectText;
                        }
                        completeEvents = eventObj.getThingsDone(eObject);
                        buildObj.createElement(completeEvents, appendTarget);

                    }
                };
            }
            return {
                load : function(){
                    if(!instance){ instance = init(); }
                    return instance;
                }  
            };
        }());
App = uiEventAction.load();
AppDirect = layOutDay.load();
}(jQuery, window.document));
