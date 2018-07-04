var food;
var recipeContent = $('.content');

// when the user clicks the meal icon ...
$(".meal-icon").on("click", function() {

    //slide icon to the top left
    $(".icon-div").addClass("animate slide-icon");

    // show hidden panels
    $(".right-side").addClass("display");
    $(".search-div").addClass("display");
    $(".menu-div").addClass("display");

    // show content to the right
    $(".content").fadeIn(1050);

    food="breakfast";
    var queryURL = "https://api.edamam.com/search?q="+food+"&app_id=63cbc637&app_key=ce69f429d5076b739268cd396568280a&from=0&to=6";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function ajaxFollow(response){
        for(j=0 ; j < response.hits.length ; j++){
            $('#meal'+j).text(response.hits[j].recipe.label).val(j);

            $('#meal'+j).on('click' , function(){
                console.log(this.value);

                recipeContent.empty();

                var recipeYield = response.hits[this.value].recipe.yield;

                var labelHead = $('<h1>').attr('class' , 'food-label').text(response.hits[this.value].recipe.label);
                var yieldPrint = $('<p>').attr('class' , 'yield-print').text("Serves: " + recipeYield);
                var foodPic = $('<img>').attr('src' , response.hits[this.value].recipe.image);

                var ingredientList = $('<ol>').attr('class' , 'indgredient-list')

                for(i = 0; i < response.hits[this.value].recipe.ingredientLines.length; i++){
                    var listItem = $('<li>').text(response.hits[this.value].recipe.ingredientLines[i]);
                    ingredientList.append(listItem);
                }

                var recipeURL = $('<a>').attr('class' , 'recipe-url').text("click here for recipe");
                recipeURL.attr('href' , response.hits[this.value].recipe.url);

                var headingRow = $('<tr>').html('<th></th><th>Amount Per Serving</th><th>Daily Percent</th>')

                //calorie amount
                var calorieLabel = $('<td>').html("<b>Calories</b>");
                var calorieValue = $('<td>').text(Math.round(response.hits[this.value].recipe.calories/recipeYield));
                var calorieRowSpacer  = $('<td>').text('')
                var calorieRow = $('<tr>').append(calorieLabel , calorieValue , calorieRowSpacer);

                //fat amount and daily value
                var fatLabel = $('<td>').html("<b>Total Fat</b>");
                var totalFatValue =  $('<td>').text(Math.round(response.hits[this.value].recipe.totalNutrients.FAT.quantity/recipeYield) + response.hits[this.value].recipe.totalNutrients.FAT.unit);
                var dailyFatValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalDaily.FAT.quantity/recipeYield) + '%');
                var fatRow = $('<tr>').append(fatLabel , totalFatValue , dailyFatValue);

                //carb amount and daily value
                var carbLabel = $('<td>').html("<b>Total Carbohydrate</b>");
                var totalCarbValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalNutrients.CHOCDF.quantity/recipeYield) + response.hits[this.value].recipe.totalNutrients.CHOCDF.unit);
                var dailyCarbValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalDaily.CHOCDF.quantity/recipeYield) + '%');
                var carbRow = $('<tr>').append(carbLabel , totalCarbValue , dailyCarbValue);

                //protein amount and daily value
                var proteinLabel = $('<td>').html("<b>Protein</b>");
                var totalProteinValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalNutrients.PROCNT.quantity/recipeYield) + response.hits[this.value].recipe.totalNutrients.PROCNT.unit);
                var dailyProteinValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalDaily.PROCNT.quantity/recipeYield) + '%');
                var proteinRow = $('<tr>').append(proteinLabel , totalProteinValue , dailyProteinValue);

                var nutrientTable = $('<table>').attr('class' , 'nutrient-table')

                nutrientTable.append(headingRow , calorieRow , fatRow , carbRow , proteinRow);

                recipeContent.append(labelHead , yieldPrint , foodPic , ingredientList , nutrientTable , recipeURL)

                recipeContent.append(recipeContent)
            })
        }
    })
});