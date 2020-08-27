import DragLayout from './dragLayout/drag-layout'
import DragLayoutItem from './dragLayout/layout-item'
const dl = {}
dl.install= function(Vue){
  Vue.component(DragLayout.name,DragLayout)
  Vue.component(DragLayoutItem.name,DragLayoutItem)
}
export default dl
