export class Utils {
    public static numberWithLeadingZeros(value: number, length: number = 3): string {
        return value.toString().padStart(length, "0");
    }

    public static htmlToElement(html: string): HTMLElement {
        return new DOMParser().parseFromString(html, "text/html").body.firstChild as HTMLElement;
    }
}