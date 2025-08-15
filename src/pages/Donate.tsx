import { useNavigate } from 'react-router';
import { AccountsData } from '../client/AccountsData';
import { QRCodeSVG } from 'qrcode.react';

const Donate = () => {
    const nav = useNavigate();

    const cardStyle = {
        width: "300px",
        height: "350px",
        cursor: "pointer",
        borderRadius: "12px",
        padding: "4px",
        background: "transparent",
        boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)"
    };

    return (<>
        <nav data-role="appbar" className="bg-transparent" data-expand="true">
            <div className="app-bar-item-static no-hover">
                {/* <span className="mif-feed mif-3x"></span> imcult */}
                <a className="button cycle ml-1" onClick={() => nav("/")}>
                    <span className="mif-home"></span>
                </a>
                <div className="app-bar-item-static ml-auto">
                    {/* <a className="button square ml-1">
                            <span className="mif-github"></span>
                        </a> */}
                </div>

                {/* <button className="cycle ml-1" onClick={() => UIUtils.launchFullScreen(document.documentElement)}>
                    <span className="mif-enlarge"></span>
                </button> */}
            </div>
        </nav>
        <div className="container h-100  d-flex flex-center flex-wrap gap-3">
            {AccountsData.accounts.map((item, key) => (
                <div key={key} className="card" style={cardStyle}>
                    <div className="card-header" style={{height: "48px"}}>
                        <span className="icon mr-1">
                            <img src={`./assets/${item.coin.toLocaleLowerCase()}.svg`} style={{ filter: "none", width: "24px" }} />
                        </span> {item.coin}
                        {/* <div className="buttons">
                            <button className="button"><span className="mif-rocket"></span></button>
                        </div> */}
                    </div>
                    <div className="card-content">
                        <div className='grid fg-black w-100'>
                            <div className="row p-1">
                                <QRCodeSVG value={item.address} />
                            </div>
                            <div className="row p-1">
                                <textarea data-role="textarea" value={item.address}
                                    style={{height: "100px"}}
                                    onFocus={(e) => e.target.select()} readOnly></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </>)
};

export default Donate;