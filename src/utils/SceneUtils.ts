import { ViewData } from "../client/ViewData";

export class SceneUtils {
    static supportedScenes = [
        ViewData.Scenes.MatrixFlow,
        ViewData.Scenes.Rings,
        ViewData.Scenes.Yinyang
    ];
    
    static closeScenes() {
        (window as any).stopScene?.();
        //(window as any).resetScene?.();
    }

    static loadScene(sceneKey: string) {
        const scene = sceneKey;// || Utility.getParamByKey('scene');
        // 根据scene值调用相应的安装函数
        if (scene === ViewData.Scenes.Rings) {
            (window as any).installScene_2Rings?.();
        } else if (scene === ViewData.Scenes.Yinyang) {  // 默认调用matrix场景
            (window as any).installScene_Yinyang?.();
        } else {  // 默认调用matrix场景
            (window as any).installScene_Matrix?.();
        }
    }

    static tryRenderScene() {
        const resetScene = (window as any).resetScene;
        if (resetScene) {
            resetScene();
            const runScene = (window as any).runScene;
            if (runScene) { runScene(); }
        }
    }
}