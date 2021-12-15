import { ACT_INIT_CHARACTOR_LIST, ACT_INIT_FULL_PRODUCT_CATALOGUE, ACT_UPDATE_PLANET_PRODUCT_STOCK_LIST, ACT_INIT_PLANET_LIST, ACT_INIT_FORMULA_LIST } from './ActionTypes'
import { DEFAULT_LINE_AMOUNT, DEFAULT_STOCK_TYPE_AMOUNT, DEFAULT_PLANET_LIST_LENGTH } from '../Misc/StaticVariables'

function get_empty_line_list(line_number = DEFAULT_LINE_AMOUNT){

	var planet_line_list=[]

	for(let i=0;i<=line_number;i++){
		planet_line_list.push({
			Line_Type:"line_type",
			Material_On_Line:[]
		});
	}

	return planet_line_list
}

function get_empty_stock_list(stock_type_amount = DEFAULT_STOCK_TYPE_AMOUNT){

	var planet_stock_list=[];

	for(let i=0;i<stock_type_amount;i++){
		planet_stock_list.push({
				Product_Name:"",
				Product_Qty:0
			}
		)
	}

	return planet_stock_list
}

function get_empty_planet(){

	return{
			Planet_ID:"PID",
			Line_List:[],
			Stock_List:[],
			Line_List_Named:[],
			Stock_List_Named:[]
	}
}

function init_charactor(name,planet_number){

	var new_charactor={
		Name:name,		
		Planet_List:[]
	}

	for(let i=0;i<planet_number;i++){
		new_charactor.Planet_List.push(get_empty_planet())
	}

	return new_charactor
}

var default_state = {
	RTD:[
		init_charactor('Syby',5),
		init_charactor('Xiaowei',5),
		init_charactor('Veronic',6)
	],
	FPC:[],
	LPC:[],
	PLL:[],
	FOL:[]
}

function rebuildNamedStockList(stock_list){

	var ret = {};
	stock_list.forEach(item=>{
		ret[item.Product_Name]=item.Product_Qty
	})

	return ret;
}

function updateLocalProductCatalogue(state){

		var product_catalogue_local = JSON.parse(JSON.stringify(state.LPC))

		state.RTD.forEach(charactor=>{
			charactor.Planet_List.forEach(planet=>{
				planet.Stock_List.forEach(product=>{
					if(product_catalogue_local.includes(product.Product_Name) === false){
						product_catalogue_local.push(product.Product_Name)
					}
				})
			})
		})

		state.LPC = product_catalogue_local
	}


export default (state = default_state,action)=>{
	if(action.type === ACT_INIT_CHARACTOR_LIST){
		var new_state = JSON.parse(JSON.stringify(state))
		new_state.RTD.splice(0,new_state.RTD.length)			//empty the whole array

		for(let i=0;i<action.charactor_list.length;i++){
			new_state.RTD.push(init_charactor(action.charactor_list[i].CharactorName,DEFAULT_PLANET_LIST_LENGTH))

			for(let j=1; j<=DEFAULT_PLANET_LIST_LENGTH; j++){
				let k = (j===DEFAULT_PLANET_LIST_LENGTH)?'V':j
				new_state.RTD[i].Planet_List[j-1].Planet_ID = action.charactor_list[i]['PlanetID_'+k]
			}
		}

		return new_state
	}

	if(action.type === ACT_INIT_FULL_PRODUCT_CATALOGUE){
		var new_state = JSON.parse(JSON.stringify(state))
		var full_product_catalogue = {};

		for(let i=0; i<action.product_catalogue.length; i++)
		{
			full_product_catalogue[action.product_catalogue[i].ProductName]={
				Product_Type:action.product_catalogue[i].ProductType,
				Product_Level:action.product_catalogue[i].ProductLevel
			}
		}
		new_state.FPC = full_product_catalogue
		return new_state;
	}

	if(action.type === ACT_INIT_PLANET_LIST){
		var new_state = JSON.parse(JSON.stringify(state))
		new_state.PLL = action.planet_list;
		return new_state;
	}

	if(action.type === ACT_UPDATE_PLANET_PRODUCT_STOCK_LIST){
		var new_state = JSON.parse(JSON.stringify(state))
		new_state.RTD[action.charactor_index].Planet_List[action.planet_index].Stock_List=action.product_stock_list
		new_state.RTD[action.charactor_index].Planet_List[action.planet_index].Stock_List_Named=rebuildNamedStockList(action.product_stock_list)
		updateLocalProductCatalogue(new_state)
		return new_state

	}

	if(action.type === ACT_INIT_FORMULA_LIST){
		var new_state = JSON.parse(JSON.stringify(state))
		console.log('reducer.js; FOL =', action.formula_list)
		new_state.FOL = action.formula_list
		console.log('reducer.js; new_state.FOL =', new_state.FOL)
		return new_state
	}

	return state
}