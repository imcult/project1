import { useEffect } from 'react';

const Focus = () => {
    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // async function loadData() {
        // };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        // 初始化并启动2-rings动画
        const reset2Rings = (window as any).reset2Rings;
        if(reset2Rings) { reset2Rings(); }
        const run2Rings = (window as any).run2Rings;
        if(run2Rings) { run2Rings(); }
    }, []);
    
    return (
        <>
            <div className="container h-100  d-flex flex-center">
                <div className="box shadow-normal" style={{width: "320px"}}>
                    <div className="box-title">《得道了身经》摘抄</div>
                    <p>夫修炼了身，饮食有则，禁口独坐，口唇相沾，牙齿相对，眼不观邪色，耳不听淫声，洗心涤虑，对境忘境，万缘消息，外想不入，内想不出，莫起一念，万事俱忘。凝耳韵，含眼光，缄舌炁，调鼻息，存神定意，一心内守。调息绵绵，微微轻出，似有而无，莫教间断。息依神定，性定命住，性命双全，形神俱妙，与道合真。</p>
                    <div className="d-flex flex-justify-center mt-4">
                        <button className="button primary" onClick={() => window.location.href = "/"}>
                            <span className="mif-arrow-left"></span> 返回首页
                        </button>
                    </div>
                </div>
                {/* <div className="flip-card flip-horizontal effect-on-active">
                    <div className="front">
                        <div className="card" style={{width: "320px", height: "420px"}}>
                            <div className="card-header">
                                Front Side
                            </div>
                            <div className="card-content">
                                Click a button to activate the flip.
                            </div>
                            <div className="card-footer">
                                <button className="button">Action</button>
                            </div>
                        </div>
                    </div>
                    <div className="back">
                        <div className="card" style={{width: "320px", height: "420px"}}>
                            <div className="card-header">
                                Back Side
                            </div>
                            <div className="card-content">
                                This is the back content of the card.
                            </div>
                            <div className="card-footer">
                                <button className="button">Action</button>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
}
export default Focus;