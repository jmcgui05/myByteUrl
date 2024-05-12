# myByteUrl

### Requirements:
- Client: POST http://localhost:8000/url params: {"url": "www.hello.com"}
- Server generates shortened URL: http://localhost:8000/a2b345w68s
- Server: Sends back to the client through a different protocol {"shortenedURL": "http://localhost:8000/a2b345w68s"}
- Client: GET http://localhost:8000/a2b345w68s
- Server: Returns the following response to the GET request above - {"url": "www.hello.com"}

### Items to note:
- A front end component is out of scope
- We can test client/server connection using the index.html
- We can test POST/GET via Postman

### Steps to test POST/GET:
- run `npm install`
- from the project root, run `npm start`
- Verify the Server is running on port `8000`
- Go to Postman and create a `POST` request to hit url `localhost:8000/url?url=www.hello.com`. Add another example `localhost:8000/url?url=www.there.com`.
- Verify the console shows a log of the current url map, detailing both entries
- Verify the console shows the following logs:
  - A Client has connected
  - Sending the shortenedUrl:  { shortenedURL: 'http://localhost::8000/6fc04d1aa4' }
  - WebSocket connection closed.
 
### Steps to test client/server connection:
- Open the `index.html` file in your browser
- In the browser, open the dev tools and click `Console`
- In the root of the project, run `npm start`
- Go back to the browser and click `Connect via WebSocket`
- Verify the server console shows the following logs:
  - A Client has connected
  - Client acknowledged receipt.
- Verify the browser console shows the following logs:
  - Connected to server
  - Received result from server: `MessageEvent {isTrusted: true, data: 'Hello Client', origin: 'ws://localhost:8000', lastEventId: '', source: null, …}`
  - Should have sent a ack 
