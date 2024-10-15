import { api, LightningElement } from 'lwc';

export default class MealResultComponent extends LightningElement {

    @api mealResult;
    showModal=false;
    selectedMeal;

    handleButtonClick(event){
        const selectedMealId = event.currentTarget.dataset.id;
        console.log('selected meal Id: ', selectedMealId);
        this.selectedMeal = this.mealResult.find(meal => meal.idMeal === selectedMealId);
        console.log('selected meal: ', this.selectedMeal);
        this.showModal = true;
    }

    handleCancel(event){
        this.showModal = false;
        this.selectedMeal = null;
    }    
}