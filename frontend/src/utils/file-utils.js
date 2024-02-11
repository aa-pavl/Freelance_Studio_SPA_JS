import resize from "admin-lte/plugins/uplot/uPlot.esm";

export class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            // защита для последовательной загрузки файлов
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject('Script loaded error for: ' + src);
            document.body.appendChild(script);
        });
    }
    static loadPageStyle(src, insertBeforeElement) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css'
            link.href = src;
            document.head.insertBefore(link, insertBeforeElement);
        });
    }

    static convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject('Can not convert this file');
        });


    }

}