export default class LocationService {

    static get(key: string): string | null {
        const params = new URLSearchParams(window.location.search);
        // console.log('LocationService.get', params);
        return params.get(key);
    }

    static set(keyOrValue: any, value: any): void {
        const params = new URLSearchParams(window.location.search);
        if (typeof keyOrValue === 'string') {
            params.set(keyOrValue, value);
        } else {
            params.set(keyOrValue, '');
        }
        this.replace(params);
        // console.log('LocationService.set', params, keyOrValue, value);
    }

    static replace(params: URLSearchParams): void {
        if (window.history && window.history.pushState) {
            const title = document.title;
            const url = `${window.location.href.split('?')[0]}?${params.toString()}`;
            window.history.pushState(params.toString(), title, url);
        }
    }

    static deserialize(key: string | null = null): any | null {
        const encoded = this.get('params');
        return this.decode(key, encoded);
    }

    static serialize(keyOrValue: any, value: any): void {
        const params = this.deserialize();
        const encoded = this.encode(keyOrValue, value, params);
        this.set('params', encoded);
    }

    static decode(key: string | null = null, encoded: string | null = null): any | null {
        let decoded = null;
        if (encoded) {
            const json = window.atob(encoded);
            decoded = JSON.parse(json);
        }
        if (key && decoded) {
            decoded = decoded[key];
        }
        return decoded || null;
    }

    static encode(keyOrValue: any, value: any, params: { [key: string]: any } = {}): string {
        let encoded = null;
        if (typeof keyOrValue === 'string') {
            params[keyOrValue] = value;
        } else {
            params = keyOrValue;
        }
        const json = JSON.stringify(params);
        encoded = window.btoa(json);
        return encoded;
    }

}