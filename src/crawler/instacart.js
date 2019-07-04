const cheerio = require('cheerio')
const axios = require('axios')
const BelvoError = require('../utils/error')

const BASE_URL = 'https://www.instacart.com/'
const API_URL = BASE_URL + 'v3/'

let COOKIES = []

axios.defaults.withCredentials = true

const getShopInfo = async (email, password) => {
    await _setLoginCookies(email, password)
    return await _shopInfo()
}

const getShopItems = async (email, password) => {
    await _setLoginCookies(email, password)
    return await _shopItems()
}

const _shopInfo = async () => {
    let retailer = await _getRetailerInfo()

    return {
        name: retailer.info.name,
        logo: retailer.info.logo.url
    }
}

const _shopItems = async () => {
    let retailer = await _getRetailerInfo()

    let response = await axios.get(API_URL + 'containers/' + retailer.path + '?cache_key=' + retailer.cacheKey, {
        headers: {
            'Cookie': COOKIES.toString()
        }
    })

    let items = response.data.container.modules.map(module => {
        return {
            type: module.data.header.label,
            url: 'https://www.instacart.com' + module.async_data_path
        }
    })

    let result = {}

    for (let i in items) {
        if (items.hasOwnProperty(i)) {
            response = await axios.get(items[i].url, {
                headers: {
                    'Cookie': COOKIES.toString()
                }
            })

            result[items[i].type] = response.data.module_data.items.map(item => {
                return item.name
            })
        }
    }

    return result
}

const _getRetailerInfo = async () => {
    let response = await axios.get(API_URL + 'initial_bundle', {
        headers: {
            'Cookie': COOKIES.toString()
        }
    })

    return {
        cacheKey: response.data.bundle.cache_key,
        path: response.data.bundle.initial_container_path,
        info: response.data.bundle.current_retailer
    }
}

const _setLoginCookies = async (email, password) => {
    let response = await axios.get(BASE_URL + '#login')
    COOKIES = response.headers['set-cookie']
    let loginPage = cheerio.load(response.data)
    let token = loginPage("meta[name='csrf-token']")[0].attribs.content
    await _login(email, password, token)
    return true
}

const _login = async (email, password, token) => {
    try {
        let response = await axios.post(BASE_URL + 'accounts/login?source=web&cache_key=undefined',
            {
                authenticity_token: token,
                user: {
                    email: email,
                    password: password
                }
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'es,es-ES;q=0.9,ca;q=0.8,en;q=0.7',
                    'Content-Type': 'application/json',
                    'Cookie': COOKIES.toString(),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
                    'Origin': 'https://www.instacart.com',
                    'Referer': 'https://www.instacart.com',
                    'x-client-identifier': 'web',
                    'x-csrf-token': 'undefined',
                    'x-requested-with': 'XMLHttpRequest'
                }
            })

        COOKIES = response.headers['set-cookie']
        return true
    } catch (err) {
        throw new BelvoError("Login failed", "Unauthorized", 401)
    }
}

module.exports = {
    getShopInfo,
    getShopItems
}