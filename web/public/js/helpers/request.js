const sendRequest = (method, url, headers, data, success, error) => {
  const xhr = new XMLHttpRequest()

  xhr.open(method, url, true)
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return

    const responseText = this.responseText
    const response = responseText === '' ? responseText : JSON.parse(responseText)

    if ((this.status < 200 || this.status >= 400) && error) return error(response)
    if (success) success(response)
  }

  Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]))
  xhr.send(JSON.stringify(data))
}

const request = {
  get: ({ url, headers, data, success, error }) =>
    sendRequest('GET', url, headers, data, success, error),
  post: ({ url, headers, data, success, error }) =>
    sendRequest('POST', url, headers, data, success, error),
  delete: ({ url, headers, data, success, error }) => 
    sendRequest('DELETE', url, headers, data, success, error),
}