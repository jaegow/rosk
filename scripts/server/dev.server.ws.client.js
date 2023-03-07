function() {
    const webSocket = new WebSocket(`ws://${window.location.host}/ws`);
    webSocket.onopen = (event) => {
        console.log('client:webSocket.onopen', { event });

        webSocket.send('client:webSocket.send() - we did it');

        webSocket.onmessage = (event) => {
            console.log({ event });
        }
    };
}
