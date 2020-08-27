# draglayout

> 基于flex的可拖拽控制布局，类表格

## Build Setup

``` bash

npm install vue-drag-flex

main.js
import DragLayout from 'vue-drag-flex'
Vue.use(DragLayout)


# build for production with minification
npm run build
```
npm下载  
-
> npm install vue-drag-flex  

main.js   
-
> import DragLayout from 'vue-drag-flex'  
Vue.use(DragLayout)

template
-
>
```
<drag-layout mode="row" dl-height="200px" >
    <drag-layout-item dl-height="100%" dl-width="300px" :min-height="50">
    </drag-layout-item>
</drag-layou>
```
文档
-
drag-layout

|  属性   | 可选值  | 类型  | 说明 |
|  ----  | ----  |  ----  |  ----  |
| mode  | column、row | String | 分别为纵向布局与横向布局 |
| dl-height  | -- | String | 容器高度 |
| dl-width  | -- | String | 容易宽度 |

drag-layout-item

|  属性   | 可选值  | 类型  | 说明 |
|  ----  | ----  |  ----  |  ----  |
| dl-width  | -- | String | 初始宽度 |
| dl-height  | -- | String | 初始高度 |
| min-width  | -- | Number | 最小宽度，建议最小设为50；此单位为px |
| min-height  | -- | Number | 最小高度，建议最小设为50；此单位为px |

drag-layout-item与drag-layout可互相嵌套，形成类似表格的布局
