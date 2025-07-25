import { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router';
import {QRCodeSVG} from 'qrcode.react';
import { ViewData } from '../client/ViewData';

const Home = () => {
    const [coin, setCoin] = useState("");
    const [receiveAddress, setReceiveAddress] = useState("");
    //const nav = useNavigate();
    const showCharm = (coin_symbol: string, address: string) => {
        setCoin(coin_symbol);
        setReceiveAddress(address);

        const charms = Metro.getPlugin('#leftCharm', 'charms');
        charms.open();
    }
    const closeCharm = () => {
        const charms = Metro.getPlugin('#leftCharm', 'charms');
        charms.close();
    }

    const byCkb = () => {
        //stopMatrix();
        //window.location.href = "/focus.html";
        showCharm("CKB", ViewData.Address_CKB);
    }
    const byBtc = () => {
        showCharm("BTC", ViewData.Address_BTC);
    }
    const byEth = () => {
        showCharm("ETH", ViewData.Address_ETH);
    }
    const bySol = () => {
        showCharm("SOL", ViewData.Address_SOL);
    }
    const byStx = () => {
        showCharm("STX", ViewData.Address_STX);
    }
    const byAtom = () => {
        showCharm("ATOM", ViewData.Address_ATOM);
    }

    // const stopMatrix = () => {
    //     const sm = (window as any).stopMatrix;
    //     if(sm) { sm(); }
    // }

    useEffect(() => {
        // 添加延迟确保脚本完全加载
        // const timer = setTimeout(() => {
        //     // 停止2-rings动画
        //     const stop2Rings = (window as any).stop2Rings;
        //     if(stop2Rings) { 
        //         stop2Rings(); 
        //     }
            
        //     // 初始化并启动matrix-flow动画
        //     const resetMatrix = (window as any).resetMatrix;
        //     if(resetMatrix) { 
        //         resetMatrix(); 
        //     }
        //     const runMatrix = (window as any).runMatrix;
        //     if(runMatrix) { 
        //         runMatrix(); 
        //     }
        // }, 100); // 100ms延迟
        // return () => clearTimeout(timer);
        const resetMatrix = (window as any).resetMatrix;
        if(resetMatrix) { 
            resetMatrix(); 
        }
        const runMatrix = (window as any).runMatrix;
        if(runMatrix) { 
            runMatrix(); 
        }
    }, []);
    
    return (
        <>
            <div className="container h-100  d-flex flex-center">
                <div data-role="action-button">
                    <button className="main-action">
                        <span className="icon"><span className="mif-heart fg-red"></span></span>
                    </button>
                    <ul className="actions">
                        <li>
                            <button onClick={byCkb}>
                                <span className="icon">
                                    <img src="./assets/ckb.svg" style={{filter: "none", width: "18px"}} />
                                </span>
                            </button>
                        </li>
                        <li>
                            <button onClick={byBtc}>
                                <span className="icon"><span className="mif-bitcoin fg-orange"></span></span>
                            </button>
                        </li>
                        <li>
                            <button onClick={byEth}>
                                <span className="icon">
                                    <img src="./assets/eth.svg" className="externalIcon" style={{filter: "none", width: "16px"}} />
                                </span>
                            </button>
                        </li>
                        <li>
                            <button onClick={bySol}>
                                <span className="icon">
                                    <img src="./assets/sol.svg" className="externalIcon" style={{filter: "none", width: "24px", height: "18.8px"}} />
                                </span>
                            </button>
                        </li>
                        <li>
                            <button onClick={byAtom}>
                                <span className="icon">
                                    <img src="./assets/atom.svg" className="externalIcon" style={{filter: "none", width: "24px"}} />
                                </span>
                            </button>
                        </li>
                        <li>
                            <button onClick={byStx}>
                                <span className="icon">
                                    <img src="./assets/stx.svg" className="externalIcon" style={{filter: "none", width: "24px"}} />
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="leftCharm" data-role="charms" data-opacity="0.8" style={{maxWidth: "420px"}}
                className="border bd-default p-1 bg-white fg-black w-75 h-100">
                <div className='grid fg-black w-100'>
                    <div className="row p-1 bg-light">{coin}</div>
                    <div className="row p-1">
                        <QRCodeSVG value={receiveAddress} />
                    </div>
                    <div className="row p-1">
                        <textarea data-role="textarea" data-max-height="300" value={receiveAddress}
                            onFocus={(e) => e.target.select()} readOnly></textarea>
                    </div>
                     <div className="row p-2">
                        <div className='cell' style={{textAlign: "center"}}>
                            <button className="button info cycle outline" onClick={closeCharm}>
                                <span className="mif-cross"></span>
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </>
    );
}
export default Home;