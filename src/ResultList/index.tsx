import React, { useEffect, useState,useMemo } from "react";
import './index.css'

const ResultList = (props) => {
    console.log("propsresult",props);
    
    const [listSatte,setListState] = useState(props.listSatte)
    const [imgList,setImgList] = useState(props.imgList)
    const [actions,setActions] = useState(props.actions)

    //先加载组件再加载数据的
    useEffect(()=>{
        console.log("加载组件");
        // console.log(listSatte,"listSattelistSatte");
        console.log("listSattelistSatte",props.listSatte);
        console.log("actionsactions",props.imgList);
        console.log("imgListimgList",props.actions);
        
        setListState(props.listSatte)
        setImgList(props.imgList)
        setActions(props.actions)
    },[props.listSatte,props.imgList,props.actions])

    useEffect(()=>{
        // updateList(1);
    },[])

    const previewImg = (url)=>{
        previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    }

    const delData = (id)=>{
        console.log("delData",id);

        showModal({
            title: '提示',
            content: '确定要删除吗',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    goToDel(id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })




    }

    const goToDel = (id) =>{
        const data =
        {
            "bizContent": {
                "taskId": String(id)
            }
        }
        showLoading({
            title: '删除中',
        })
        request({
            url:"https://we.biubbmk.cn/we-ai-test/we-ai/draw/v1/delete",
            method:'POST',
            data: data,
            success:function (res){ 
                console.log("删除回调",res);
                if(res && res.data.code === 200) {
                    console.log("删除的回调",res);
                    updateList(listSatte.pageNum)
                    hideLoading()
                    showToast({
                        title: '删除成功',
                        icon: 'success',
                    })
                }else{
                    hideLoading()
                    showToast({
                        title: '删除失败',
                        icon: 'error',
                    })
                }
            }
        },false)
    }

    const stateShow = (e)=>{
        console.log("eee",e);
        switch (e) {
            case "WAIT":
                return "待执行，请刷新"
            case "RUNNING":
                return "执行中，请刷新"
            case "SUCCESS":
                return "已完成";
            case "FAIL":
                return "生成失败"
            case "TIMEOUT":
                return "执行中，请刷新"
            default:
                return "错误"
        }

    }
    const updateList = (num:1) =>{
        
        showLoading({
            title: '加载中',
        })
        request({
            url:"https://we.biubbmk.cn/we-ai-test/we-ai/draw/v1/history",
            method:'POST',
            data: {
                "bizContent": {
                    "drawModel": "",
                    "drawType": "SD_TXT_2_IMG",
                    "page":num,
                    "limit":10
                }
            }
            
            },false).then(res=>{
                let actionsList = []
                if(res && res.code === 200) {
                    let data = res.data.pageInfo.list
                    setImgList(data)
                    let listState = res.data.pageInfo
                    // const arr = Object.entries(listState);
                    // const newArr = arr.filter(([key, value]) => key!== 'list');
                    // const newObj = newArr.reduce((listState, [key, value]) => {
                    //     listState[key] = value;
                    //     return listState;
                    // }, {});
                    setListState(listState)
                    for (let i = 0; i < listState.pages; i++) {
                        console.log("i111111111",i);
                        let item =  { key: Number(i)+1, text: Number(i)+1 } 
                        actionsList.push(item)
                        console.log("item",item);
                    }
                    console.log("看actionsList",actionsList);
                    
                    setActions(actionsList)
                    hideLoading()
                    console.log("绘图数据",data);
                    
                }else{
                    hideLoading()
                    showToast({
                        title: '刷新失败',
                        icon: 'error',
                    })
                    console.log("链接失败");
                    
                }
    
            })
    }
    const onAction = e =>{
        listSatte.pageNum = Number(e.text)
        setListState({...listSatte})
        updateList(Number(e.text))
        Toast.show(`选择了 ${e.text}`)
    }
    return (
    <div>
        <div className="topBox">
            <div className="topBox_update"
            onClick={()=>{
                updateList(listSatte.pageNum)
            }}> <RedoOutline/>刷新</div>
            <div className="topBox_text">图片渲染需要时间,请耐心等待</div>
        </div>
        {
            imgList.map(item =>
            <div className="dataListBox">
                <div className="dataList">  
                    <div className="dataList_l">
                        <div className="dataList_l_time">{item.createTime}</div>
                        <div className="dataList_l_ID">ID:{item.id} {stateShow(item.taskStatus)} </div>
                        {
                        item.taskStatus=="SUCCESS"?
                        <div className="dataList_l_img">
                            <AnImage onContainerClick={(e)=>{
                                previewImg(item.imageList[0])
                            }} height={"271PX"} width={"271PX"} src={item.imageList[0]} lazy fit='contain' />
                        </div>:
                        <div>
                            <AnImage  height={"108PX"} width={"108PX"} src={"https://s21.ax1x.com/2024/03/12/pF6IDl6.png"} lazy fit='contain' />
                        </div>
                        }

                    </div>
                    <div className="dataList_outTime">
                        {/* 14天后过期 */}
                    </div>
                    <div className="dataList_del">
                        <DeleteOutline onClick={()=>delData(item.id)} />
                    </div>
                </div>     
            </div>
            )
        }

        <div className="bottomTip">        
            <Popover.Menu
                actions={actions}
                maxCount={3}
                onAction={node => {onAction(node)}}
                trigger='click'
            >
                <Button>第 {listSatte.pageNum} 页       <DownOutline /></Button>
            </Popover.Menu>
        </div>
    </div>
    );
}

export default ResultList
