import dcSwitcher from 'app/core/services/DCSwitcher';

export function http(body: ArrayBuffer): Promise<ArrayBuffer> {
  const dcConf = dcSwitcher.getUrl();
  
  return fetch(`http://${dcConf.host}:${dcConf.port}/${dcSwitcher.getEndpoint()}`, {
    method: 'POST',
    keepalive: true,
    body,
  })
    .then(r => {
      if (r.status === 404) {
        return Promise.reject(r);
      }
      
      return r;
    })
    .then(r => r.blob())
    .then((blob: any) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event: any) => resolve(event.target.result);
        fileReader.onerror = () => reject()
        fileReader.readAsArrayBuffer(blob);
      });
    })
}
