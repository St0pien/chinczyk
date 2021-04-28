export default class HttpClient {
    constructor(url) {
        this.url = url;
    }

    async post(payload, offset='') {
        const res = await fetch(this.url+offset, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return data;
    }

    async get(offset='') {
        const res = await fetch(this.url+offset);
        const data = await res.json();
        return data;
    }
}