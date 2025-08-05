import { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router';
import { QRCodeSVG } from 'qrcode.react';
import { ViewData } from '../client/ViewData';
import { SceneUtils } from '../utils/SceneUtils';

const Home = () => {
    const [coin, setCoin] = useState("");
    const [receiveAddress, setReceiveAddress] = useState("");
    const [, setMode] = useState(ViewData.Modes.Scene);
    const [scene, setScene] = useState(ViewData.Scenes.MatrixFlow);
    const [color, setColor] = useState("#3498db");
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

    const showThemeCharm = () => {
        const charms = Metro.getPlugin('#themeCharm', 'charms');
        charms.open();
    }
    const closeThemeCharm = () => {
        const charms = Metro.getPlugin('#themeCharm', 'charms');
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

    // const handleColorSelect = (color: string, primitive: any) => {
    //     chooseColor(color);
    // }

    const chooseScene = (sceneKey: string) => {
        if (sceneKey === scene) {
            return;
        }
        if (!SceneUtils.supportedScenes.includes(sceneKey)) {
            console.log("Unsupported scene", sceneKey);
            return;
        }
        console.log("choose new scene", sceneKey);
        setMode(ViewData.Modes.Scene);
        setScene(sceneKey);
        SceneUtils.closeScenes();
        SceneUtils.loadScene(sceneKey);
        SceneUtils.tryRenderScene();
    }
    const chooseColor = (newColor: string) => {
        SceneUtils.closeScenes();
        setMode(ViewData.Modes.Color);
        setColor(newColor);
        document.body.style.backgroundColor = newColor;
    }

    useEffect(() => {
        SceneUtils.tryRenderScene();
        // 将函数挂载到window对象
        (window as any).handleColorSelect = (color: string) => { // , primitive: any
            chooseColor(color);
        };

        return () => {
            // 清理
            delete (window as any).handleColorSelect;
        };
    }, []);

    return (
        <>
            <nav data-role="appbar" className="bg-transparent" data-expand="true">
                <div className="app-bar-item-static no-hover">
                    {/* <span className="mif-feed mif-3x"></span> imcult */}
                    <a className="button cycle ml-1">
                        <span className="mif-home"></span>
                    </a>
                </div>
                {/* <ul class="app-bar-menu">
                    <li><a href="#"><span class="mif-home mr-1"></span> Home</a></li>
                    <li><a href="#"><span class="mif-cog mr-1"></span> Settings</a></li>
                </ul> */}
                <div className="app-bar-item-static ml-auto">
                    {/* <a className="button square ml-1">
                        <span className="mif-github"></span>
                    </a> */}
                </div>

                <a className="button cycle ml-1">
                    <span className="mif-handshake"></span>
                </a>
                <a className="button cycle ml-1">
                    <span className="mif-github"></span>
                </a>
            </nav>
            <div className="container h-100  d-flex flex-center">
                <div className='grid w-100'>
                    <div className="row p-2">
                        <div className='cell-4'></div>
                        <div className='cell-1'>
                            <button className="button cycle pos-center" style={{ width: "56px", height: "56px" }} onClick={showThemeCharm}>
                                <span className="mif-enter mif-2x fg-cyan"></span>
                            </button>
                        </div>
                        <div className='cell-2'>
                            <button className="button cycle pos-center" style={{ width: "56px", height: "56px" }} onClick={showThemeCharm}>
                                <span className="mif-cog mif-2x"></span>
                            </button>
                        </div>
                        <div className='cell-1'>
                            <div data-role="action-button">
                                <button className="main-action">
                                    <span className="icon"><span className="mif-favorite fg-red"></span></span>
                                </button>
                                <ul className="actions">
                                    <li>
                                        <button onClick={byCkb}>
                                            <span className="icon">
                                                <img src="./assets/ckb.svg" style={{ filter: "none", width: "18px" }} />
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
                                                <img src="./assets/eth.svg" className="externalIcon" style={{ filter: "none", width: "16px" }} />
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={bySol}>
                                            <span className="icon">
                                                <img src="./assets/sol.svg" className="externalIcon" style={{ filter: "none", width: "24px", height: "18.8px" }} />
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={byAtom}>
                                            <span className="icon">
                                                <img src="./assets/atom.svg" className="externalIcon" style={{ filter: "none", width: "24px" }} />
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={byStx}>
                                            <span className="icon">
                                                <img src="./assets/stx.svg" className="externalIcon" style={{ filter: "none", width: "24px" }} />
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='cell-4'></div>
                    </div>
                </div>
            </div>

            <div id="leftCharm" data-role="charms" data-opacity="0.8" style={{ maxWidth: "420px" }}
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
                        <div className='cell' style={{ textAlign: "center" }}>
                            <button className="button info cycle outline" onClick={closeCharm}>
                                <span className="mif-cross"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div id="dialogTheme" className="dialog" data-role="dialog" data-overlay-click-close="true">
                <div className="dialog-title">Theme</div>
                <div className="dialog-content">
                    This dialog appears above the overlay.
                </div>
                <div className="dialog-actions">
                    <button className="button js-dialog-close">Cancel</button>
                </div>
            </div> {`chooseScene('${ViewData.Scenes.Yinyang}')`}*/}

            <div id="themeCharm" data-role="charms" data-opacity="0.8" style={{ maxWidth: "330px" }}
                className="border bd-default p-1 bg-white fg-black w-75 h-100">
                <div className='grid fg-black w-100'>
                    <div className="row p-1">
                        <ul data-role="materialtabs">
                            <li><a href="#tabScene">Scene</a></li>
                            <li><a href="#tabColor">Color</a></li>
                        </ul>
                        <div id="tabScene">
                            <div className="tiles-grid gap-2">
                                <button data-role="tile" data-size="wide" data-cover="/assets/covers/cover-matrix.png"
                                    onClick={() => chooseScene(ViewData.Scenes.MatrixFlow)}>
                                    <span className="branding-bar fg-white">#1 Matrix</span>
                                </button>
                                <button data-role="tile" data-size="wide" data-cover="/assets/covers/cover-rings.png"
                                    onClick={() => chooseScene(ViewData.Scenes.Rings)}>
                                    <span className="branding-bar">#2 Rings</span>
                                </button>
                                <button data-role="tile" data-size="wide" data-cover="/assets/covers/cover-yinyang.png"
                                    onClick={() => chooseScene(ViewData.Scenes.Yinyang)}>
                                    <span className="branding-bar fg-white">#3 Yin Yang</span>
                                </button>
                            </div>
                        </div>
                        <div id="tabColor">
                            <div data-role="color-selector"
                                data-return-value-type="hex"
                                data-show-alpha-channel="false"
                                data-init-color={color}
                                data-show-values="hex"
                                data-on-select-color="handleColorSelect">
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className='cell' style={{ textAlign: "center" }}>
                            {/* <button className="button info cycle outline mr-3" onClick={chooseColor}>
                                <span className="mif-checkmark"></span>
                            </button> */}
                            <button className="button info cycle outline" onClick={closeThemeCharm}>
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