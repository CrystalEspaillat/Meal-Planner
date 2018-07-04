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

    // Ajax call
    food="breakfast";
    var queryURL = "https://api.edamam.com/search?q="+food+"&app_id=41e3ccd3&app_key=33a8b8ab0056c0569da2034a03312da0&from=0&to=6";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function ajaxFollow(response){
        for(j=0 ; j < response.hits.length ; j++){
            $('#meal'+j).text(response.hits[j].recipe.label).val(j);

            // Recipe Buttons Click Event
            $('#meal'+j).on('click' , function(){
                console.log(this.value);

                recipeContent.empty();

                var recipeYield = response.hits[this.value].recipe.yield;

                var foodPic = $('<div>').css('background-image' , 'url("' + response.hits[this.value].recipe.image + '")').addClass('food-pic');
                var labelHead = $('<h1>').attr('class' , 'food-label').text(response.hits[this.value].recipe.label);
                foodPic.append(labelHead);
                var yieldPrint = $('<p>').attr('class' , 'yield-print').text("Serves: " + recipeYield);

                var ingredientList = $('<ol>').attr('class' , 'indgredient-list')

                for(i = 0; i < response.hits[this.value].recipe.ingredientLines.length; i++){
                    var listItem = $('<li>').text(response.hits[this.value].recipe.ingredientLines[i]);
                    ingredientList.append(listItem);
                }

                var recipeURL = $('<a>').attr('class' , 'recipe-url').text("click here for recipe");
                recipeURL.attr('href' , response.hits[this.value].recipe.url);

                var headingRow = $('<tr>').html('<th>Cals</th> <th>Carbs</th> <th>Fats</th> <th>Protein</th>')
                var dataRow = $('<tr>');

                //calorie amount
                var calorieValue = $('<td>').text(Math.round(response.hits[this.value].recipe.calories/recipeYield));
                dataRow.append(calorieValue);

                //fat amount and daily value
                var fatValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalNutrients.FAT.quantity/recipeYield) + response.hits[this.value].recipe.totalNutrients.FAT.unit);
                // var dailyFatValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalDaily.FAT.quantity/recipeYield) + '%');
                dataRow.append(fatValue);

                //carb amount and daily value
                var carbValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalNutrients.CHOCDF.quantity/recipeYield) + response.hits[this.value].recipe.totalNutrients.CHOCDF.unit);
                // var dailyCarbValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalDaily.CHOCDF.quantity/recipeYield) + '%');
                dataRow.append(carbValue);

                //protein amount and daily value
                var proteinValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalNutrients.PROCNT.quantity/recipeYield) + response.hits[this.value].recipe.totalNutrients.PROCNT.unit);
                // var dailyProteinValue = $('<td>').text(Math.round(response.hits[this.value].recipe.totalDaily.PROCNT.quantity/recipeYield) + '%');
                dataRow.append(proteinValue);

                var nutrientTable = $('<table>').attr('class' , 'nutrient-table')

                nutrientTable.append(headingRow , dataRow);

                // nutrientTable.append(headingRow , calorieRow , fatRow , carbRow , proteinRow);

                recipeContent.append(foodPic, nutrientTable, yieldPrint , ingredientList , recipeURL)

                recipeContent.append(recipeContent)
            })
        }
    })
});