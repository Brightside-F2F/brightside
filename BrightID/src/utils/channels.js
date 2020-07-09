// @flow
import { b64ToUint8Array, b64ToUrlSafeB64, randomKey } from '@/utils/encoding';
import api from '@/Api/BrightId';
import { QR_TTL } from '@/utils/constants';
import { Buffer } from 'buffer';

const createRandomId = async (size = 9) => {
  const key = await randomKey(size);
  return b64ToUrlSafeB64(key);
};

export const generateChannelData = async () => {
  const aesKey = await randomKey(16);
  const ipAddress = await api.ip();
  const id = await createRandomId();
  const timestamp = Date.now();
  const ttl = QR_TTL;
  const myProfileId = await createRandomId();

  return { id, myProfileId, aesKey, timestamp, ttl, ipAddress };
};

export const encodeChannelQrString = (channel: Channel) => {
  const { aesKey, id, ipAddress, myProfileId, timestamp, ttl } = channel;
  const b64Ip = Buffer.from(
    ipAddress.split('.').map((octet) => parseInt(octet, 10)),
  )
    .toString('base64')
    .substring(0, 6);
  return encodeURIComponent(
    `${aesKey}${id}${myProfileId}${b64Ip}${timestamp}${ttl}`,
  );
};

export const decodeChannelQrString = async (qrString: string) => {
  const decodedQR = decodeURIComponent(qrString);
  const aesKey = decodedQR.substr(0, 24);
  const id = decodedQR.substr(24, 12);
  const initiatorProfileId = decodedQR.substr(36, 12);
  const b64ip = `${decodedQR.substr(48, 6)}==`;
  const ipAddress = b64ToUint8Array(b64ip).join('.');
  // 13 digits for timestamp will be safe until Saturday, 20. November 2286 17:46:39.999
  const timestamp = parseInt(decodedQR.substr(54, 13), 10);
  // ttl has unknown length, so just parse everything till the end
  const ttl = parseInt(decodedQR.substr(67), 10);

  // add local channel data that is not part of qrstring
  const myProfileId = await createRandomId();
  const pollTimerId = 0;

  const channel: Channel = {
    aesKey,
    id,
    initiatorProfileId,
    ipAddress,
    myProfileId,
    pollTimerId,
    timestamp,
    ttl,
  };
  return channel;
};
