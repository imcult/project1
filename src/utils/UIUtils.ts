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
}