import React, { useEffect, useState,useMemo } from "react";
import './index.css'

const CheckListPopub = (props) => {
    console.log("props",props);
    const items = props.items
    const afterChange = props.afterChange
    const height = props.height

    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(props.items[0])
    const [searchText, setSearchText] = useState('')


    useEffect(()=>{
      console.log("更新了items");
      setSelected(items[0])
    },[items])

    const filteredItems = useMemo(() => {
      if (searchText) {
        return items.filter(item => item.includes(searchText))
      } else {
        return items
      }
    }, [items, searchText])
  

    
  
    return (
      <div style={{width:"100%"}}>

        <div className="vae-out">
          <div className="vae-out-change" style={{  height: height}}>
            <div style={{marginLeft:'10PX',
            height:'99%',
            width:'100%',
            position:"relative",
            display: "flex",
            alignItems: "center"
            }} onClick={() => {setVisible(true)}}>
                <div style={{width:"100%"}}>{selected}</div>
                <div className="vae-out-change-icon"><DownOutline /></div>
            </div>
          </div>
        </div>

        <div className="popupBox">
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false)
          }}
          destroyOnClose
        >
          <div className={"searchBarContainer"}>
            <SearchBar
              placeholder='输入文字过滤选项'
              value={searchText}
              onChange={v => {
                setSearchText(v)
              }}
            />
          </div>
          <div style={{ height: '40vh', overflowY: 'scroll', padding: '20px' }} 
          className={"checkListContainer"}>
            <div className="checkList">
            <CheckList
              className={"myCheckList"}
              defaultValue={selected ? [selected] : []}
              onChange={val => {
                setSelected(val[0])
                afterChange(val[0])
                setVisible(false)
              }}
            >
              {filteredItems.map(item => (
                <CheckList.Item key={item} value={item}>
                  {item}
                </CheckList.Item>
              ))}
            </CheckList>
            </div>
          </div>
        </Popup>
        </div>
        
      </div>
    );
  }

  export default CheckListPopub
