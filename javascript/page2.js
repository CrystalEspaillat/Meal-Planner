
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDRRlJBFRbxKDSBiBJ3Wh3bvxcQoDG58xU",
    authDomain: "meal-planner-bc401.firebaseapp.com",
    databaseURL: "https://meal-planner-bc401.firebaseio.com",
    projectId: "meal-planner-bc401",
    storageBucket: "meal-planner-bc401.appspot.com",
    messagingSenderId: "259465467512"
};
firebase.initializeApp(config);

var database = firebase.database();
//toggle variables
var toggle = $('.toggleButton');
var toggleD= $('#toggle-container');
var toggleNumber;
//toggle function runners
$(window).on("load", toggler);
$(document).on("click", ".inner-container", toggler);
$(document).on("click", "#page1", goBack);
$(document).on("click", "#emailMe", mailBox);
//toggle function -- true is list, false is macros 
//the css change is just to illustrate where the data will be dumped
function toggler () {
    toggleNumber =!toggleNumber

    if (toggleNumber === false) {

        $('.infoBox').empty();
        //Macro Dump
        $(".inner-container:nth-child(2)").css({"background": "whitesmoke", "color": "#a9a9a9"});
        $(".inner-container:first-child").css({"background": "#DA4E46", "color": "white"})
        $(".infoBox").css({"background": "#C4E5A9"})  
        database.ref().on("child_added", function(snapshot) {
            var sv = snapshot.val();

            var removeButton = $('<button>').text('remove').addClass('remove-macro').val(snapshot.key);

            removeButton.on('click' , function(){
                database.ref().child(this.value).remove();
            })
        
            // calorie count
            var calorieTableData = $('<td>').text(sv.recipeDetails.calorieCount);

            //macro table
            var calorieRow = $('<tr>').append($('<td>').text('Calories: ') , calorieTableData , $('<td>').text('Daily Value'))
            var carbTableData = $('<td>').text(sv.recipeDetails.carbCount + 'g')
            var carbPercent = $('<td>').text(sv.recipeDetails.carbPercent + '%')
            var carbRow = $('<tr>').append($('<td>').text('Carbs: ') , carbTableData , carbPercent)
            var fatTableData = $('<td>').text(sv.recipeDetails.fatCount + 'g')
            var fatPercent = $('<td>').text(sv.recipeDetails.fatPercent + '%')
            var fatRow = $('<tr>').append($('<td>').text('Fat: ') , fatTableData , fatPercent)
            var proteinTableData = $('<td>').text(sv.recipeDetails.proteinCount + 'g')
            var proteinPercent = $('<td>').text(sv.recipeDetails.proteinPercent + '%')
            var proteinRow = $('<tr>').append($('<td>').text('Protein: ') , proteinTableData , proteinPercent)
        
            var macroTable = $('<table id=macroTable>').append(calorieRow, carbRow , fatRow , proteinRow).css('width' , '400px')
        
           //macro pie chart
            var chartGen = function(chartPlace){
                // Load the Visualization API and the corechart package.
                google.charts.load('current', {'packages':['corechart']});
                // Set a callback to run when the Google Visualization API is loaded.
                google.charts.setOnLoadCallback(drawChart);
        
                function drawChart() {
        
                    var data = google.visualization.arrayToDataTable([
                        ['Macro', 'Value in grams'],
                        ['Carbs', sv.recipeDetails.carbCount],
                        ['Proteins', sv.recipeDetails.proteinCount],
                        ['Fats', sv.recipeDetails.fatCount]
                    ]);
        
                    var options = {
                        title: sv.recipeName,
                        width: 400,
                        height: 240,
                        colors: ['#B2E0E6', '#F9B44C', '#DA4E46'],
                        is3D: true,
                        backgroundColor: { fill:'transparent' }

                      
                    };
                    var chart = new google.visualization.PieChart(document.getElementById(chartPlace));
        
                    chart.draw(data, options);
                }
            }
        
            var newChartDiv = $('<div>').attr('id' , 'chart_div' + snapshot.key);
        
            var totalDiv = $('<div>').attr('id' , snapshot.key + 'total-div-macro').addClass("chart")
        
            totalDiv.append(newChartDiv , macroTable , removeButton)
        
            $('.infoBox').append(totalDiv);
            $('.chart').fadeIn(800000);
            
            console.log(snapshot.key)
        
            chartGen('chart_div'+snapshot.key);
        
        
        });
        database.ref().on("child_removed", function(snapshot) {
            $('#' + snapshot.key +'total-div').remove();
        });    
    } else {//toggleNumber === true//
        //List Dump
        $('.infoBox').empty();
        
        database.ref().on("child_added", function(snapshot) {
            var sv = snapshot.val();
            var recipeHeading = $('<h1>').text(sv.recipeName).addClass('ingredient-heading')
            var ingredientList = $('<ol>').addClass('ingredient-list')
            console.log(sv.recipeDetails.recipeIngredients)
            for(i=0 ; i<sv.recipeDetails.recipeIngredients.length ; i++){
                var ingredientListItem = $('<li>').text(sv.recipeDetails.recipeIngredients[i]);
                ingredientList.append(ingredientListItem)
            }
            var removeButton = $('<button>').text('remove').addClass('remove-list').val(snapshot.key);

            removeButton.on('click' , function(){
                database.ref().child(this.value).remove();
            })

            var totalDiv = $('<div>').attr('id' , snapshot.key + 'total-div-list');
            totalDiv.append(recipeHeading , ingredientList , removeButton);
            $('.infoBox').append(totalDiv);
        
        
        });
        database.ref().on("child_removed", function(snapshot) {
            $('#' + snapshot.key +'total-div-macro').remove();
            $('#' + snapshot.key +'total-div-list').remove();
        });    
        $(".inner-container:nth-child(2)").css({"background": "#DA4E46", "color": "white"});
        $(".inner-container:first-child").css({"background": "whitesmoke", "color": "#a9a9a9"})        
        $(".infoBox").css({"background": "#F6E3BC"})      
    }
    console.log(toggleNumber)
};
//button function to page1 
function goBack () {
    window.location='index.html';
  };

//send to mailbox function 
function mailBox () {
   window.location="https://mail.google.com/";
};
