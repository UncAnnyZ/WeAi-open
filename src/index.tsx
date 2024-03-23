import React, { useEffect, useState,useMemo } from "react";
import CheckListPopub from "./CheckListPopub"
import ResultList from "./ResultList"
import "./index.css";
let aTime;


const App = (props) => {

  let [updateFlag,setUpdateFalg] = useState(1) //0为未提交任务，1为已提交生图任务
  const [isHeight,setIsHeight] = useState(false)

  const [showEdit,setShowEdit] = useState(true) //true为不显示编辑卡片
  //checkList组d件控制的状态

  const [checkListState,setCheckListState] = useState({
    model:{
      selector: ['加载中'],
      selectorChecked: 'anything-v5-PrtRE(万象熔炉)',
    },
    vae:{
      selector: ['加载中'],
      selectorChecked: 'Automatic',
    },
    sample:{
      selector: ['加载中'],
      selectorChecked: 'Euler a',
    },
    imgNum:{
      selector: [1,2],
      selectorChecked: 1,
    }
  })
  const checkListPopubAfterChange = (e,name) =>{
    console.log('checkListPopubAfterChange',e);
    console.log(checkListState[name]);
    
    checkListState[name].selectorChecked=e
    //修改state会引发选择无效 为什么？
    // setCheckListState({...checkListState})
    console.log("更改后的checkListState",checkListState);
  }
  // ResultList组件控制的状态
  const [listSatte,setListState] = useState({})
  const [allList,setAllList] = useState({})
  const [imgList,setImgList] = useState(null)
  const [actions,setActions] = useState([
      { key: 1, text: 1 },
      { key: 2, text: 2 },
      { key: 3, text: 3 },
  ])
  //原来画图的代码
  const { data, scrollToBottom, setMessage } = props || {};
  console.log("datadatadatadatadata",data);
  
  const [taskId, setTaskId] = useState("");

  const [img, setImg] = useState("wait");

  console.log(props, 23332);

  const { prompt } = data.data || {};

  useEffect(() => {
    const interval = setInterval(() => {
      request({
        url:
          Number(taskId) > 0
            ? "https://we.biubbmk.cn/we-ai-test/we-ai/draw/v1/detail"
            : "",
        method: "POST",
        data: {
          "bizContent": {
              "taskId": taskId
          }
        },
        success: (res) => {
          // 加入是线上，版本号+1 假如是预发，就还是服务端返回的版本
          if (res?.data?.data?.drawTaskInfo.taskStatus === "SUCCESS") {
            setImg(res.data.data.drawTaskInfo.imageList[0]);
            clearInterval(interval);
            try {
              scrollToBottom();
            } catch {}
          } else if(res?.data?.code === 500){
            clearInterval(interval);
            setImg("fail");
          } else {
            setImg("wait");
          }
        },
        fail: () => {
          setImg("fail");
        },
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [taskId, img]);

  useEffect(() => {
    console.log("7856",prompt.replace(/\s/g, ""));
    request({
      url: "https://we.biubbmk.cn/we-ai-test/we-ai/draw/v1/create",
      method: "POST",
      data: {
        "bizContent": {
          "templateId": "2", 
          "param": {
            "prompt": prompt.replace(/\s/g, "")||"好看的美女",
          },
        },
      },
      success: (res) => {
        console.log("lookres",res);
        // 加入是线上，版本号+1 假如是预发，就还是服务端返回的版本
        if (res.data.code === 200) {
          
          setTaskId(res.data.data.taskId);
        } else {
          setTaskId((e) => e || "fail");
        }
      },
      fail:(res)=>{
        console.log("lookres",res);
      }
    });
  }, [jsCode]);

  //先加载组件再加载数据的
  useEffect(()=>{
    console.log("xxxxxx");
    //请求模型选择
    const datalist = []
    const vaeList = []
    const sampleList =[]
    request({
      url:"https://we.biubbmk.cn/we-ai-test/we-ai/draw-config/v1/sd/model/list",
      method:'POST',
      data: {
        "bizContent":{}
      },
      success:function (res){ 
        console.log("模型数据",res);
        let data = res.data.data.drawModelConfigInfoList
        for (let i = 0; i < data.length; i++) {
          let item = `${data[i].name}(${data[i].alias})`
          datalist.push(item)
        }
        console.log("datalist",datalist);
        checkListState.model.selector = datalist
        checkListState.model.selectorChecked =datalist[0]
        setCheckListState({...checkListState});
        console.log("checkListState1111111",checkListState);
        
      }
    },false)
    //请求vae选择
    request({
      url:"https://we.biubbmk.cn/we-ai-test/we-ai/draw-config/v1/sd/vae/list",
      method:'POST',
      data: {
        "bizContent":{}
      },
      success:function (res){ 
        console.log("vae数据",res);
        if(res && res.data.code === 200) {
          let data = res.data.data.drawVaeConfigResponseList
          for (let i = 0; i < data.length; i++) {
            let item = `${data[i].name}`
            vaeList.push(item)
          }
          console.log("vaeList111",vaeList);
          checkListState.vae.selector = vaeList
          checkListState.vae.selectorChecked =vaeList[0]
          setCheckListState({...checkListState});
          console.log("checkListState111",checkListState);
        }else{
          console.log("请求失败");
        }
      }
    },false)
    //请求采样算法
    request({
      url:"https://we.biubbmk.cn/we-ai-test/we-ai/draw-config/v1/sd/sampler/list",
      method:'POST',
      data: {
        "bizContent":{}
      },
      success:function (res){ 
        console.log("采样算法数据",res);
        if(res && res.data.code === 200) {
          let data = res.data.data.drawSamplerConfigInfoList
          for (let i = 0; i < data.length; i++) {
            let item = `${data[i].name}`
            sampleList.push(item)
          }
          console.log("sampleList1111",sampleList);
          checkListState.sample.selector = sampleList
          checkListState.sample.selectorChecked =sampleList[0]
          setCheckListState({...checkListState});
          console.log("checkListState111",checkListState);
        }else{
          console.log("请求失败");
        }
      }
    },false)
    //请求历史绘图
    request({
      url:"https://we.biubbmk.cn/we-ai-test/we-ai/draw/v1/history",
      method:'POST',
      data: {
          "bizContent": {
              "drawModel": "",
              "drawType": "SD_TXT_2_IMG",
              "page":1,
              "limit":10
          }
      },
      success:function (res){
        let actionsList = []
        if(res && res.data.code === 200) {
            let data = res.data.data.pageInfo.list
            setImgList(data)
            let listState = res.data.data.pageInfo
            setAllList(listState)
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
      }
      },false)

  },[])
  console.log("checkListState",checkListState);
  

  const topTabs = [
    { title: "工作台"},
    { title: "生成列表" },
  ];
  //提示词和反向提示词
  const [autoFocus,setautoFocus] = useState({
    autoFocus1:false,
    autoFocus2:false,
  })
  //兼容taro-ui的输入框的AutoFocus焦点跳来跳去
  const openAutoFocus=(e) =>{
    const a = (e==1? true : false)
    const b = (e==2? true : false)
    setautoFocus({
      autoFocus1:a,
      autoFocus2:b,
    })
    console.log('autoFocus',autoFocus);
    
  }
  // 提示词
  const [tipTextState,setTipTextState] = useState({
    value:''
  })
  
  const handleTextareaChange=(e)=>{
    setTipTextState({
      value:e
    })
    openAutoFocus(1)
  }
  // 反向提示词
  const [outTipTextState,setOutTipTextState] = useState({
    value:''
  })
  
  const outHandleTextareaChange=(e)=>{
    
    setOutTipTextState({
      value:e
    })
    openAutoFocus(2)
    
  }
  //图片大小选项卡
  const [AtTabBarstate , setAtTabBarstate] = useState({
    current:0
  })
  const [showSetupWh,setShowSetupWh] = useState(false)
  const AtTabBarHandleClick =(e)=>{
    if (e == 0) {
      allSliderState.width = 768
      allSliderState.height =1152
      setAllSliderState({...allSliderState})
    } else if(e == 1) {
      allSliderState.width = 1152
      allSliderState.height =768
      setAllSliderState({...allSliderState})
    } else if(e == 2) {
      allSliderState.width = 1024
      allSliderState.height = 1024
      setAllSliderState({...allSliderState})
    } else if(e == 3) {
      allSliderState.width = 512
      allSliderState.height = 512
      setAllSliderState({...allSliderState})
    }
    console.log('AtTabBarHandleClick:',e);
    setAtTabBarstate({
      current:e
    })
    console.log("666",e);
    
    if (e == 3) {
      setShowSetupWh(true)
    }else{
      if (showSetupWh == true) {
        setShowSetupWh(false)
      }
    }
  } 
  //slider 和 input
  const [allSliderState,setAllSliderState] = useState({
    width:768,
    height:1152,
    takeNumber:20,
    cfgScale:7,
    clipSkip:2,
    seed:-1,
    ensd:31337
  })
  const [allInputFocusState,setAllInputFocusState] = useState({
    width:false,
    height:false,
    takeNumber:false,
    cfgScale:false,
    clipSkip:false,
  })
  const SliderOnAfterChanging = (e,name) =>{
    console.log('e',e);
    allSliderState[name] = e
    setAllSliderState({...allSliderState})
  }
  const inputHandleChange = (e,name)=>{
    console.log(typeof(e));
    console.log("e",e+1);

    allSliderState[name] = e
    setAllSliderState({...allSliderState})
  }
  const inputOnFocus = (e,name) =>{
    console.log('inputOnFocus',typeof(e));
    
    allInputFocusState[name] = true
    setAllInputFocusState({...allInputFocusState})
  }

  const esdnInputChange =(e,name)=>{
    console.log("esdnInputChange",e);
    allSliderState[name] = e
    setAllSliderState({...allSliderState})
  }

  const seedInputOnchange = (e,name)=>{
    console.log("seedInputOnchange",e);
    allSliderState[name] = e
    setAllSliderState({...allSliderState})
  }
  //汇集数据准备提交
  const collect = () =>{

    const sd_model_checkpoint = String(checkListState.model.selectorChecked).split('(')[0]
    console.log("sd_model_checkpoint",sd_model_checkpoint);
    console.log("isHeight",isHeight);
    
    let denoising_strength
    let hr_upscaler
    if (isHeight) {
      denoising_strength = 0.7;
      hr_upscaler = 'Latent';
    }else{
      denoising_strength = '';
      hr_upscaler = '';
    }

    let collectData  = {
      "bizContent": {
        "templateId": "2", 
        "param": {
            //模型选择
            "override_settings": {
                "sd_model_checkpoint":sd_model_checkpoint, //模型选择
                "sd_vae":String(checkListState.vae.selectorChecked),//vae选择
                "CLIP_stop_at_last_layers":Number(allSliderState.clipSkip),//Clip Skip 
                "eta_noise_seed_delta":Number(allSliderState.ensd)//ENSD
            },
            "prompt":String(tipTextState.value),//提示词
            "negativePrompt":String(outTipTextState.value),//反向提示词
            "width":Number(allSliderState.width),//宽度
            "height":Number(allSliderState.height),//高度
            "sampler_name":String(checkListState.sample.selectorChecked),//采样算法选择
            "steps":Number(allSliderState.takeNumber),//采样次数
            "cfg_scale":Number(allSliderState.cfgScale),//提示词引导系数 
            "seed":Number(allSliderState.seed),//随机数种子
            "enable_hr": isHeight,//高清修复
            "denoising_strength": denoising_strength,
            "hr_upscaler":hr_upscaler,
            "override_settings_restore_afterwards": false// 覆盖配置后，不回滚
          }
      }
    }
    return collectData;
  }
  const throttle = (func, delay)=> {
    let lastClick = 0;
    return function() {
      const now = new Date().getTime();
      console.log(now - lastClick >= delay,"33333333333333");
      
      if (now - lastClick > delay) {
        console.log("2222222222",lastClick);
        
        lastClick = now;
        func.apply(this, arguments);
      }
    };
  }
  //创建绘图任务
  const submit = () =>{
      console.log("111111111111111");
    
      showLoading({
        title: '加载中',
      })
      const collectData = collect();
      console.log("collectData",collectData);
      const url = 'https://we.biubbmk.cn/we-ai-test/we-ai/draw/v1/create'
      request({
        url,
        method:'POST',
        data: collectData,
        success:function (res){
          setOkRun(false)
          if(res && res.data.code === 200) {
            console.log('生成图片成功数据',res)
            updateList(1);
            hideLoading()
            showToast({
              title: '成功创建生成',
              icon: 'success',
            })
    
        
          }
          else{
            console.log("没有200");
            console.log('生成图片失败数据',res)
            hideLoading().
            showToast({
              title: '失败',
              icon: 'error',
            })
  
          }
        }
      },false)
  }
  //更新历史绘图的数据
  const updateList = (num:1) =>{
        
    showLoading({
        title: '加载中22',
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
                const arr = Object.entries(listState);
                const newArr = arr.filter(([key, value]) => key!== 'list');
                const newObj = newArr.reduce((listState, [key, value]) => {
                    listState[key] = value;
                    return listState;
                }, {});
                setListState(newObj)
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
                console.log("绘图信息状态",newObj);
                
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

  const switchHeight = (e)=>{
    console.log("isheight",e);
    setIsHeight(e)
  }

  const editStydle = ()=>{
    console.log();
    
  }
  const changeToEdit=()=>{
    console.log("点击button11111111");
    updateList(1);
    setShowEdit(false)
  }
  const str1 = '<lora:lora_name:weight>'
  const str2 = '<hypernet:hypernet_name:weight>'
  return (
  <div >
    {showEdit?
      <view>{img === "fail" || taskId === "fail" ? (
        <div>sd服务异常</div>
      ) : (
        <view>
          {img === "wait" ? (
            <div>休ds</div>
          ) : (
            <div className="defaultBox">
              
              <img style={{ height: "300PX", width: "300PX" }} src={img}></img>
              <Button className="defaultBox_button" color='default' fill='solid' onClick={()=>changeToEdit()}>
                高级编辑
              </Button>
            </div>
          )}
        </view>
      )}</view>
      :
    <view className="rootBox">
    <Tabs
      tabs={topTabs}
      initialPage={0}
      tabBarBackgroundColor={'#f2f2f2'}
      onChange={(tab, index) => { 
        console.log('onChange', index, tab);
      }}
      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
      >

      <div className="tapItem">
          {/* 模型选择 */}
          <div className="itemCardBg" style={{marginTop:"10PX"}}>
            <div className="model-text">模型 Stable Diffusion XL (SDXL) 1.0 - Base</div>

              <CheckListPopub 
              items={checkListState.model.selector}
              height={"70PX"}
              afterChange={(e)=>{checkListPopubAfterChange(e,"model")}} 
              />

            <Popover
              content='更改图像的色彩表现，类似相机的过滤'
              trigger='click'
              placement='top-start'
            >
            <div className="vae">VAE <ExclamationTriangleOutline /></div>
            </Popover>
            <CheckListPopub 
            height={"25PX"}
            items={checkListState.vae.selector} 
            afterChange={(e)=>{checkListPopubAfterChange(e,"vae")}} 
            />


          </div>
          {/* 提示词 */}
          <div className="itemCardBg">
            <Popover
              content=
              {<div>
                <div>非必须填写参数规则：<br />
                lora填写：{str1}(weight 0~1)  主要是角色画风、风格<br />
                超网络填写：{str2}(weight 0~1) 主要影响风格，能被lora替代，属于快淘汰技术<br />
                embedding(词嵌入)填写:强调作用，比如强调手部，脸部不要畸形，如EasyNegative
                </div>
              </div>
              }

              trigger='click'
              placement='top-start'
            >
            <div className="model-text">提示词 <ExclamationTriangleOutline /></div>
            </Popover>
            <div className="model-AtTextarea">
              <div className="model-AtTextarea-in" 
                style={{border: "1px solid #d6e4ef",borderRadius:"8PX"}}>
                <TextArea 
                  placeholder='请输入内容，不能为空'
                  value={tipTextState.value}
                  onChange={(e)=>{handleTextareaChange(e)}}
                  maxLength={1000}
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  style={{padding: "10PX"}}
                />
                {/* <AtTextarea
                    value={tipTextState.value}
                    onChange={(e)=>{handleTextareaChange(e)}} 
                    autoFocus={autoFocus.autoFocus1}
                    maxLength={200}
                    count={false}
                    height={110}
                    /> */}
              </div>
            </div>
            <div className="model-outText">反向提示词</div>
            <div className="model-AtTextarea">
              <div className="model-AtTextarea-in"
              style={{border: "1px solid #d6e4ef",borderRadius:"8PX"}}
              >
                <TextArea 
                    placeholder='如不输入内容默认模板数据'
                    value={outTipTextState.value}
                    onChange={(e)=>{outHandleTextareaChange(e)}}
                    maxLength={1000}
                    autoSize={{ minRows: 5, maxRows: 8 }}
                    style={{padding: "10PX"}}
                  />
                {/* <AtTextarea
                  value={outTipTextState.value}
                  onChange={(e)=>{outHandleTextareaChange(e)}} 
                  autoFocus={autoFocus.autoFocus2}
                  maxLength={200}
                  count={false}
                  height={110}
                  /> */}
              </div>
            </div>
          </div>
          {/* 设置 */}
          <div className="itemCardBg">
            <div className="setup-title">设置</div>

            <div className="model-AtTextarea">
              <div className="model-AtTextarea-in">
                <AtTabBar
                  tabList={[
                    { title: <div style={{display:"flex",flexDirection:'column'}}>
                      <div>Portrait</div>
                      <div>768x1152</div>
                    </div>, 
                      image: 'https://s11.ax1x.com/2024/02/24/pFU04N8.png',
                      selectedImage: ' https://s11.ax1x.com/2024/02/24/pFU0hAf.png',
                      selectedColor:'#44d2ff'
                    },
                    { title: <div style={{display:"flex",flexDirection:'column'}}>
                      <div>Landscape</div>
                      <div >1152x768</div>
                    </div>,
                      image: 'https://s11.ax1x.com/2024/02/24/pFU06cd.png',
                      selectedImage: ' https://s11.ax1x.com/2024/02/24/pFU0y1H.png',
                      selectedColor:'#44d2ff'
                    },
                    { title: <div style={{display:"flex",flexDirection:'column'}}>
                      <div>Square</div>
                      <div >1024x1024</div>
                    </div>,
                      image: 'https://s11.ax1x.com/2024/02/24/pFU0T3Q.png',
                      selectedImage: 'https://s11.ax1x.com/2024/02/24/pFU0o9g.png',
                      selectedColor:'#44d2ff'
                    },
                    { title: <div style={{display:"flex",flexDirection:'column'}}>
                      <div>custom</div>
                      <div >custom</div>
                    </div>, 
                      image: 'https://s11.ax1x.com/2024/02/24/pFU0Hjs.png',
                      selectedImage: 'https://s11.ax1x.com/2024/02/24/pFU07cj.png',
                      selectedColor:'#44d2ff'
                    },
                  ]}
                  fontSize = {12}
                  iconSize = {40}
                  onClick={(e)=>{AtTabBarHandleClick(e)}}
                  current={AtTabBarstate.current}
                />
              </div>
            </div>

            <div className={"setup-wh"} style={showSetupWh ?{display:'flex'}: {display:'none'}}>
              <div className="setup-wh-w">
                <div className="setup-wh-w-title">宽</div>
                <div className="setup-wh-w-setup">
                  <div className="setup-wh-w-setup-left">
                      <Slider min={128} max={1536} step={50} popover 
                        defaultValue={allSliderState.width} onAfterChange={(e)=>{SliderOnAfterChanging(e,'width')}}
                      />

                  </div>
                  <div className="setup-wh-w-setup-right">
                    <AnInput
                      id={"width"}
                      type={'number'}
                      max = {1536}
                      min = {128}
                      maxlength={4}
                      placeholder={`默认${allSliderState.width}`}
                      value={allSliderState.width}
                      clearable = {true}
                      onChange={(e)=>{
                        inputHandleChange(e,'width')
                      }}
                      onlyShowClearWhenFocus
                    />


                  </div>
                </div>
              </div>

            <div className="setup-wh-w">
              <div className="setup-wh-w-title">高</div>
              <div className="setup-wh-w-setup">
                <div className="setup-wh-w-setup-left">
                  <Slider min={128} max={1536} step={50} popover 
                    defaultValue={allSliderState.height} onAfterChange={(e)=>{SliderOnAfterChanging(e,'height')}}
                  />
                </div>
                <div className="setup-wh-w-setup-right">
                <AnInput
                    id={"height"}
                    type={'number'}
                    max = {1536}
                    min = {128}
                    maxlength={4}
                    placeholder={`默认${allSliderState.height}`}
                    value={allSliderState.height}
                    clearable = {true}
                    onChange={(e)=>{
                      inputHandleChange(e,'height')
                    }}
                    onlyShowClearWhenFocus
                  />
                </div>
              </div>
            </div>

            </div>

            {/* LCM还没写，输入框还没优化 */}
            <Popover
              content='AI生成图像的方式。 “DPM”图像质量更高，“Euler”和“DDIM”生成速度更快。'
              trigger='click'
              placement='top-start'
            >
            <div className="vae">采样算法 <ExclamationTriangleOutline /></div>
            </Popover>
            <CheckListPopub 
            height={"25PX"}
            items={checkListState.sample.selector} 
            afterChange={(e)=>{checkListPopubAfterChange(e,"sample")}} 
            />


            <div className={"setup-wh"}>
              <div className="setup-wh-w">
                <div className="setup-wh-w-title">采样次数</div>
                <div className="setup-wh-w-setup">
                  <div className="setup-wh-w-setup-left">
                    <Slider min={10} max={35} step={1} popover 
                      defaultValue={allSliderState.takeNumber} onAfterChange={(e)=>{SliderOnAfterChanging(e,'takeNumber')}}
                    />
                  </div>
                  <div className="setup-wh-w-setup-right">
                    <AnInput
                      id={"takeNumber"}
                      type={'number'}
                      max = {60}
                      min = {1}
                      maxlength={4}
                      placeholder={`默认${allSliderState.takeNumber}`}
                      value={allSliderState.takeNumber}
                      clearable = {true}
                      onChange={(e)=>{
                        inputHandleChange(e,'takeNumber')
                      }}
                      onlyShowClearWhenFocus
                    />


                  </div>
                </div>
              </div>

            <div className="setup-wh-w">
              <div className="setup-wh-w-title">提示词相关性(CFGScale)</div>
              <div className="setup-wh-w-setup">
                <div className="setup-wh-w-setup-left">
                  <Slider min={1} max={30} step={1} popover 
                    defaultValue={allSliderState.cfgScale} onAfterChange={(e)=>{SliderOnAfterChanging(e,'cfgScale')}}
                  />
                </div>
                <div className="setup-wh-w-setup-right">
                <AnInput
                    id={"cfgScale"}
                    type={'number'}
                    max = {30}
                    min = {1}
                    maxlength={4}
                    placeholder={`默认${allSliderState.cfgScale}`}
                    value={allSliderState.cfgScale}
                    clearable = {true}
                    onChange={(e)=>{
                      inputHandleChange(e,'cfgScale')
                    }}
                    onlyShowClearWhenFocus
                  />
                </div>
              </div>
            </div>

            </div>

            <Popover
              content='其他参数一致的情况下，相同的随机种子会生成相同的图片。'
              trigger='click'
              placement='top-start'
            >
            <div className="vae">随机种子(seed) <ExclamationTriangleOutline /></div>
            </Popover>

            <div className="vae-out">
              <div className="vae-out-change">
                  <div style={{marginLeft:'10PX',width:'100%'}}>
                  <AnInput id={'seed'}  placeholder={"-1为随机"} type = {"text"}
                    value={allSliderState.seed} onChange={(e)=>{seedInputOnchange(e,'seed')}} ></AnInput>
                  </div>
              </div>
            </div>

            <div className="vae">高级设置</div>
            <div className={"setup-wh"}>
              <div className="setup-wh-w">
                <div className="setup-wh-w-title">Clip Skip</div>
                <div className="setup-wh-w-setup">
                  <div className="setup-wh-w-setup-left">
                    <Slider min={1} max={12} step={1} popover 
                      defaultValue={allSliderState.clipSkip} onAfterChange={(e)=>{SliderOnAfterChanging(e,'clipSkip')}}
                    />
                  </div>
                  <div className="setup-wh-w-setup-right">
                    <AnInput
                      id={"clipSkip"}
                      type={'number'}
                      max = {12}
                      min = {1}
                      maxlength={4}
                      placeholder={`默认${allSliderState.clipSkip}`}
                      value={allSliderState.clipSkip}
                      clearable = {true}
                      onChange={(e)=>{
                        inputHandleChange(e,'clipSkip')
                      }}
                      onlyShowClearWhenFocus
                    />

                  </div>
                </div>
              </div>

            <div className="setup-hset-ensd">
              <div className="setup-hset-ensd-title">ENSD</div>
              <div className="setup-hset-ensd-setup">

                <div className="setup-hset-ensd-setup-out">
                  <div className="setup-hset-ensd-setup-out-change">
                      <div style={{marginLeft:'10PX',width:'100%'}}>
                      <AnInput
                        min={1}
                        max={9999999}
                        type={'number'}
                        id={'ensd'} 
                        placeholder={`默认${allSliderState.ensd}`}
                        value={allSliderState.ensd}
                        onChange={(e)=>esdnInputChange(e,'ensd')}/>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            </div>

            <div className="vae">图片数量</div>
            <CheckListPopub
            height={"25PX"} 
            items={checkListState.imgNum.selector} 
            afterChange={(e)=>{checkListPopubAfterChange(e,"imgNum")}} 
            />

            <div className="highfix" >
              高清修复(需要很久时间)<Switch onChange={(e)=>{
                switchHeight(e)
              }} ></Switch>
            </div>

          </div>

          {/* 底部填充空白 */}
          <div className="fillSpace"></div>

          {/* 提交按钮 */}
          <span className="submit" style={{zIndex:"99"}}>
              <span className="submit-button" onClick={throttle(submit,800)}>在线提交(5s-1min)</span>
          </span>

      </div>

      <div className="tapItem" >
        <ResultList
          imgList={imgList} listSatte={listSatte} actions={actions}
          setImgList={setImgList} setListState={setListState} setActions={setActions}>
          </ResultList>
      </div>

    </Tabs>
    </view>
    }


  </div>
  );
};

WeDyncamic.App = App;

