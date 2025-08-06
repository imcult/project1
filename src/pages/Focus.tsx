import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ReactCardFlip from 'react-card-flip';
import { CardsData } from '../client/CardsData';
import { UIUtils } from '../utils/UIUtils';

const Focus = () => {
    const [frontImage, setFrontImage] = useState("");
    const [backImage, setBackImage] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);

    const nav = useNavigate();
    
    const cardStyle = {
        width: "400px", 
        height: "500px", 
        cursor: "pointer",
        borderRadius: "12px",
        padding: "4px",
        //background: "linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFD700)",
        background: "transparent",
        boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)"
    };
    const randomCard = () => {
        // 随机获取一张卡片
        const cards = CardsData.items;
        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex];
        setFrontImage(`/cards/${randomCard.id}-1.png`);
        setBackImage(`/cards/${randomCard.id}-2.png`);
        setIsFlipped(false);
    }

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    }

    useEffect(() => {
        randomCard();
    }, []);
    
    return (
        <>
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

                    <button className="cycle ml-1" onClick={() => UIUtils.launchFullScreen(document.documentElement)}>
                        <span className="mif-enlarge"></span>
                    </button>
                    <button className="image-button ml-1" onClick={randomCard}>
                        <span className="icon mif-loop2"></span>
                        <span className="caption">Card</span>
                    </button>
                    <button className="image-button ml-1 disabled">
                        <span className="icon mif-loop2"></span>
                        <span className="caption">Note</span>
                    </button>
                </div>
            </nav>
            <div className="container h-100 d-flex flex-center">
                {/* <div className="box shadow-normal" style={{width: "320px"}}>
                    <div className="box-title">《得道了身经》摘抄</div>
                    <p>夫修炼了身，饮食有则，禁口独坐，口唇相沾，牙齿相对，眼不观邪色，耳不听淫声，洗心涤虑，对境忘境，万缘消息，外想不入，内想不出，莫起一念，万事俱忘。凝耳韵，含眼光，缄舌炁，调鼻息，存神定意，一心内守。调息绵绵，微微轻出，似有而无，莫教间断。息依神定，性定命住，性命双全，形神俱妙，与道合真。</p>
                    <div className="d-flex flex-justify-center mt-4">
                        <button className="button primary" onClick={() => window.location.href = "/"}>
                            <span className="mif-arrow-left"></span> 返回首页
                        </button>
                    </div>
                </div> */}
                <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped}>
                    <div key="front" style={cardStyle} onClick={handleCardClick}>
                        <div style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                                backgroundColor: "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <img src={frontImage} alt="" style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                borderRadius: "8px"
                            }} />
                        </div>
                    </div>
                    <div key="back" style={cardStyle} onClick={handleCardClick}>
                        <div style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                                backgroundColor: "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <img src={backImage} alt="" style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                borderRadius: "8px"
                            }} />
                        </div>
                    </div>
                </ReactCardFlip>
            </div>
        </>
    );
}
export default Focus;