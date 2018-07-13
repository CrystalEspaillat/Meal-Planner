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

// create array to store recipe urls from firebase storage
var mealBookmarkArray = [];
//check firebase for bookmarks
database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val()
    mealBookmarkArray.push(sv.recipeDetails.recipeURL)
});

// when the user clicks the meal icon ...
$(".meal-icon").on("click", function() {

    var queryValue1;
    var queryValue2;

    queryValue1 = 0;
    queryValue2 = 6;

    // prepares content area for new info
    $('.content').empty();
    $('.content').html('<h1>Click or search a recipe for more info.</h1>');
    $('.bottom-menu').empty();

    var iconValue = $(this).attr('food-value');

    //slide icon to the top left
    $(".icon-div").addClass("animate slide-icon");
    $(".icon-div").removeClass("animate close-panels");


    // show hidden panels
    $(".right-side").addClass("display");
    $(".search-div").addClass("display");
    $(".menu-div").addClass("display");
    $(".back-arrow").addClass("display");


    // show content to the right
    $(".content").fadeIn(1050);

    $(this).attr('click-status' , 'yes');
    
    $('.meal-icon').hide();

    //hide other icons
    if($('.meal-icon').attr('click-status') === 'yes'){
        $(this).show();
    }

    // search bar function
    $('#submit').on('click' , function(event){
        queryValue1 = 0;
        queryValue2 = 6;
        event.preventDefault();
        // searches for user input within the meal of the icon clicked
        recipeAjaxCall(iconValue + ' ' + $('#search').val(), queryValue1 , queryValue2);
        $('.content').empty();
        $('.content').html('<h1>Click or search a recipe for more info.</h1>');
        $('.bottom-menu').empty();
    });

    //ajax query function
    recipeAjaxCall(iconValue , queryValue1 , queryValue2);

    $('#more').on('click' , function(event){
        event.preventDefault();
        if($('#search').val() ===""){
            queryValue1 = queryValue1+6;
            queryValue2 = queryValue2+6;
            recipeAjaxCall(iconValue , queryValue1 , queryValue2);
        }else{
            queryValue1 = queryValue1+6;
            queryValue2 = queryValue2+6;
            recipeAjaxCall(iconValue + ' ' + $('#search').val() , queryValue1 , queryValue2);
        };
    });
    
});

var recipeAjaxCall = function(food , numb1 , numb2){
    // Ajax call
    var queryURL = "https://api.edamam.com/search?q="+food+"&app_id=41e3ccd3&app_key=33a8b8ab0056c0569da2034a03312da0&from="+numb1+"&to="+numb2;
    // var queryURL = "https://api.edamam.com/search?q="+food+"&app_id=63cbc637&app_key=ce69f429d5076b739268cd396568280a&from="+numb1+"&to="+numb2;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function ajaxFollow(response){
        console.log(queryURL)

        //check firebase for bookmarks
        database.ref().on("child_added", function(snapshot) {
            var sv = snapshot.val()
            for(y=0 ; y < response.hits.length ; y++){
                //if the recipe is stored...
                if(response.hits[y].recipe.url === sv.recipeDetails.recipeURL){
                    // recipe's bookmark is turned to true
                    response.hits[y].bookmarked = true;
                    // firebase key is stored in the response
                    response.hits[y].fbKey = snapshot.key;
                }
            }
        });

        //Add text and values to Recipe Buttons
        for(j=0 ; j < response.hits.length ; j++){
            //removes color change from previous bookmarks
            $('#meal'+j).removeClass('color-change');
            //colors meal buttons if they are bookmarked
            if(mealBookmarkArray.includes(response.hits[j].recipe.url)){
                $('#meal'+j).addClass('color-change');
            };

            // Labels menu buttons
            $('#meal'+j).text(response.hits[j].recipe.label).val(j).attr('firebase-key' , 'x');

            // Recipe Buttons Click Event
            $('#meal'+j).on('click' , function(){

                //adds firebase key value to button for bookmarking purposes
                if(response.hits[this.value].bookmarked === true){
                    console.log(response.hits[this.value].fbKey)
                    $('#meal'+this.value).attr('firebase-key' , response.hits[this.value].fbKey);
                }

                //clear top and bottom to display data based on the Reciped Button clicked
                $('.content').empty();
                $('.bottom-menu').empty();

                // recipe yield fix
                if(response.hits[this.value].recipe.yield === 1){
                    if(response.hits[this.value].recipe.calories>=8000){
                        response.hits[this.value].recipe.yield = 14;
                    }else if(response.hits[this.value].recipe.calories>=6000){
                        response.hits[this.value].recipe.yield = 10;
                    }else if(response.hits[this.value].recipe.calories>=4000){
                        response.hits[this.value].recipe.yield = 7;
                    }else if(response.hits[this.value].recipe.calories>=2000){
                        response.hits[this.value].recipe.yield = 4;
                    }else if(response.hits[this.value].recipe.calories>=850){
                        response.hits[this.value].recipe.yield = 2;
                    }else if(response.hits[this.value].recipe.calories<850){
                        response.hits[this.value].recipe.yield = 1;
                    }
                };
                

                //Object created based on AJAX response
                var responseObject = {
                    recipeName: response.hits[this.value].recipe.label,
                    recipeYield: response.hits[this.value].recipe.yield,
                    recipeCalorie: Math.round(response.hits[this.value].recipe.calories/response.hits[this.value].recipe.yield),
                    recipeFat: Math.round(response.hits[this.value].recipe.totalNutrients.FAT.quantity/response.hits[this.value].recipe.yield),
                    recipeFatPercent: Math.round(response.hits[this.value].recipe.totalDaily.FAT.quantity/response.hits[this.value].recipe.yield),
                    recipeCarb: Math.round(response.hits[this.value].recipe.totalNutrients.CHOCDF.quantity/response.hits[this.value].recipe.yield),
                    recipeCarbPercent: Math.round(response.hits[this.value].recipe.totalDaily.CHOCDF.quantity/response.hits[this.value].recipe.yield),
                    recipeProtein: Math.round(response.hits[this.value].recipe.totalNutrients.PROCNT.quantity/response.hits[this.value].recipe.yield),
                    recipeProteinPercent: Math.round(response.hits[this.value].recipe.totalDaily.PROCNT.quantity/response.hits[this.value].recipe.yield),
                    recipeIngredients: response.hits[this.value].recipe.ingredientLines,
                    recipeImage:response.hits[this.value].recipe.image,
                    recipeLink: response.hits[this.value].recipe.url,
                    recipeBookmarked: response.hits[this.value].bookmarked
                }

                // create content to be appended to the right side
                var foodPic = $('<div>').css('background-image' , 'url("' + responseObject.recipeImage + '")').addClass('food-pic');
                var labelHead = $('<div>').attr('class' , 'food-label');
                labelHead.append($('<h1>').text(responseObject.recipeName));
                foodPic.append(labelHead);

                var yieldPrint = $('<p>').attr('class' , 'yield-print').text("Serves: " + responseObject.recipeYield);
                var ingredientList = $('<ol>').attr('class' , 'indgredient-list')

                for(i = 0; i < responseObject.recipeIngredients.length; i++){
                    var listItem = $('<li>').text(responseObject.recipeIngredients[i]);
                    ingredientList.append(listItem);
                }

                var headingRow = $('<tr>').html('<th>Cals</th> <th>Carbs</th> <th>Fats</th> <th>Protein</th>')
                var dataRow = $('<tr>');

                    //calorie amount for table
                var calorieValue = $('<td>').text(responseObject.recipeCalorie);
                dataRow.append(calorieValue);

                    //fat amount for table
                var fatValue = $('<td>').text(responseObject.recipeFat + response.hits[this.value].recipe.totalNutrients.FAT.unit);
                dataRow.append(fatValue);

                    //carb amount for table
                var carbValue = $('<td>').text(responseObject.recipeCarb + response.hits[this.value].recipe.totalNutrients.CHOCDF.unit);
                dataRow.append(carbValue);

                    //protein amount for table
                var proteinValue = $('<td>').text(responseObject.recipeProtein + response.hits[this.value].recipe.totalNutrients.PROCNT.unit);
                dataRow.append(proteinValue);

                var nutrientTable = $('<table>').attr('class' , 'nutrient-table')

                nutrientTable.append(headingRow , dataRow);

                $('.content').append(foodPic, nutrientTable, yieldPrint , ingredientList);

                // buttons created for bottom menu
                var seeRecipeDiv = $('<div>').text('See Recipe').attr('id' , 'see-recipe');
                var srLink = $('<a>').attr('href' , responseObject.recipeLink);
                seeRecipeDiv.append(srLink);
                $(seeRecipeDiv).click(function() {
                    window.location = $(this).find(srLink).attr("href"); 
                    return false;
                });

                var saveRecipeDiv = $('<div>').attr('id' , 'save-recipe').val(this.value);
                var seePlanDiv = $('<div>').text('See Plan').attr('id' , 'see-plan');
                var page2Link = $('<a>').attr('href' , 'page2.html');
                seePlanDiv.append(page2Link);
                $(seePlanDiv).click(function() {
                    window.location = $(this).find(page2Link).attr("href"); 
                    return false;
                });

                // text on Save Recipe button changes depending on if a recipe is saved or not
                if(responseObject.recipeBookmarked === true){
                    saveRecipeDiv.text('Recipe Saved')
                }else{
                    saveRecipeDiv.text('Save Recipe')
                }
                // adds buttons to the Bottom Menu
                $('.bottom-menu').append(seeRecipeDiv , saveRecipeDiv , seePlanDiv);

                // Save Recipe click event
                $('#save-recipe').on('click' , function(){
                    // if the recipe is not bookmarked...
                    if(responseObject.recipeBookmarked === false){
                        // marks the recipe as saved and changes the button to inform the user that the recipe is saved
                        response.hits[this.value].bookmarked = true;
                        $('#meal'+this.value).addClass("color-change");
                        responseObject.recipeBookmarked = response.hits[this.value].bookmarked;
                        saveRecipeDiv.text('Recipe Saved');
                        // pushes the recipe data to firebase
                        var fbRef = database.ref().push({
                            recipeName: responseObject.recipeName,
                            recipeDetails:{
                                calorieCount:responseObject.recipeCalorie,
                                carbCount: responseObject.recipeCarb,
                                carbPercent: responseObject.recipeCarbPercent,
                                fatCount: responseObject.recipeFat,
                                fatPercent: responseObject.recipeFatPercent,
                                proteinCount: responseObject.recipeProtein,
                                proteinPercent: responseObject.recipeProteinPercent,
                                recipeIngredients: responseObject.recipeIngredients,
                                recipeURL: responseObject.recipeLink
                            },
                        });
                        // gives the meal button a unique key that matches its firebase key value
                        $('#meal'+this.value).attr('firebase-key' , fbRef.key)
                    // if the recipe bookmarked and the button is pressed...
                    }else{
                        //removes color change since recipe is no longer bookmarked
                        $('#meal'+this.value).removeClass("color-change");
                        //removes link from bookmark reference array to avoid incorrect meal button coloring
                        var mealIndex=mealBookmarkArray.indexOf(responseObject.recipeLink);
                        if (mealIndex > -1) {
                            mealBookmarkArray.splice(mealIndex, 1);
                        };
                        // unsaves the recipe by making the bookmarked value false
                        response.hits[this.value].bookmarked = false;
                        responseObject.recipeBookmarked = response.hits[this.value].bookmarked;
                        // changes the text on the button back to how it was
                        saveRecipeDiv.text('Save Recipe')
                        // removes this recipe from firebase using the unique key value from the meal button
                        database.ref().child($('#meal'+this.value).attr('firebase-key')).remove();
                    }
                })
            })
        }
    })
}