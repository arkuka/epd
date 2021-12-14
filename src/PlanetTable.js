import { Component, Fragment } from 'react'

import store from './store'
import axios from 'axios'
import copy  from 'copy-to-clipboard'

import { Input, Table } from 'antd'

import './sass/epd.scss'

import { PLANET_TABLE_SELECTED_CELL_BG_COLOR, PLANET_INDEX_SHIFT_FROM_COLUMN_INDEX } from './Misc/StaticVariables'
import { DEFAULT_VOLUME_PER_UNIT_P0, DEFAULT_VOLUME_PER_UNIT_P1, DEFAULT_VOLUME_PER_UNIT_P2, DEFAULT_VOLUME_PER_UNIT_P3, DEFAULT_VOLUME_PER_UNIT_P4, DEFAULT_VOLUME_PER_UNIT_NA } from './Misc/StaticVariables'
import { PRODUCT_LEVEL_0, PRODUCT_LEVEL_1, PRODUCT_LEVEL_2, PRODUCT_LEVEL_3, PRODUCT_LEVEL_4, PRODUCT_LEVEL_AMOUNT } from './Misc/StaticVariables'
import { CLASSNAME_PRODUCT_LEVEL_0, CLASSNAME_PRODUCT_LEVEL_1, CLASSNAME_PRODUCT_LEVEL_2, CLASSNAME_PRODUCT_LEVEL_3, CLASSNAME_PRODUCT_LEVEL_4, CLASSNAME_PRODUCT_LEVEL_NA } from './Misc/StaticVariables'
import { CLASSNAME_SUB_TABLE_PRODUCT_CELL } 				from './Misc/StaticVariables'
import { CLASSNAME_SELECTED_CELL } 							from './Misc/StaticVariables'
import { CLASSNAME_PRODUCT_TYPE_LEADING_HEAD } 				from './Misc/StaticVariables'
import { CLASSNAME_ANT_INPUT_DISABLED } 					from './Misc/StaticVariables'
import { HTTP_STATUS_CODE_OK, HTTP_STATUS_CODE_ACCEPTED } 	from './Misc/StaticVariables'

import { Get_Act_Update_Planet_Product_Stock_List } 		from './store/ActionCreator'

import { __ak_debug__ } 									from './Misc/AssistFunc'




const { TextArea } = Input

/****************************************
*										*
*										*
*	     Component: PlanetTable 		*
*										*
*										*
****************************************/
class PlanetTable extends Component{

	constructor(props){
		super(props);

		this.renderSubTables 					= this.renderSubTables.bind(this)
		this.expandedRowRender_L2_Line_List 	= this.expandedRowRender_L2_Line_List.bind(this)
		this.expandedRowRender_L2_Stock_List 	= this.expandedRowRender_L2_Stock_List.bind(this)

		this.handleStoreChange 					= this.handleStoreChange.bind(this)

		this.handleUserInput	 				= this.handleUserInput.bind(this)
		this.handleRowClick 					= this.handleRowClick.bind(this)

		this.handleClickCopy					= this.handleClickCopy.bind(this)
		this.handleClickClean					= this.handleClickClean.bind(this)

		this.getPlanetIndexByPlanetID			= this.getPlanetIndexByPlanetID.bind(this)
		this.getProductVolumePerUnit			= this.getProductVolumePerUnit.bind(this)
		this.getClassNameByProductLevel			= this.getClassNameByProductLevel.bind(this)
		this.getClassNameByProductType			= this.getClassNameByProductType.bind(this)

		this.state = {
			m_Charactor_Info:			store.getState().RTD,
			m_Full_Product_Catalogue:	[],
			m_Local_Product_Catalogue:	[],
			m_RE_Base_Rule: 			/[A-Z a-z-]+[\s]+[1-9][0-9]*[\.]?[0-9]*[\s]+[1-9][0-9]*[\.]?[0-9]*[\s]*m3/g,
			m_RE_Name_Rule: 			/^[A-Za-z][A-Z a-z-]*[A-Z a-z]+/g,
			m_RE_Qty_Rule:		 		/[1-9][0-9]*[\.]?[0-9]*/g,
			m_Current_Selected_Row: 	null,
			m_Current_Selected_Col: 	null,
			m_Last_Selected_Cell:		null
		}

		store.subscribe(this.handleStoreChange)
	}

	handleStoreChange(){

		__ak_debug__('PlanetTable::handleStoreChange')

		this.setState({
						m_Charactor_Info			: store.getState().RTD,
					   	m_Full_Product_Catalogue	: store.getState().FPC,
					   	m_Local_Product_Catalogue	: store.getState().LPC
					  },
					  ()=>{
						   	axios.post('http://localhost:5001/Stock_List', this.state.m_Charactor_Info)
						   	.then((response)=>{
						   		if(response.data && response.data.status===HTTP_STATUS_CODE_ACCEPTED){
						   			setTimeout(axios.get('http://localhost:5001/Operation_Result?uuid='+response.data.uuid)
						   							.then((res)=>{
						   								/* ... */
						   							}),
						   					   response.data.pending)
						   		}
						   	})
					   })
	}

	handleClickCopy(event, text, record, charactorIndex){

		__ak_debug__('PlanetTable::handleClickCopy')

		var copied = ""
		var planet_index = this.getPlanetIndexByPlanetID(charactorIndex,record.Planet_ID)

		for(let i=0; i<this.state.m_Charactor_Info[charactorIndex].Planet_List[planet_index].Stock_List.length; i++){

			copied +=  this.state.m_Charactor_Info[charactorIndex].Planet_List[planet_index].Stock_List[i].Product_Name
			         + " " 
			         + this.state.m_Charactor_Info[charactorIndex].Planet_List[planet_index].Stock_List[i].Product_Qty
			         + " "
					 + this.state.m_Charactor_Info[charactorIndex].Planet_List[planet_index].Stock_List[i].Product_Qty * this.getProductVolumePerUnit(store.getState().FPC[this.state.m_Charactor_Info[charactorIndex].Planet_List[planet_index].Stock_List[i].Product_Name].Product_Level)
					 + " m3\r"
		}

		copy(copied)
	}

	getProductVolumePerUnit(productLevel){

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

	getClassNameByProductType(productType){
		return CLASSNAME_SUB_TABLE_PRODUCT_CELL + ' ' + (CLASSNAME_PRODUCT_TYPE_LEADING_HEAD+productType).toString().toLowerCase();
	}

	handleClickClean(event, text, record, charactorIndex){

		__ak_debug__('PlanetTable::handleClickClean')
		let action = Get_Act_Update_Planet_Product_Stock_List(	charactorIndex,
																this.getPlanetIndexByPlanetID(charactorIndex,record.Planet_ID),
												  				[]	)
		store.dispatch(action)
	}

	getPlanetIndexByPlanetID(charactorIndex, planetID){

		__ak_debug__('PlanetTable::getPlanetIndexByPlanetID')

		for (let i=0; i<this.state.m_Charactor_Info[charactorIndex].Planet_List.length; i++){

			if(planetID === this.state.m_Charactor_Info[charactorIndex].Planet_List[i].Planet_ID){
				return i;
			}
		}

		return -1;
	}

	handleRowClick(rowIndex,event){

		__ak_debug__('PlanetTable::handleRowClick')

		if(this.state.m_Last_Selected_Cell !== null){
			this.state.m_Last_Selected_Cell.classList.remove(CLASSNAME_SELECTED_CELL)

		}

		this.setState({
						m_Current_Selected_Row:	rowIndex,
						m_Current_Selected_Col:	event.target.cellIndex,
						m_Last_Selected_Cell:	event.target
					  },
					  ()=>{
							this.state.m_Last_Selected_Cell.classList.add(CLASSNAME_SELECTED_CELL)
							var ta = document.getElementsByTagName("TextArea")
							if(ta && ta.length>0){								
								ta[0].disabled = undefined
								ta[0].classList.remove(CLASSNAME_ANT_INPUT_DISABLED)
								ta[0].value = ""
							}
						  }
					  )
	}

	handleUserInput(event){

		__ak_debug__('PlanetTable::handleUserInput')

		var planet_stock_list = []

		if(event.target.value != ""){
			var items = event.target.value.match(this.state.m_RE_Base_Rule)
		
			if(items === null){
				return;
			}

			if(this.state.m_Last_Selected_Cell === null){
				return;	
			}

			/*
			*
			*	Prepare Action
			*
			*/
			

			items.forEach((item,index)=>{
				var item_name 	= item.match(this.state.m_RE_Name_Rule)
				var item_qty 	= item.match(this.state.m_RE_Qty_Rule)

				if(item_name !== null && item_qty !== null){
					planet_stock_list.push({
						Product_Name:	item_name[0].trim(),
						Product_Qty:	item_qty[0].trim()
					})
				}
			})
		}		

		/*
		*
		*	Update Store
		*
		*/

		let action = Get_Act_Update_Planet_Product_Stock_List(	this.state.m_Current_Selected_Row,
												  				this.state.m_Current_Selected_Col-PLANET_INDEX_SHIFT_FROM_COLUMN_INDEX,
												  				planet_stock_list	)
		store.dispatch(action)
	}

	renderSubTables(record, rowIndex){

		__ak_debug__('PlanetTable::renderSubTables')

		var charactor_index = rowIndex;

		var subtable_cols = []

		subtable_cols.push({
			title:'Planet'	,
			dataIndex: 'Planet_ID',
			className: CLASSNAME_SUB_TABLE_PRODUCT_CELL,
			/*onCell:(planet_record, planet_rowIndex)=>{
				return 
			}*/
		})

		var product_level_list = [PRODUCT_LEVEL_0, PRODUCT_LEVEL_1, PRODUCT_LEVEL_2, PRODUCT_LEVEL_3, PRODUCT_LEVEL_4];
		for(let l=0; l<PRODUCT_LEVEL_AMOUNT; l++){
			for(let i=0; i<this.state.m_Local_Product_Catalogue.length; i++){
				if(this.state.m_Full_Product_Catalogue[this.state.m_Local_Product_Catalogue[i]].Product_Level===product_level_list[l]){
					subtable_cols.push({
						title:this.state.m_Local_Product_Catalogue[i],
						dataIndex:['Stock_List_Named',this.state.m_Local_Product_Catalogue[i]],
						className:this.getClassNameByProductType(this.state.m_Full_Product_Catalogue[this.state.m_Local_Product_Catalogue[i]].Product_Type),
						onCell:(product_record,product_rowIndex)=>{
						return {
									className:this.getClassNameByProductLevel(this.state.m_Full_Product_Catalogue[this.state.m_Local_Product_Catalogue[i]].Product_Level)
							   }
						}
					})
				}
			}
		}

		subtable_cols.push({
			title: 	'Action',
			key:	'action',
			className: CLASSNAME_SUB_TABLE_PRODUCT_CELL,
			render:	(text, record)=>{
				return(
					<Fragment>
						<a onClick={(event)=>{this.handleClickCopy(event,text,record,charactor_index)}}>Copy</a>
						<br/>
				        <a onClick={(event)=>{this.handleClickClean(event,text,record,charactor_index)}}>Clean</a>
				    </Fragment>
			      )
			}
		})


		return <Table
				bordered={'true'}
				columns={subtable_cols}
				dataSource={this.state.m_Charactor_Info[charactor_index].Planet_List}
				/*expandedRowRender={this.expandedRowRender_L2_Line_List}*/
				pagination={false}
				/>;
	}

	expandedRowRender_L2_Line_List = ()=>{

		const columns=[{
			title:'Line-List',
			dataIndex:['Line_List','0','Line_Type']
		}]

		return <Table columns={columns} dataSource={this.state.m_Charactor_Info.Planet_List} pagination={false} />;
	}

	expandedRowRender_L2_Stock_List = ()=>{

		const columns=[{
			title:'Line-List',
			dataIndex:['Line_List','0','Line_Type']
		}]

		/*return <Table columns={columns} dataSource={this.state.m_Charactor_Info.Planet_List} pagination={false} />;*/
	}

	m_Columns_Charactor_List=[
		{
			title:'Charactor',
			dataIndex:'Name'
		},
		{
			title:'Planet-A',
			dataIndex:["Planet_List","0","Planet_ID"]
		},
		{
			title:'Planet-B',
			dataIndex:["Planet_List","1","Planet_ID"]
		},
		{
			title:'Planet-C',
			dataIndex:["Planet_List","2","Planet_ID"]
		},
		{
			title:'Planet-D',
			dataIndex:["Planet_List","3","Planet_ID"]
		},
		{
			title:'Planet-E',
			dataIndex:["Planet_List","4","Planet_ID"]
		},
		{
			title:'Planet-F',
			dataIndex:["Planet_List","5","Planet_ID"]
		}
	];	

	render(){

		return (
			<Fragment>

			<TextArea
				disabled='true'
				className='epd-text-area'
				placeholder="Please paste product list here!"
				style={{width:'450px', height:'200px', margin:'20px'}}
				onChange = {(event)=>this.handleUserInput(event)}/>

			<br/>

			<Table
				dataSource={this.state.m_Charactor_Info}
				columns={this.m_Columns_Charactor_List} 
				rowKey={''} 
				expandedRowRender={this.renderSubTables}
				defaultExpandAllRows ={true}
				indentSize = {0}
				bordered=''
				pagination={false}
				style={{margin:'20px'}}
				onRow={(record, rowIndex) => {
				    return {
				      onClick: event => {this.handleRowClick(rowIndex, event);}, // click row
				      onDoubleClick: event => {}, // double click row
				      onContextMenu: event => {}, // right button click row
				      onMouseEnter:  event => {}, // mouse enter row
				      onMouseLeave:  event => {}, // mouse leave row
				    };
				  }}
			/>

			</Fragment>);
	}
}

export default PlanetTable