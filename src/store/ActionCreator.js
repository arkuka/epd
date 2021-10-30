import { ACT_ADD_NEW_PRODUCT_LINE, ACT_INIT_CHARACTOR_LIST, ACT_INIT_FULL_PRODUCT_CATALOGUE, ACT_UPDATE_PLANET_PRODUCT_STOCK_LIST, ACT_INIT_PLANET_LIST } from './ActionTypes'

export const Get_Act_Add_New_Product_Line = ()=>{
	return {
		type: ACT_ADD_NEW_PRODUCT_LINE
	}
}

export const Get_Act_Set_Product_Type = (product_type,qty)=>{
	return {
		type: ACT_ADD_NEW_PRODUCT_LINE,
		product_type,
		qty
	}
}

export const Get_Act_Init_Charactor_List = (charactor_list)=>{	
	return {
		type: ACT_INIT_CHARACTOR_LIST,
		charactor_list
	}
}

export const Get_Act_Update_Planet_Product_Stock_List = (charactor_index,planet_index,product_stock_list)=>{
	return {
		type:ACT_UPDATE_PLANET_PRODUCT_STOCK_LIST,
		charactor_index,
		planet_index,
		product_stock_list
	}
}

export const Get_Act_Init_Full_Product_Catalogue = (product_catalogue)=>{
	return {
		type:ACT_INIT_FULL_PRODUCT_CATALOGUE,
		product_catalogue
	}
}

export const Get_Act_Init_Planet_List = (planet_list)=>{
	return {
		type:ACT_INIT_PLANET_LIST,
		planet_list
	}
}