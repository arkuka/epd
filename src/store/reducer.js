import { ACT_INIT_CHARACTOR_LIST, ACT_INIT_FULL_PRODUCT_CATALOGUE, ACT_UPDATE_PLANET_PRODUCT_STOCK_LIST, ACT_INIT_PLANET_LIST, ACT_INIT_FORMULA_LIST } from './ActionTypes'
import { DEFAULT_LINE_AMOUNT, DEFAULT_STOCK_TYPE_AMOUNT, DEFAULT_PLANET_LIST_LENGTH } from '../Misc/StaticVariables'
import { PLANET_LAUNCHPAD_CAPACITY } from '../Misc/StaticVariables'
import { PRODUCT_TYPE_NA } from '../Misc/StaticVariables'
import { DEFAULT_VOLUME_PER_UNIT_P0, DEFAULT_VOLUME_PER_UNIT_P1, DEFAULT_VOLUME_PER_UNIT_P2, DEFAULT_VOLUME_PER_UNIT_P3, DEFAULT_VOLUME_PER_UNIT_P4, DEFAULT_VOLUME_PER_UNIT_NA } from '../Misc/StaticVariables'
import { PRODUCT_LEVEL_0, PRODUCT_LEVEL_1, PRODUCT_LEVEL_2, PRODUCT_LEVEL_3, PRODUCT_LEVEL_4, PRODUCT_LEVEL_AMOUNT } from '../Misc/StaticVariables'

function getProductVolumePerUnit(productLevel){

	switch(productLevel){
		case PRODUCT_LEVEL_0:
			return DEFAULT_VOLUME_PER_UNIT_P0;

		case PRODUCT_LEVEL_1:
			return DEFAULT_VOLUME_PER_UNIT_P1;

		case PRODUCT_LEVEL_2:
			return DEFAULT_VOLUME_PER_UNIT_P2;

		case PRODUCT_LEVEL_3:
			return DEFAULT_VOLUME_PER_UNIT_P3;

		case PRODUCT_LEVEL_4:
			return DEFAULT_VOLUME_PER_UNIT_P4;

		default:
			return DEFAULT_VOLUME_PER_UNIT_NA;
	}
}

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
			Launchpad_Occupy_Percentage:0,
			Line_List:[],
			Stock_List:[],
			Line_List_Named:[],
			Stock_List_Named:[],
			Short_Product_List:[],
			Redundant_Product_List:[]
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
	FPC:[],		// Full Product Catalogue
	LPC:[],		// Local Product Catalogue
	PLL:[],		// Planet List
	FOL:[],		// Formula List
	FPC_T2L:[]	// Full Product Catalogue - Type to Level
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


function getProductLevel(state, product){	
	return state.FPC[product.Product_Name].Product_Level
}

function recalculatePlanetLaunchpadOccupied(state){
	for(let charactor of state.RTD){
		for(let planet of charactor.Planet_List){
			planet.Launchpad_Occupy_Percentage = calculatePlanetLaunchpadOccupied(state,planet)
		}
	}
}

function calculatePlanetLaunchpadOccupied(state,planet){
	let occupied = 0

	for(let product of planet.Stock_List){
		occupied += getProductVolumePerUnit(getProductLevel(state,product))*product.Product_Qty
	}
	occupied = occupied / PLANET_LAUNCHPAD_CAPACITY
	occupied = parseInt(occupied*100)	
	return occupied
}

function recalculateShortAndRedundantProductList(state){

	for(let charactor of state.RTD){
		for(let planet of charactor.Planet_List){
			calculateShortAndRedundantProductList(state,planet)
		}
	}
}

function calculateShortAndRedundantProductList(state,planet){
	if(planet.Stock_List.length===0){
		return
	}

	var ret = {
		Short_Product_List:[],
		Redundant_Product_List:JSON.parse(JSON.stringify(planet.Stock_List))
	}

	var product_list = [];

	for (let p of ret.Redundant_Product_List){
		product_list.push(p.Product_Type)
	}

	for(let formula of state.FOL){
		if(isAppliable(formula,product_list,state)){
			console.log("isAppliable==TRUE; formula=",formula)
			console.log("isAppliable==TRUE; product_list=",product_list)
		}
	}

	/*for(let product of planet.Stock_List){
		ret.Short_Product_List.push(product);
		ret.Redundant_Product_List.push(product);
		consume(ret)
	}*/

	return ret;	
}

function consume(resource){
	
}

function isAppliable(formula, product_list,state){
	return isAppliable_Target(formula,state) && isAppliable_RowMaterial(formula, product_list)
}

function isAppliable_Target(formula,state){
	return state.FPC_T2L[formula.TargetID]===PRODUCT_LEVEL_2
		|| state.FPC_T2L[formula.TargetID]===PRODUCT_LEVEL_3
		|| state.FPC_T2L[formula.TargetID]===PRODUCT_LEVEL_4
}

function isAppliable_RowMaterial(formula, product_list){
	return (formula.RawMaterialID_1===PRODUCT_TYPE_NA || product_list.indexOf(formula.RawMaterialID_1)>=0)
		&& (formula.RawMaterialID_2===PRODUCT_TYPE_NA || product_list.indexOf(formula.RawMaterialID_2)>=0)
		&& (formula.RawMaterialID_3===PRODUCT_TYPE_NA || product_list.indexOf(formula.RawMaterialID_3)>=0)
		&& (formula.RawMaterialID_4===PRODUCT_TYPE_NA || product_list.indexOf(formula.RawMaterialID_4)>=0)
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
		var full_product_catalogue_type_2_level = {};

		for(let i=0; i<action.product_catalogue.length; i++)
		{
			full_product_catalogue[action.product_catalogue[i].ProductName]={
				Product_Type:action.product_catalogue[i].ProductType,
				Product_Level:action.product_catalogue[i].ProductLevel
			}
			full_product_catalogue_type_2_level[action.product_catalogue[i].ProductType]=action.product_catalogue[i].ProductLevel
		}
		new_state.FPC = full_product_catalogue
		new_state.FPC_T2L = full_product_catalogue_type_2_level
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
		recalculateShortAndRedundantProductList(new_state)
		recalculatePlanetLaunchpadOccupied(new_state)
		return new_state

	}

	if(action.type === ACT_INIT_FORMULA_LIST){
		var new_state = JSON.parse(JSON.stringify(state))
		new_state.FOL = action.formula_list
		return new_state
	}

	return state
}