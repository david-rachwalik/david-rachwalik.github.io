/*
============================================
; Title:        http-client.js
; Author:       David Rachwalik
; Date:         2022/02/27
; Description:  What-A-Book app for WEB-330 site
;===========================================
*/

class HttpClient {
  // constructor() {}

  async get(url, params = '') {
    this.url = new URL(url);
    this.url.search = new URLSearchParams(params);

    const res = await fetch(this.url.toString(), {
      method: 'GET',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    });

    return res.json();
  }
}

export { HttpClient };
