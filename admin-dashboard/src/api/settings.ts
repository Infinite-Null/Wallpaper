const API_SETTING = {
    baseUrl: 'http://localhost:3000/',
    namespace: 'api/v1/admin',
    full_url: '',
}

API_SETTING.full_url = API_SETTING.baseUrl + API_SETTING.namespace;

export default API_SETTING;