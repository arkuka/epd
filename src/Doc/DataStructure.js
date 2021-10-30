class RTD_Product extends Component{	/*产品信息*/
	constructor(props){
		super(props)
		this.state={
			Product_Type:"",		/*产品类型*/
			Product_Quantity:0,	/*产品数量*/			
		}
	}
}

class RTD_Line extends Component{	/*生产线信息*/
	constructor(props){
			super(props)
			this.state={
				Line_Type:"",		/*生产线类型，最终产品类型*/
				Line_Status:"",  	/*生产线状态，满载/半载/空载*/
				Raw_Materials:[]	/*生产线中原材料的类型和数量，类型为RTD_Production*/
			}
	}
}

class RTD_Planet extends Component{	/*行星信息*/
	constructor(props){
			super(props)
			this.state={
				Planet_ID:"",	/*行星编号*/
				Line_List:[],	/*生产线列表，类型为RTD_Line*/
				Stock_List:[]	/*现货产品列表，类型为RTD_Production*/

			}
	}
}

class RTD_Charactor extends Component{	/*角色信息*/
	constructor(props){
			super(props)
			this.state={
				Charactor_Name:"",	/*角色姓名*/
				Planet_List:[]/*行星列表，类型为RTD_Planet*/
			}
	}	
}




expandedRowRender_L1 = ()=>{
		const columns=[{
			title:'',			
		},
		]
		const datas=[
			'Line_List',
			'Stock_List'
		]

		return <Table
				columns={columns} 
				dataSource={datas} 
				expandedRowRender={this.expandedRowRender_L2}
				pagination={false} />;
	}

	expandedRowRender_L2 = ()=>{

		const columns=[{
			title:'Line-List',
			dataIndex:['Line_List','0','Line_Type']
		}]

		return <Table columns={columns} dataSource={this.state.RTD[0].Planet_List} pagination={false} />;
	}











CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_planet_production_details` AS select `a`.`PlanetType` AS `PlanetType`,`a`.`ProductionName` AS `ProductionName`,`a`.`ProductionLevel` AS `ProductionLevel` from (select `pp`.`PlanetType` AS `PlanetType`,`pc`.`ProductionName` AS `ProductionName`,`pc`.`ProductionLevel` AS `ProductionLevel` from (`epd`.`planet_production` `pp` join `epd`.`production_catalogue` `pc` on(`pp`.`ProductionType_1` = `pc`.`ProductionType` or `pp`.`ProductionType_2` = `pc`.`ProductionType` or `pp`.`ProductionType_3` = `pc`.`ProductionType` or `pp`.`ProductionType_4` = `pc`.`ProductionType` or `pp`.`ProductionType_5` = `pc`.`ProductionType`))) `a`




