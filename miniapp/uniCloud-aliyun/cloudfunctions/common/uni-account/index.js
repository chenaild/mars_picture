"use strict";

function _interopDefault(e) {
	return e && "object" == typeof e && "default" in e ? e.default : e
}
var crypto = _interopDefault(require("crypto")),
	querystring = _interopDefault(require("querystring"));
class UniCloudError extends Error {
	constructor(e) {
		super(e.message), this.errMsg = e.message || "", Object.defineProperties(this, {
			message: {
				get() {
					return `errCode: ${e.code||""} | errMsg: ` + this.errMsg
				},
				set(e) {
					this.errMsg = e
				}
			}
		})
	}
}
const _toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(e, t) {
	return hasOwnProperty.call(e, t)
}

function isPlainObject(e) {
	return "[object Object]" === _toString.call(e)
}

function isFn(e) {
	return "function" == typeof e
}
const isSnakeCase = /_(\w)/g,
	isCamelCase = /[A-Z]/g;

function snake2camel(e) {
	return e.replace(isSnakeCase, (e, t) => t ? t.toUpperCase() : "")
}

function camel2snake(e) {
	return e.replace(isCamelCase, e => "_" + e.toLowerCase())
}

function parseObjectKeys(e, t) {
	let n, s;
	switch (t) {
		case "snake2camel":
			s = snake2camel, n = isSnakeCase;
			break;
		case "camel2snake":
			s = camel2snake, n = isCamelCase
	}
	for (const r in e)
		if (hasOwn(e, r) && n.test(r)) {
			const n = s(r);
			e[n] = e[r], delete e[r], isPlainObject(e[n]) ? e[n] = parseObjectKeys(e[n], t) : Array.isArray(e[n]) && (e[
				n] = e[n].map(e => parseObjectKeys(e, t)))
		} return e
}

function snake2camelJson(e) {
	return parseObjectKeys(e, "snake2camel")
}

function camel2snakeJson(e) {
	return parseObjectKeys(e, "camel2snake")
}

function getOffsetDate(e) {
	return new Date(Date.now() + 6e4 * ((new Date).getTimezoneOffset() + 60 * (e || 0)))
}

function getDateStr(e, t = "-") {
	e = e || new Date;
	const n = [];
	return n.push(e.getFullYear()), n.push(("00" + (e.getMonth() + 1)).substr(-2)), n.push(("00" + e.getDate()).substr(-
		2)), n.join(t)
}

function getTimeStr(e, t = ":") {
	e = e || new Date;
	const n = [];
	return n.push(("00" + e.getHours()).substr(-2)), n.push(("00" + e.getMinutes()).substr(-2)), n.push(("00" + e
		.getSeconds()).substr(-2)), n.join(t)
}

function getFullTimeStr(e) {
	return getDateStr(e = e || new Date) + " " + getTimeStr(e)
}

function parseParams(e = {}, t) {
	if (!t || !e) return e;
	const n = ["_pre", "_purify", "_post"];
	t._pre && (e = t._pre(e));
	let s = {
		shouldDelete: new Set([])
	};
	if (t._purify) {
		const e = t._purify;
		for (const t in e) e[t] = new Set(e[t]);
		s = Object.assign(s, e)
	}
	if (isPlainObject(t))
		for (const r in t) {
			const i = t[r];
			isFn(i) && -1 === n.indexOf(r) ? e[r] = i(e) : "string" == typeof i && -1 === n.indexOf(r) && (e[r] = e[i],
				s.shouldDelete.add(i))
		} else isFn(t) && (e = t(e));
	if (s.shouldDelete)
		for (const t of s.shouldDelete) delete e[t];
	return t._post && (e = t._post(e)), e
}

function createApi(e, t) {
	const n = new e(t);
	return new Proxy(n, {
		get: function(e, t) {
			if ("function" == typeof e[t] && 0 !== t.indexOf("_") && e._protocols && e._protocols[t]) {
				const n = e._protocols[t];
				return async function(s) {
					s = parseParams(s, n.args);
					let r = await e[t](s);
					return r = parseParams(r, n.returnValue), r
				}
			}
			return e[t]
		}
	})
}

function generateApiResult(e, t) {
	if (t.errcode) throw new UniCloudError({
		code: t.errcode || -2,
		message: t.errmsg || `${e} fail`
	});
	return delete t.errcode, delete t.errmsg, {
		...t,
		errMsg: `${e} ok`,
		errCode: 0
	}
}

function nomalizeError(e, t) {
	throw new UniCloudError({
		code: t.code || -2,
		message: t.message || `${e} fail`
	})
}
async function callWxOpenApi({
	name: e,
	url: t,
	data: n,
	options: s,
	defaultOptions: r
}) {
	let i = {};
	const o = camel2snakeJson(Object.assign({}, n));
	o && o.access_token && delete o.access_token;
	try {
		s = Object.assign({}, r, s, {
			data: o
		}), i = await uniCloud.httpclient.request(t, s)
	} catch (t) {
		return nomalizeError(e, t)
	}
	let a = i.data;
	const c = i.headers["content-type"];
	if (!Buffer.isBuffer(a) || 0 !== c.indexOf("text/plain") && 0 !== c.indexOf("application/json")) Buffer
		.isBuffer(a) && (a = {
			buffer: a,
			contentType: c
		});
	else try {
		a = JSON.parse(a.toString())
	} catch (e) {
		a = a.toString()
	}
	return snake2camelJson(generateApiResult(e, a || {
		errCode: -2,
		errMsg: "Request failed"
	}))
}

function buildUrl(e, t) {
	let n = "";
	if (t && t.accessToken) {
		n = `${e.indexOf("?")>-1?"&":"?"}access_token=${t.accessToken}`
	}
	return `${e}${n}`
}
class Auth {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: n,
		options: s
	}) {
		const r = {
			method: "GET",
			dataType: "json",
			dataAsQueryString: !0,
			timeout: this.options.timeout
		};
		return await callWxOpenApi({
			name: `auth.${e}`,
			url: `${this.options.baseUrl}${buildUrl(t,n)}`,
			data: n,
			options: s,
			defaultOptions: r
		})
	}
	async code2Session(e) {
		return await this._requestWxOpenapi({
			name: "code2Session",
			url: "/sns/jscode2session",
			data: {
				grant_type: "authorization_code",
				appid: this.options.appId,
				secret: this.options.secret,
				js_code: e
			}
		})
	}
	async getPaidUnionId(e) {
		return await this._requestWxOpenapi({
			name: "getPaidUnionId",
			url: "/wxa/getpaidunionid",
			data: e
		})
	}
	async getAccessToken() {
		return await this._requestWxOpenapi({
			name: "getAccessToken",
			url: "/cgi-bin/token",
			data: {
				grant_type: "client_credential",
				appid: this.options.appId,
				secret: this.options.secret
			}
		})
	}
}
class Auth$2 {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.q.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: n,
		options: s
	}) {
		const r = {
			method: "GET",
			dataType: "json",
			dataAsQueryString: !0,
			timeout: this.options.timeout
		};
		return await callWxOpenApi({
			name: `auth.${e}`,
			url: `${this.options.baseUrl}${buildUrl(t,n)}`,
			data: n,
			options: s,
			defaultOptions: r
		})
	}
	async code2Session(e) {
		return await this._requestWxOpenapi({
			name: "code2Session",
			url: "/sns/jscode2session",
			data: {
				grant_type: "authorization_code",
				appid: this.options.appId,
				secret: this.options.secret,
				js_code: e
			}
		})
	}
	async getPaidUnionId(e) {
		return await this._requestWxOpenapi({
			name: "getPaidUnionId",
			url: "/wxa/getpaidunionid",
			data: e
		})
	}
	async getAccessToken() {
		return await this._requestWxOpenapi({
			name: "getAccessToken",
			url: "/cgi-bin/token",
			data: {
				grant_type: "client_credential",
				appid: this.options.appId,
				secret: this.options.secret
			}
		})
	}
}
const ALIPAY_ALGORITHM_MAPPING = {
	RSA: "RSA-SHA1",
	RSA2: "RSA-SHA256"
};
class AlipayBase {
	constructor(e = {}) {
		if (!e.appId) throw new Error("appId required");
		if (!e.privateKey) throw new Error("privateKey required");
		const t = {
			gateway: "https://openapi.alipay.com/gateway.do",
			timeout: 5e3,
			charset: "utf-8",
			version: "1.0",
			signType: "RSA2",
			timeOffset: -(new Date).getTimezoneOffset() / 60,
			keyType: "PKCS8"
		};
		e.sandbox && (e.gateway = "https://openapi.alipaydev.com/gateway.do"), this.options = Object.assign({}, t,
			e);
		const n = "PKCS8" === this.options.keyType ? "PRIVATE KEY" : "RSA PRIVATE KEY";
		this.options.privateKey = this._formatKey(this.options.privateKey, n), this.options.alipayPublicKey && (this
			.options.alipayPublicKey = this._formatKey(this.options.alipayPublicKey, "PUBLIC KEY"))
	}
	_formatKey(e, t) {
		return `-----BEGIN ${t}-----\n${e}\n-----END ${t}-----`
	}
	_formatUrl(e, t) {
		let n = e;
		const s = ["app_id", "method", "format", "charset", "sign_type", "sign", "timestamp", "version",
			"notify_url", "return_url", "auth_token", "app_auth_token"
		];
		for (const e in t)
			if (s.indexOf(e) > -1) {
				const s = encodeURIComponent(t[e]);
				n = `${n}${n.includes("?")?"&":"?"}${e}=${s}`, delete t[e]
			} return {
			execParams: t,
			url: n
		}
	}
	_getSign(e, t) {
		const n = t.bizContent || null;
		delete t.bizContent;
		const s = Object.assign({
			method: e,
			appId: this.options.appId,
			charset: this.options.charset,
			version: this.options.version,
			signType: this.options.signType,
			timestamp: getFullTimeStr(getOffsetDate(this.options.timeOffset))
		}, t);
		n && (s.bizContent = JSON.stringify(camel2snakeJson(n)));
		const r = camel2snakeJson(s),
			i = Object.keys(r).sort().map(e => {
				let t = r[e];
				return "[object String]" !== Array.prototype.toString.call(t) && (t = JSON.stringify(t)),
					`${e}=${t}`
			}).join("&"),
			o = crypto.createSign(ALIPAY_ALGORITHM_MAPPING[this.options.signType]).update(i, "utf8").sign(this
				.options.privateKey, "base64");
		return Object.assign(r, {
			sign: o
		})
	}
	async _exec(e, t = {}, n = {}) {
		const s = this._getSign(e, t),
			{
				url: r,
				execParams: i
			} = this._formatUrl(this.options.gateway, s),
			{
				status: o,
				data: a
			} = await uniCloud.httpclient.request(r, {
				method: "POST",
				data: i,
				dataType: "text",
				timeout: this.options.timeout
			});
		if (200 !== o) throw new Error("request fail");
		const c = JSON.parse(a),
			p = `${e.replace(/\./g,"_")}_response`,
			u = c[p],
			l = c.error_response;
		if (u) {
			if (!n.validateSign || this._checkResponseSign(a, p)) {
				if (!u.code || "10000" === u.code) {
					return {
						errCode: 0,
						errMsg: u.msg || "",
						...snake2camelJson(u)
					}
				}
				const e = u.sub_code ? `${u.sub_code} ${u.sub_msg}` : `${u.msg||"unkonwn error"}`;
				throw new Error(e)
			}
			throw new Error("返回结果签名错误")
		}
		if (l) throw new Error(l.sub_msg || l.msg || "接口返回错误");
		throw new Error("request fail")
	}
	_checkResponseSign(e, t) {
		if (!this.options.alipayPublicKey || "" === this.options.alipayPublicKey) return console.warn(
			"options.alipayPublicKey is empty"), !0;
		if (!e) return !1;
		const n = this._getSignStr(e, t),
			s = JSON.parse(e).sign,
			r = crypto.createVerify(ALIPAY_ALGORITHM_MAPPING[this.options.signType]);
		return r.update(n, "utf8"), r.verify(this.options.alipayPublicKey, s, "base64")
	}
	_getSignStr(e, t) {
		let n = e.trim();
		const s = e.indexOf(`${t}"`),
			r = e.lastIndexOf('"sign"');
		return n = n.substr(s + t.length + 1), n = n.substr(0, r), n = n.replace(/^[^{]*{/g, "{"), n = n.replace(
			/\}([^}]*)$/g, "}"), n
	}
	_notifyRSACheck(e, t, n) {
		const s = Object.keys(e).sort().filter(e => e).map(t => {
			let n = e[t];
			return "[object String]" !== Array.prototype.toString.call(n) && (n = JSON.stringify(n)),
				`${t}=${decodeURIComponent(n)}`
		}).join("&");
		return crypto.createVerify(ALIPAY_ALGORITHM_MAPPING[n]).update(s, "utf8").verify(this.options
			.alipayPublicKey, t, "base64")
	}
	_checkNotifySign(e) {
		const t = e.sign;
		if (!this.options.alipayPublicKey || !t) return !1;
		const n = e.sign_type || this.options.signType || "RSA2",
			s = {
				...e
			};
		return delete s.sign, s.sign_type = n, !!this._notifyRSACheck(s, t, n) || (delete s.sign_type, this
			._notifyRSACheck(s, t, n))
	}
	_verifyNotify(e) {
		if (!e.headers) throw new Error("通知格式不正确");
		let t;
		for (const n in e.headers) "content-type" === n.toLowerCase() && (t = e.headers[n]);
		if (!1 !== e.isBase64Encoded && -1 === t.indexOf("application/x-www-form-urlencoded")) throw new Error(
			"通知格式不正确");
		const n = querystring.parse(e.body);
		if (this._checkNotifySign(n)) return snake2camelJson(n);
		throw new Error("通知验签未通过")
	}
}
var protocols = {
	code2Session: {
		returnValue: {
			openid: "userId"
		}
	}
};
class Auth$1 extends AlipayBase {
	constructor(e) {
		super(e), this._protocols = protocols
	}
	async code2Session(e) {
		return await this._exec("alipay.system.oauth.token", {
			grantType: "authorization_code",
			code: e
		})
	}
}
var index = {
	initWeixin: function(e = {}) {
		return e.clientType = e.clientType || __ctx__.PLATFORM, createApi(Auth, e)
	},
	initQQ: function(e = {}) {
		return e.clientType = e.clientType || __ctx__.PLATFORM, createApi(Auth$2, e)
	},
	initAlipay: function(e = {}) {
		return e.clientType = e.clientType || __ctx__.PLATFORM, createApi(Auth$1, e)
	}
};
module.exports = index;
