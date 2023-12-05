
let tabCounter =  2;
$(document).ready(function(){

  $('#multForm').on('blur keyup change click', function () {
    if ($('#multForm').validate().checkForm()) {
          $('#add').prop('disabled', false); // enables new tab button
          processing();
    }
    else {
          $('#add').prop('disabled', true); // disables new tab button
    }
  });

  //Validation rules for form
  jQuery.validator.addClassRules('numbox', {
    required: true,
    isInt: true,
    inRange: true
  });
  
  var tabs = $("#tabs").tabs();
  $("#add").on( "click", function() {
    addTab();
  });
  if($('#multForm').valid()){processing();}
  addSliders();

  tabs.on( "click", "span.ui-icon-close", function() {
    var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    $( "#" + panelId ).remove();
    tabs.tabs( "refresh" );
  });

  $("#deleteTabs").on("click", function() {
    $("#tabs li").not(':first').remove();
    $('[id^="tabs-"]:not(:first)').remove()
     tabs.tabs( "refresh" );
     tabCounter = 2;
 });
    
});

//Extra validator method to confirm number is an int
jQuery.validator.addMethod("isInt", function(value, element) {
  return this.optional(element) || (Number.isInteger(parseFloat(value)));
}, "Entered a non integer value, please enter integers only.");

//Extra validator method to confirm number is in range
jQuery.validator.addMethod("inRange", function(value, element) {
  return this.optional(element) || (-50 <= value) && (value <= 50);
}, "Please enter an integer between -50 and 50");


function processing() {

    //form input values.
    let startRow = document.getElementById("Hstart").value;
    let startCol = document.getElementById("Vstart").value;
    let endRow = document.getElementById("Hend").value;
    let endCol = document.getElementById("Vend").value;

    //Get table via ID
    let table = document.getElementById("myTable");
    table.innerHTML = "";
    var tbody = document.createElement('tbody');
  
    var headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // empty corner cell

    
    //Error checking for end of row/col being smaller then start
    if(parseInt(startRow) > parseInt(endRow)){
      let i = startRow;
      startRow = endRow;
      endRow = i;
    }

    if(parseInt(startCol) > parseInt(endCol)){
      let j = startCol;
      startCol = endCol;
      endCol = j;
    }


  // Loops for filling table with appropriate multiplied numbers.
    for (var col = parseInt(startCol); col <= parseInt(endCol); col++) {
      var th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    }
    tbody.appendChild(headerRow);

    for (var row = parseInt(startRow); row <= parseInt(endRow); row++) {
      var tr = document.createElement('tr');
      var thRow = document.createElement('th');
      thRow.textContent = row;
      tr.appendChild(thRow);

      for (var col = parseInt(startCol); col <= parseInt(endCol); col++) {
        var td = document.createElement('td');
        td.textContent = row * col;
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    // return false;
};


//add slider to each num text box
function addSliders(){
    $('.slider').each(function(){
        var i = $(this).attr('id').split('_').pop();
        var s = $(this).attr('id');
        $(this).slider({ range: "min", value: 0, step: 1, min: -50, max: 50,
        slide: function( event, ui ) { $('#' + i).val(ui.value);
          if($('#multForm').valid()){ processing();}}
        });

        $("#" + i).change(function () {
          var value = this.value;
          console.log(value);
          if(value == ""){value = 0;}
          $("#" + s).slider("value", parseInt(value));
        });
    });
}

function addTab(){
    var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
    var tabs = $("#tabs").tabs();

    //form input values.
    let startRow = document.getElementById("Hstart").value;
    let startCol = document.getElementById("Vstart").value;
    let endRow = document.getElementById("Hend").value;
    let endCol = document.getElementById("Vend").value;

    //Error checking for end of row/col being smaller then start
    if(parseInt(startRow) > parseInt(endRow)){
      let i = startRow;
      startRow = endRow;
      endRow = i;
    }

    if(parseInt(startCol) > parseInt(endCol)){
      let j = startCol;
      startCol = endCol;
      endCol = j;
    }

    //set up new taabs and add table to them
    var label = startCol + ' to ' + endCol + ' x ' + startRow + ' to ' +  endRow,
    id = "tabs-" + tabCounter,
    li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
    tabContentHtml = $("#myTable").html();
    console.log(id);

    tabs.find( ".ui-tabs-nav" ).append( li );
    tabs.append( "<div id='" + id + "'><table id='myTable'>" + tabContentHtml + "</table></div>" );
    tabs.tabs( "refresh" );
    tabCounter++;
    console.log(tabCounter);
}