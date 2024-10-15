import { LightningElement } from 'lwc';
import meal from "@salesforce/resourceUrl/meal";
export default class SearchMealComponent extends LightningElement {
    
    searchMeal
    mealImage= meal;
    handleSearchChange(event){
        this.searchMeal = event.target.value;
    }

    handleSearchClick(event){
        let searchEvent = new CustomEvent('searchclick',
            {
                detail : this.searchMeal
            }
        );
        this.dispatchEvent(searchEvent);
    }
}