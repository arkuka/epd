import { __AK_DEBUG__ } from './StaticVariables'

export const __ak_debug__ = (...args)=>{
	if(__AK_DEBUG__){
		console.log(...args)
	}
}