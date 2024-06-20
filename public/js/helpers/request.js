const request = {
  get: ({ url, headers, data, success, error }) => {
    const xhr = new XMLHttpRequest()

    xhr.open("GET", url, true)
    xhr.onreadystatechange = function () {
      if (this.readyState != 4) return

      const responseText = this.responseText
      const response = responseText === '' ? responseText : JSON.parse(responseText)

      if ((this.status < 200 || this.status >= 400) && error) return error(response)
      if (success) success(response)
    }

    Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]))
    xhr.send(JSON.stringify(data))
  },
  post: ({ url, headers, data, success, error }) => {
    const xhr = new XMLHttpRequest()

    xhr.open("POST", url, true)
    xhr.onreadystatechange = function () {
      if (this.readyState != 4) return

      const responseText = this.responseText
      const response = responseText === '' ? responseText : JSON.parse(responseText)

      if ((this.status < 200 || this.status >= 400) && error) return error(response)
      if (success) success(response)
    }

    Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]))
    xhr.send(JSON.stringify(data))
  },
}