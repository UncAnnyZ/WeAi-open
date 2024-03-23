
import './index.css'

const PPP = (props) => {
  return (
    <div onClick={() => props.setB(e => e + 5)} className="flex-col mod">
      <div className="flex-row body">
        <Image className="banner" src={'https://img.alicdn.com/tfs/TB1oiAbz1H2gK0jSZJnXXaT1FXa-1404-788.png'} />
        <Image className="picture" src={'https://img.alicdn.com/tfs/TB1IpkXz5_1gK0jSZFqXXcpaXXa-240-240.png'} />
        <div className="flex-row wrapper">
          <span className="organization">众筹</span>
          <span className="label">｜全网首发</span>
        </div>
      </div>
      <div className="flex-col footer">
        <div className="flex-col wrapper-1">
          <span className="caption">对饮茶酒 手工茶罐与小对杯</span>
          <span className="summary">
            宽杯、小杯自在搭配，喝茶喝酒都很适合。手工制宽杯、小杯自在搭配，喝茶喝酒都很适合。手工制做…
          </span>
        </div>
        <example className="flex-col wrapper-2" attr1={'value1'} attr2={'value2'}>
          <div className="flex-row group">
            <div className="flex-row view">
              <div className="horizontal-line" />
              <img className="bg" src={'https://img.alicdn.com/tfs/TB1iSj8z4D1gK0jSZFsXXbldVXa-800-12.png'} />
            </div>
            <span className="percent">83%</span>
          </div>
          <div className="flex-row group-1">
            <div className="flex-row view-1">
              <span className="num">5216</span>
              <span className="tag">人支持</span>
            </div>
            <div className="flex-row view-2">
              <span className="title">486.52万</span>
              <span className="word">已筹金额</span>
            </div>
          </div>
        </example>
      </div>
    </div>
  );
  }
  export default PPP