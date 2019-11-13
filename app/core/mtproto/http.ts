export function http(body: ArrayBuffer) {
  return fetch('http://149.154.167.50:443/apiw1', {
    method: 'POST',
    body,
  })
    .then(r => r.blob())
    .then((blob: any) => {
      return new Promise(r => {
        const fileReader = new FileReader();
        fileReader.onload = (event: any) => r(event.target.result);
        fileReader.readAsArrayBuffer(blob);
      });
    });
}
