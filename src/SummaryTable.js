import { Component, Fragment } from 'react'
import { Table } from 'antd'
import store from './store'

import './sass/epd.scss'

import { PRODUCT_LEVEL_0, PRODUCT_LEVEL_1, PRODUCT_LEVEL_2, PRODUCT_LEVEL_3, PRODUCT_LEVEL_4, PRODUCT_LEVEL_AMOUNT } from './Misc/StaticVariables'
import { CLASSNAME_PRODUCT_LEVEL_0, CLASSNAME_PRODUCT_LEVEL_1, CLASSNAME_PRODUCT_LEVEL_2, CLASSNAME_PRODUCT_LEVEL_3, CLASSNAME_PRODUCT_LEVEL_4, CLASSNAME_PRODUCT_LEVEL_NA } from './Misc/StaticVariables'
import { CLASSNAME_SUB_TABLE_PRODUCT_CELL } 				from './Misc/StaticVariables'
import { CLASSNAME_PRODUCT_TYPE_LEADING_HEAD } 				from './Misc/StaticVariables'

class SummaryTable extends Component{

	constructor(props){
		super(props)

		this.handleStoreChange 			= this.handleStoreChange.bind(this)
		this.updateProductStockList 	= this.updateProductStockList.bind(this)
		this.getClassNameByProductType	= this.getClassNameByProductType.bind(this)

		this.state={
			m_Charactor_Info:			store.getState().RTD,
			m_Full_Product_Catalogue:  	store.getState().FPC,
			m_Local_Product_Catalogue:	store.getState().LPC,
			m_Product_Stock_List:  		[]
		}

		store.subscribe(this.handleStoreChange)
	}

	handleStoreChange(){
		this.setState({
			m_Charactor_Info 			: store.getState().RTD,
			m_Full_Product_Catalogue 	: store.getState().FPC,
			m_Local_Product_Catalogue 	: store.getState().LPC
		},()=>{			
			this.updateProductStockList()
		})
	}

	updateProductStockList(){
		var product_stock_list = []

		let sum_product_stock_list = []
		this.state.m_Local_Product_Catalogue.forEach((lpc, lpc_index)=>{
			sum_product_stock_list[lpc]=0
		})

		this.state.m_Charactor_Info.forEach((ch,ch_index)=>{

			let invidual_product_stock_list = []
			this.state.m_Local_Product_Catalogue.forEach((lpc, lpc_index)=>{
				invidual_product_stock_list[lpc]=0
			})

			ch.Planet_List.forEach((pl,pl_index)=>{
				pl.Stock_List.forEach((pr, pr_index)=>{					
					invidual_product_stock_list[pr.Product_Name]	= invidual_product_stock_list[pr.Product_Name]+parseFloat(pr.Product_Qty)
					sum_product_stock_list[pr.Product_Name]			= sum_product_stock_list[pr.Product_Name]+parseFloat(pr.Product_Qty)
				})
			})

			product_stock_list.push({
				Name 				: ch.Name,
				Product_Stock_List 	: invidual_product_stock_list
			})
		})

		product_stock_list.push({
			Name 				: 'Sum',
			Product_Stock_List 	: sum_product_stock_list
		})

		console.log("product_stock_list=",product_stock_list)

		this.setState({
			m_Product_Stock_List : product_stock_list
		})
	}

	getClassNameByProductType(productType){
		return CLASSNAME_SUB_TABLE_PRODUCT_CELL + ' ' + (CLASSNAME_PRODUCT_TYPE_LEADING_HEAD+productType).toString().toLowerCase();
	}

	getClassNameByProductLevel(productLevel){

		switch(productLevel){
			case PRODUCT_LEVEL_0:
				return CLASSNAME_PRODUCT_LEVEL_0;

			case PRODUCT_LEVEL_1:
				return CLASSNAME_PRODUCT_LEVEL_1;

			case PRODUCT_LEVEL_2:
				return CLASSNAME_PRODUCT_LEVEL_2;

			case PRODUCT_LEVEL_3:
				return CLASSNAME_PRODUCT_LEVEL_3;

			case PRODUCT_LEVEL_4:
				return CLASSNAME_PRODUCT_LEVEL_4;

			default:
				return CLASSNAME_PRODUCT_LEVEL_NA;
		}
	}

	m_Columns_Summary=[];	

	render(){
		
		this.m_Columns_Summary = [
			{
				title		: "Charactor Name",
				dataIndex	: ["Name"],
				className  	: ""
			}
		]

		for(let i=0; i<this.state.m_Local_Product_Catalogue.length; i++){
			console.log("this.state.m_Local_Product_Catalogue[",i,"]=",this.state.m_Local_Product_Catalogue[i])
			this.m_Columns_Summary.push({
				title		: this.state.m_Local_Product_Catalogue[i],
				dataIndex	: ["Product_Stock_List",this.state.m_Local_Product_Catalogue[i]],
				className 	: this.getClassNameByProductType(this.state.m_Full_Product_Catalogue[this.state.m_Local_Product_Catalogue[i]].Product_Type),
				onCell:(product_record,product_rowIndex)=>{
					return {
								className:this.getClassNameByProductLevel(this.state.m_Full_Product_Catalogue[this.state.m_Local_Product_Catalogue[i]].Product_Level)
						   }
					}
			})
			console.log("this.m_Columns_Summary=", this.m_Columns_Summary)
			console.log("this.state.m_Product_Stock_List",this.state.m_Product_Stock_List)
		}

		/*this.m_Columns_Summary.push({
			title		: "Sum",
			dataIndex	
		})*/

		return(
			<Fragment>
				<Table
				dataSource={this.state.m_Product_Stock_List}
				columns={this.m_Columns_Summary}
				>
				</Table>
			</Fragment>)
	}
}

export default SummaryTable
