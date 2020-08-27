<template>
    <div class="item-box" :style="{'width': width,'height': height}" ref="itemElement">
        <slot></slot>
        <div class="slider slider-row" v-if="dragLayout.mode==='row'" @mousedown="mousedown" ref="slider">

        </div>
        <div class="slider slider-columns" v-if="dragLayout.mode==='column'"  @mousedown="mousedown" ref="slider">

        </div>
    </div>
</template>

<script>
    export default {
        name: "drag-layout-item",
        inject:['dragLayout'],
        props: {
            'dl-width': {
                type: String,
                default: '100px'
            },
            'dl-height': {
                type: String,
                default: '100px'
            },
            // 目前拖拽事件有待优化，如果小于50，并且用户拖动过快。会导致闪烁抖动等问题，待优化
            'min-width':{
                type: Number,
                default: 50
            },
            'min-height':{
                type: Number,
                default:150
            }
        },
        data(){
            return {
                // 初始化时记录的宽高初始值（之后不再改变，只作记录）
                initialWidth: null,
                initialHeight: null,
                // 鼠标按下时记录原始宽高
                originWidth:'',
                originHeight:'',
                // 鼠标向左移动时脱离滑块时的位置
                divorcedLeft: null,
                // 鼠标向右移动时脱离滑块时的位置
                divorcedRight:null,
                // 鼠标向上移动时脱离滑块时的位置
                divorcedTop: null,
                // 鼠标向下移动时脱离滑块时的位置
                divorcedBottom: null,

                height: null,
                width: null,
                x:'',
                y:'',
                nextOriginWidth: null,
                nextOriginHeight: null
            }
        },
        mounted(){
            this.width=this.dlWidth
            this.height=this.dlHeight
            this.$nextTick(()=>{
                this.initialWidth = this.$refs['itemElement'].clientWidth
                this.initialHeight = this.$refs['itemElement'].clientHeight
            })
        },
        methods:{
            getNextIndex(){
                let nextIndex
                this.dragLayout.$children.forEach((item,index)=>{
                    if(item._uid === this._uid){
                        if(index+1 <= this.dragLayout.$children.length-1){
                            nextIndex = index+1
                        } else {
                            nextIndex = null
                        }
                    }
                })
                if (nextIndex){
                    return this.dragLayout.$children[nextIndex]
                } else {
                    return null
                }
            },
            // 记录鼠标脱离滑块时的位置
            divorced(event,type,range){
                let next = this.getNextIndex()
                if(type === 'left'){
                    let width = this.originWidth + range
                    if(width===next.minWidth){
                        this.divorcedLeft = event.x
                    } else if(width<next.minWidth){
                        // 由于用户并非逐像素拖动，所以可能导致实际上最后一次执行超出期望值，
                        // 在此计算并补足，以求得实际鼠标脱离的位置
                        this.divorcedLeft = event.x + next.minWidth- width
                    }
                }
                if (type === 'right'){
                    let width =  this.originWidth + range
                    let maxRange = parseInt(this.width) + parseInt(next.width)-next.minWidth
                    if(width === maxRange){
                        this.divorcedRight = event.x
                    } else if(width>maxRange){
                        // 由于用户并非逐像素拖动，所以可能导致实际上最后一次执行超出期望值，
                        // 在此计算并补足，以求得实际鼠标脱离的位置
                        this.divorcedRight = event.x + maxRange-width
                    }
                }
                if(type === 'top'){
                    // 向上移动，range为负数
                    let height = this.originHeight + range
                    if(height===next.minHeight){
                        this.divorcedTop = event.y
                        console.log( this.divorcedTop )
                    } else if(height<next.minHeight){
                        // 由于用户并非逐像素拖动，所以可能导致实际上最后一次执行超出期望值，
                        // 在此计算并补足，以求得实际鼠标脱离的位置
                        this.divorcedTop = event.y + next.minHeight- height
                        console.log( this.divorcedTop + 'px')
                    }

                }
                if (type === 'bottom'){
                    let height = this.originHeight + range
                    let maxRange = parseInt(this.height) + parseInt(next.height)-next.minHeight
                    if(height === maxRange){
                        this.divorcedBottom = event.y
                    } else if(height>maxRange){
                        // 由于用户并非逐像素拖动，所以可能导致实际上最后一次执行超出期望值，
                        // 在此计算并补足，以求得实际鼠标脱离的位置
                        this.divorcedBottom = event.y + maxRange-height
                        console.log( this.divorcedBottom + 'px')
                    }
                }
            },
            nextWidthChange(e){
                let next = this.getNextIndex()
                let rangeX = this.x-e.x
                let rangeY = this.y -  e.y
                if(this.dragLayout.mode==='row'){
                    // 可增加范围不可大于前一item的宽度减去最小宽度
                    if(rangeX>0){
                        let addRange = rangeX>this.originWidth-this.minWidth?this.originWidth-this.minWidth:rangeX
                        next.width = this.nextOriginWidth + addRange + 'px'
                    } else if(parseInt(next.width)>next.minWidth){
                        next.width = this.nextOriginWidth + rangeX + 'px'
                    }
                }
                if(this.dragLayout.mode==='column'){
                    next.height = this.nextOriginHeight + rangeY + 'px'
                }
            },
            mousedown(e){
                this.x=e.x
                this.y=e.y
                this.originWidth = e.target.parentNode.clientWidth
                this.originHeight = e.target.parentNode.clientHeight
                // 如果有下个item组件，则记录其宽度与高度
                if(this.getNextIndex()){
                    // 获取下个ite组件的元素
                    let nextItemElement = this.getNextIndex().$refs['itemElement']
                    this.nextOriginWidth = nextItemElement.clientWidth
                    this.nextOriginHeight = nextItemElement.clientHeight
                }
                document.body.addEventListener('mousemove',this.mousemove)
                document.body.addEventListener('mouseup',this.mouseup)
            },
            mousemove(e){
                e.preventDefault()
                this.dragCompute(e)
            },
            mouseup(){
                document.body.removeEventListener('mousemove',this.mousemove)
                document.body.removeEventListener('mouseup',this.mouseup)
            },
            // 拖动相关计算
            dragCompute(e){
                const compute = {
                    'row':()=>{
                        let rangeX = + e.x-this.x
                        if(rangeX>0){
                            // 可增加范围不可大于下一item的宽度减去最小宽度
                            this.divorced(e,'right',rangeX)
                            // 此处这样判断，防止初始化divorcedRight数值为0，导致初次不执行
                            // 只要用户没有向右脱离过滑块，那么该值始终为null
                            if (e.x<this.divorcedRight || this.divorcedRight===null){
                                this.width = this.originWidth + rangeX + 'px'
                                // 若有，并且未超出限制，处理下一个layout-item的变化(因为下个相邻item会执行当前相反操作，逻辑不在这里限制会有问题)
                                if(this.getNextIndex()){
                                    this.nextWidthChange(e)
                                }
                            }

                        } else if(parseInt(this.width)>this.minWidth){
                            this.divorced(e,'left',rangeX)
                            // 初始this.divorcedLeft为null，与数值进行比较时会转为0，但并不直接等于0
                            if(e.x>this.divorcedLeft){
                                this.width = this.originWidth + rangeX + 'px'
                                // 若有，并且未超出限制，处理下一个layout-item的变化(因为下个相邻item会执行当前相反操作，逻辑不在这里限制会有问题)
                                if(this.getNextIndex()){
                                    this.nextWidthChange(e)
                                }
                            }
                        }
                    },
                    'column':()=>{
                        let rangeY =  e.y-this.y
                        //数值为负数则为向上滑动，反之向下
                        if(rangeY>0){
                            this.divorced(e,'bottom',rangeY)
                            // 此处这样判断，divorcedBottom，导致初次不执行
                            // 只要用户没有向下脱离过滑块，那么该值始终为null
                            if(e.y<this.divorcedBottom || this.divorcedBottom === null){
                                this.height =  this.originHeight + rangeY + 'px'
                                // 若有，并且未超出限制，处理下一个layout-item的变化
                                if(this.getNextIndex()){
                                    this.nextWidthChange(e)
                                }
                            }
                        }else{
                            this.divorced(e,'top',rangeY)
                            if(e.y>this.divorcedTop){
                                this.height =  this.originHeight + rangeY + 'px'
                                // 若有，并且未超出限制，处理下一个layout-item的变化
                                if(this.getNextIndex()){
                                    this.nextWidthChange(e)
                                }
                            }
                        }

                    }
                }
                compute[this.dragLayout.mode]()
            }
        }
    }
</script>

<style scoped>
    .item-box{
        position: relative;

        height: 100%;
    }
    .slider{
        border: solid 1px black;
        position: absolute;
        background-color: white;
        z-index: 2;
    }
    .slider-row{
        width: 10px;
        height: 100%;
        top: 0;
        right: 0;

    }
    .slider-columns {
        width: 100%;
        height: 10px;
        bottom: 0;
        left: 0;
    }
</style>