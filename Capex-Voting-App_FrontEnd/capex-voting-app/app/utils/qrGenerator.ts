import QRCode from 'qrcode';
import { config } from '../../config';

// export type VoterType = 'INDUSTRY' | 'GUEST';

export interface QRCodeData {
    voterId: string;
    voterType: string;
}

export async function generateQRCodeDataURL(data: QRCodeData): Promise<string> {
    try {
        // Create the full URL with the base URL
        const fullUrl = `${config.baseUrl}/vote?token=${data.voterId}`;
        return await QRCode.toDataURL(fullUrl);
    } catch (err) {
        throw new Error('QR Code generation failed');
    }
} 