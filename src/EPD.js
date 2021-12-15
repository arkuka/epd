import React, { Component } from 'react'
import axios from 'axios'

import 'antd/dist/antd.css';
import store from './store'
import PlanetTable from './PlanetTable'
import SummaryTable from './SummaryTable'
import { Get_Act_Init_Charactor_List, Get_Act_Init_Full_Product_Catalogue, Get_Act_Init_Planet_List, Get_Act_Init_Formula_List } from './store/ActionCreator'
import { __ak_debug__ } from './Misc/AssistFunc'

class EPD extends Component{
	handleBtnClick_FetchData(){

		__ak_debug__("EPD::handleBtnClick");

		axios.get('http://localhost:5001/Charactor_List').then(function(response){
				__ak_debug__('EPD::handleBtnClick; Charactor_List = ', response.data)
				store.dispatch(Get_Act_Init_Charactor_List(response.data))
		})

		axios.get('http://localhost:5001/Planet_List').then(function(response){
				__ak_debug__('EPD::handleBtnClick; Planet_List = ', response.data)
				store.dispatch(Get_Act_Init_Planet_List(response.data))
		})
		
		axios.get('http://localhost:5001/Product_Catalogue').then(function(response){
				__ak_debug__('EPD::handleBtnClick; Product_Catalogue = ',response.data)
				store.dispatch(Get_Act_Init_Full_Product_Catalogue(response.data))
		})

		axios.get('http://localhost:5001/Formula_List').then(function(response){
				__ak_debug__('EPD::handleBtnClick; Formula_List = ',response.data)
				store.dispatch(Get_Act_Init_Formula_List(response.data))	
		})
	}	

	render(){
		return (
			<div>
				<button 
				onClick = {this.handleBtnClick_FetchData}
				style={{margin:'20px'}}
				> 
				Fetch data from DB
				</button>

				<br/>
				<SummaryTable/>
				<PlanetTable/>

			</div>
			);
	}
}

export default EPD
