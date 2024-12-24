import { Constants } from "@/Helpers/Constants";

export class Manipulation {
    public static rshift(value: number, shift: number): number {
        if (shift >= 0) {
            return value >> shift;
        } else {
            return (value + 0x100000000) >> shift;
        }
    }

    public static getInt(data: Uint8Array, offset: number, numberBytes: number = 2, log: boolean = false): number {
        let result: number = 0;
        for (let i = 0; i < numberBytes; i++) {
            result += data[offset + i] << i;
            if (log) {
                console.log(`Byte ${i}: ${data[offset + i].toString(16)}, Result: ${result.toString(16)}`);
            }
        }
        if (log) {
            console.log(`Result: ${result}`);
        }
        return result;
    }

    public static toUint32(data: Uint8Array, offset: number): number {
        return data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24);
    }

    public static getUintArray(number: number): Uint8Array {
        let result = new Uint8Array(4);
        for (let i = 0; i < 4; i++) {
            result[i] = this.rshift(number, i * 8) & 0xFF;
        }
        return result;
    }

    public static getSectionOffsets(data: Uint8Array): number[] {
        let offset = Constants.SECTION_OFFSET;
        let sectionData = new Array<number>(3);
        let entryLens = Constants.ENTRY_LENS;
        let resultsOffset = new Array<number>(entryLens.length).fill(0);

        for (let i = 0; i < entryLens.length; i++) {
            for (let j = 0; j < sectionData.length; j++) {
            sectionData[j] = 
                data[offset] | 
                (data[offset + 1] << 8) | 
                (data[offset + 2] << 16) | 
                (data[offset + 3] << 24);
                offset += 4;
            }

            if (resultsOffset[i] === 0) {
                resultsOffset[i] = offset;
            }

            for (let j = 0; j < sectionData[2]; j++) {
                offset += entryLens[i];                
            }

        }
        
        return resultsOffset;
    }

    public static getBestiaryOffsets(data: Uint8Array, sectionOffsets: number[]): number[] {
        let offset = sectionOffsets[10];
        let length = this.toUint32(data, offset - 8);        

        let resultsOffset = new Array<number>(4).fill(0);

        for (let i = 0; i < 4; i++) {
            resultsOffset[i] = offset;
            let length = this.toUint32(data, offset + 4);
            offset += 0x8 + length * 2;
        }

        return resultsOffset;
    }

    public static setBestiaryOffsets(data: Uint8Array, sectionOffsets: number[], length: number): void {
        let offset = sectionOffsets[10];
        let lengthOffset = offset - 8;

        let lengthArray = this.getUintArray(length);

        for (let i = 0; i < 4; i++) {
            data[lengthOffset + i] = lengthArray[i];
        }
    }

    public static getBestiaryLengths(data: Uint8Array, bestiaryOffset: number[]): number[] {
        let res = [];
        for (let i = 0; i < bestiaryOffset.length; i++) {
            let length = this.toUint32(data, bestiaryOffset[i] + 4);
            res.push(length);
        }   

        return res;
    }

    public static calculateChecksum(data: Uint8Array, offset: number, length: number): number {
        let checksum = ~Constants.CHECKSUM >>> 0;

        for (let i = offset; i < offset + length; i++) {
            checksum = Constants.CRC_TABLE[(checksum & 0xFF) ^ data[i]] ^ (checksum >>> 8);
        }
        
        return (~checksum >>> 0);
    }

    public static updateChecksum(data: Uint8Array): Uint8Array {
        let offset = Constants.HEADER_OFFSET;
        let length = data.length - offset - 4;
        let checksum = this.calculateChecksum(data, offset, length);
        
        let result = new Uint8Array(offset + length + 4);
        result.set(data.slice(0, offset + length), 0);
        for (let i = 0; i < 4; i++) {
            let shifted = checksum >> (i * 8) & 0xFF;
            result[offset + length + i] = shifted;
        }
        
        return result;
    }

    public static testChecksum(checksum: number, dataChecksum: number): boolean {
        let maskedChecksum = checksum & 0x000000FF;
        let result = dataChecksum & maskedChecksum;
        
        return result === dataChecksum;
    }
}