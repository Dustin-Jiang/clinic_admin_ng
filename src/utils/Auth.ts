import { ref, type Ref } from "vue"
import Api from "./Api"
import type API from "@/store/api";

class AuthBase {
  /**
   * This CAN NOT be used in serious circumstances.
   * In "sudo" situations, use `Auth.auth()` instead to verify.
   */
  isLogin: Ref<boolean>;
  user: Ref<API.IUsers | null>;

  constructor() {
    this.isLogin = ref(false)
    this.user = ref(null)
    
    this.login().then(() => {
      this.auth().then((userInfo) => {
        this.isLogin.value = true
        this.user.value = userInfo
      }).catch(() => {
        this.isLogin.value = false
        this.user.value = null
      })
    })
  }

  ready() {
    return new Promise<void>((resolve) => {
      const checkLogin = () => {
        if (this.isLogin.value) {
          resolve();
        } else {
          setTimeout(checkLogin, 100);
        }
      };
      checkLogin();
    });
  }

  async login() {
    try {
      await Api.get<null>('/auth/')
      this.isLogin.value = true
    }
    catch (e) {
      this.isLogin.value = false
      window.location.href = '/auth/'
    }
  }

  async auth(): Promise<API.IUsers> {
    return (await Api.get<API.IUsers>(`/api/user/`)).data
  }

  logout() {
    this.isLogin.value = false
  }
}

const Auth = new AuthBase()
export default Auth;