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

var recipeCount = 0

database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();

    // calorie count
    var caloriePrint = $('<p>').text('Calories: ' + sv.recipeDetails.calorieCount);

    //macro table
    var carbTableData = $('<td>').text(sv.recipeDetails.carbCount + 'g')
    var carbPercent = $('<td>').text(sv.recipeDetails.carbPercent + '%')
    var carbRow = $('<tr>').append($('<td>').text('Carbs: ') , carbTableData , carbPercent)
    var fatTableData = $('<td>').text(sv.recipeDetails.fatCount + 'g')
    var fatPercent = $('<td>').text(sv.recipeDetails.fatPercent + '%')
    var fatRow = $('<tr>').append($('<td>').text('Fat: ') , fatTableData , fatPercent)
    var proteinTableData = $('<td>').text(sv.recipeDetails.proteinCount + 'g')
    var proteinPercent = $('<td>').text(sv.recipeDetails.proteinPercent + '%')
    var proteinRow = $('<tr>').append($('<td>').text('Protein: ') , proteinTableData , proteinPercent)

    var macroTable = $('<table>').append(carbRow , fatRow , proteinRow).css('width' , '400px')

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
                'width':400,
                'height':300
            };
            var chart = new google.visualization.PieChart(document.getElementById(chartPlace));

            chart.draw(data, options);
        }
    }

    var newChartDiv = $('<div>').attr('id' , 'chart_div' + snapshot.key);

    var totalDiv = $('<div>').attr('id' , snapshot.key + 'total-div')

    totalDiv.append(newChartDiv , caloriePrint , macroTable)

    $('#main_div').append(totalDiv);
    
    console.log(snapshot.key)

    chartGen('chart_div'+snapshot.key);


})
database.ref().on("child_removed", function(snapshot) {
    $('#' + snapshot.key +'total-div').remove();
})

