/* eslint-disable */
// import store from '../redux/store';
import store from '../../store';
import qs from 'qs';
import CryptoJS from 'crypto-js';

let RequestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'charset': 'UTF-8',
};

let RequestHeadersFile = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data; ',
    'charset': 'UTF-8',
};

export const ROOT_URL = 'http://127.0.0.1:8000/';
// export const ROOT_URL = 'https://schoolapi-test.eschool.mn/';

const decrypt = (passphrase, encrypted) => {
    const salt = CryptoJS.enc.Hex.parse("3536373334653339353535373731373635363466");
    const iv = CryptoJS.enc.Hex.parse("36333532333137383339353937383431");

    const key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999 });
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const encrypt = (passphrase, plain) => {
    const salt = CryptoJS.enc.Hex.parse("3536373334653339353535373731373635363466");
    const iv = CryptoJS.enc.Hex.parse("36333532333137383339353937383431");

    const key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 8, iterations: 999 });
    const encrypted = CryptoJS.AES.encrypt(plain, key, { iv: iv });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export function encryptUrlParams(params = {}) {
    if (params) {
        return encrypt("ESCHOOL_SCHOOL", JSON.stringify(params));
    } else {
        return '';
    }
}

export function fetchRequest(url, method, bodyParams, fileUpload = false, formData = false, withEncryption = true) {
    let headerObject = fileUpload ? RequestHeadersFile : RequestHeaders;

    let requestUrl = url.includes('http') ? url : ROOT_URL + url; // testing survey api

    const {
        auth: { authToken }
    } = store.getState();
    if (authToken) {
        headerObject['Authorization'] = `Bearer ${authToken}`;
    }

    // headerObject['Authorization'] = `Bearer ${dummyToken}`;
    if (bodyParams && withEncryption) {
        bodyParams = {
            data: encrypt("ESCHOOL_SCHOOL", JSON.stringify(bodyParams))
        }
    }

    let methodObj = 'GET';
    let isPostRequest = false;

    if (method && method.toUpperCase() === 'POST') {
        methodObj = 'POST';
        isPostRequest = true;
    }

    let bodyObj = '{}';

    if (method && method.toUpperCase() === 'GET') {
        requestUrl = `${requestUrl}?${qs.stringify(bodyParams)}`;
    } else {
        if (bodyParams) {
            if (formData) {
                headerObject = {
                    Authorization: `Bearer ${authToken}`,
                };
                bodyObj = bodyParams;
            } else {
                bodyObj = qs.stringify(bodyParams)
            }
        }
    }
    if (url === 'auth/login') {
        delete headerObject.Authorization;
    }

    let requestParameters = null;
    if (isPostRequest) {
        requestParameters = {
            headers: headerObject,
            method: methodObj,
            body: bodyObj
        }
    } else {
        requestParameters = {
            headers: headerObject,
            method: methodObj
        }
    }

    return new Promise((resolve, reject) => {
        fetch(requestUrl, requestParameters)
            .then((response) => {
                if (response.status === 401) {
                    window.location.replace("/logout");
                }
                return response.json()
            })
            .then((responseData) => {
                const data = responseData?.data || null;
                const decrypted = decrypt("ESCHOOL_SCHOOL", data);
                let result = JSON.parse(decrypted);
                result['success'] = responseData?.success || false;
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
    });
}

export function fetchRequestAdmin(url, method, bodyParams, fileUpload = false, formData = false) {
    let headerObject = fileUpload ? RequestHeadersFile : RequestHeaders;

    let requestUrl = ROOT_URL + url;

    const {
        auth: { authToken }
    } = store.getState();

    if (authToken) {
        headerObject['Authorization'] = `Bearer ${authToken}`;
    }

    // headerObject['Authorization'] = `Bearer ${dummyToken}`;
    // if (bodyParams) {
    //     bodyParams = {
    //         data: bodyParams
    //     }
    // }

    let methodObj = 'GET';
    let isPostRequest = false;

    if (method && method.toUpperCase() === 'POST') {
        methodObj = 'POST';
        isPostRequest = true;
    }

    let bodyObj = '{}';

    if (method && method.toUpperCase() === 'GET') {
        requestUrl = `${requestUrl}?${qs.stringify(bodyParams)}`;
    } else {
        if (bodyParams) {
            if (formData) {
                headerObject = {
                    Authorization: `Bearer ${authToken}`,
                };
                bodyObj = bodyParams;
            } else {
                bodyObj = qs.stringify(bodyParams)
            }
        }
    }

    if (url === 'auth/login') {
        delete headerObject.Authorization;
    }

    let requestParameters = null;
    if (isPostRequest) {
        requestParameters = {
            headers: headerObject,
            method: methodObj,
            body: bodyObj
        }
    } else {
        requestParameters = {
            headers: headerObject,
            method: methodObj
        }
    }

    return new Promise((resolve, reject) => {
        fetch(requestUrl, requestParameters)
            .then((response) => {
                if (response.status === 401) {
                    window.location.replace("/logout");
                }
                return response.json()
            })
            .then((responseData) => {
                console.log("RESPONSE", responseData)
                const data = responseData?.data || null;
                const decrypted = decrypt("ESCHOOL_SCHOOL", data);
                let result = JSON.parse(decrypted);
                result['success'] = responseData?.success || false;
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
    });
}

export async function fetchRequestLogin(url, method, bodyParams, fileUpload = false) {
    let headerObject = fileUpload ? RequestHeadersFile : RequestHeaders;
    let methodObj = 'GET';
    let isPostRequest = false;

    if (method && method.toUpperCase() === 'POST') {
        methodObj = 'POST';
        isPostRequest = true;
    }

    let bodyObj = JSON.stringify({});
    if (bodyParams) {
        bodyObj = bodyParams
    }

    let requestParameters = null;
    if (isPostRequest) {
        requestParameters = {
            headers: headerObject,
            method: methodObj,
            body: bodyObj
        }
    } else {
        requestParameters = {
            headers: headerObject,
            method: methodObj
        }
    }

    return new Promise((resolve, reject) => {
        fetch(MAIN_URL + url, requestParameters)
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData);
            }).catch((error) => {
                reject(error);
            });
    });
}

export async function fetchRequestNoToken(url, method, bodyParams, fileUpload = false) {
    let headerObject = fileUpload ? RequestHeadersFile : RequestHeaders;
    let methodObj = 'GET';
    let isPostRequest = false;

    if (method && method.toUpperCase() === 'POST') {
        methodObj = 'POST';
        isPostRequest = true;
    }

    let bodyObj = JSON.stringify({});
    if (bodyParams) {
        bodyObj = qs.stringify(bodyParams)
    }

    let requestParameters = null;
    if (isPostRequest) {
        requestParameters = {
            headers: headerObject,
            method: methodObj,
            body: bodyObj
        }
    } else {
        requestParameters = {
            headers: headerObject,
            method: methodObj
        }
    }

    return new Promise((resolve, reject) => {
        fetch(MAIN_URL + url, requestParameters)
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData);
            }).catch((error) => {
                reject(error);
            });
    });
}

