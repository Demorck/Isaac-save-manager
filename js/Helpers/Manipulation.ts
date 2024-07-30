import { Constants } from "./Constants.js";

export class Manipulation {
    public static rshift(value: number, shift: number): number {
        if (shift >= 0) {
            return value >> shift;
        } else {
            return (value + 0x100000000) >> shift;
        }
    }

    public static getInt(data: Uint8Array, offset: number, numberBytes: number = 2): number {
        let result: number = 0;
        for (let i = 0; i < numberBytes; i++) {
            result += data[offset + i] << i;
        }

        return result;
    }

    public static toUint32(data: Uint8Array, offset: number): number {
        return data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24);
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