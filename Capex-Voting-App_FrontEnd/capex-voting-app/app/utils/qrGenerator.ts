import QRCode from 'qrcode';

export type VoterType = 'INDUSTRY' | 'GUEST';

export interface QRCodeData {
    voterId: string;
    voterType: VoterType;
}

export async function generateQRCodeDataURL(data: QRCodeData): Promise<string> {
    try {
        return await QRCode.toDataURL(JSON.stringify(data));
    } catch (err) {
        throw new Error('QR Code generation failed');
    }
} 