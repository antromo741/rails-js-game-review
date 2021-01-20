class Auth {
    static init() {
      this.getCurrentUser()
    }

    static setToken(token) {
       localStorage.setItem('token', token);
       localStorage.setItem('lastLoginTime', new Date(Date.now()).getTime())
    }

    static getToken() {
        let now = new Date(Date.now()).getTime();
        let thirtyMinutes = 1000 * 60 * 30;
        let timeSinceLastLogin = now - localStorage.getItem('lastLoginTime');
        if(timeSinceLastLogin < thirtyMinutes) {
          return localStorage.getItem('token');
        }
    }
    
    static revokeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('lastLoginTime');
    }

    static fetch(url, options) {
        let fetchOptions = Object.assign({}, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": this.getToken()
            }
        }, options);
        return fetch(url, fetchOptions)
        .then(res => {
        if (res.ok) {
            return res.json();
        } else{
            return res.text().then(error => Promise.reject(error));
        }
    })
    .catch(error => new FlashMessage(error));
    }

    static loginForm() {
        this.loginFormElement ||= document.createElement("form");
        this.loginFormElement.classList.set("authForm bg-white rounded px-8 pt-0 pb-2 mb-4");
        this.loginFormElement.innerHTML = `
          <h1 class="text-2xl font-bold mb-4">Login</h1>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="email" 
              type="email" 
              name="email" 
              placeholder="email"
            >
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input 
              class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              type="password" 
              name="password" 
              placeholder="******************"
            >
            <p class="text-red-500 text-xs italic">Please choose a password.</p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input 
              class="multi-submit bg-blue-500 hover:bg-blue-700 transition duration-200 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              value="Login"
            />
            <input 
              class="multi-submit bg-green-500 hover:bg-green-700 transition duration-200 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              value="Signup"
            />
          </div>
        `;
        return this.loginFormElement;
      }
}