If you are running on windows I'd recommend you to either install an ubuntu VM on your PC or use WSL https://learn.microsoft.com/en-us/windows/wsl/install
Either of the two options are pre-conditions for this project to run smoothly.

the app can be installed with npm, however I'd recommend that you use nvm to make your node version management a bit easier
[nvm](https://github.com/nvm-sh/nvm)

After installing nvm restart your terminal and go into the src root folder (where this README is) and run npm i followed by npm start

Your default browsr should show up and navigates to localhost:3000. On this page a small notifaction should be visible whether or not the page is allowed to access the camera feed. Click Allow and you should see you camera feed on the webpage.
On the settings page you can easily amend the backend settings. The Live-Mode will send a POST request with the captured image as a base64 sting in its payload in the specified interval (default every second)

Thats all for now. ask me if you have any questions
