export class Utils {
    public static numberWithLeadingZeros(value: number, length: number = 3): string {
        return value.toString().padStart(length, "0");
    }
}