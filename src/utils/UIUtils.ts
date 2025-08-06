export class UIUtils {
    static async launchFullScreen(element: HTMLElement) {
        if (element.requestFullscreen) {
            await element.requestFullscreen();
        }
        //  else if (element.mozRequestFullScreen) {
        //     element.mozRequestFullScreen();
        // } else if (element.webkitRequestFullscreen) {
        //     element.webkitRequestFullscreen();
        // } else if (element.msRequestFullscreen) {
        //     element.msRequestFullscreen();
        // }
    }

    static setupHotkeyForFullScreen() {
        document.addEventListener('keypress', (event) => {
            const k = event.key || event.keyCode || event.which || event.charCode;
            if (event.key === 'F11' || k === 51) { // 3/#
                const element = document.documentElement;
                UIUtils.launchFullScreen(document.documentElement);
            }
        });

    }
}