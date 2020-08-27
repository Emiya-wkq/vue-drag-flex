<template>
    <div class="layout-box" style="display: flex" :style="{flexDirection: mode, height: dlHeight,width:dlWeight}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "drag-layout",
        data(){
            return {
            }
        },
        props: {
            // 竖向排列column，横向row
            mode: {
                type: String,
                default: 'row'
            },
            dlHeight: {
                type: String
            },
            dlWeight: {
                type: String
            },
        },
        mounted(){

        },
        provide(){
            return {
                'dragLayout' : this
            }
        },
        methods:{

        }
    }
</script>

<style scoped>
    .layout-box>>> .item-box:last-child .slider{
        display: none;
    }
</style>