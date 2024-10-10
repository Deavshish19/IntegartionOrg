import LightningDataTable from "lightning/datatable";
import customPicklistTemplate from "./customPicklist.html";
import editedPicklistTemplate from "./editPicklistTemplate.html";

export default class CustomDataType extends LightningDataTable {

    static customTypes = {
        
        customPicklist : {
            template : customPicklistTemplate,
            editTemplate : editedPicklistTemplate,
            standardCellLayout : true,
            typeAttributes : ["options","value","context"]
        }
    }
    
}