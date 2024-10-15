import { LightningElement } from 'lwc';

export default class MealHunt extends LightningElement {
    searchResult = [];
    searchMeal;
    async handleSearchClick(event){
        let meal = event.detail;
        console.log('searchMeal: ', meal);

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
        let data = await response.json();
        this.searchResult = data.meals;
        console.log('data: ', data,this.searchResult);
        
    }
}