import appleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation
} from '@invertase/react-native-apple-authentication'

export default class AppleAuth {

  static async login() {
    // start a login request
    let result = { error: true }
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME
        ]
      })

      const {
        user,
        email,
        nonce,
        identityToken,
        authorizationCode
      } = appleAuthRequestResponse

      if (!identityToken) {
        result.msg = '获取Apple ID 信息失败'
        return result
      }

      const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user)

      // use credentialState response to ensure the user is authenticated
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        // user is authenticated
        result.error = false
        result.data = appleAuthRequestResponse
        return result
      } else {
        result.code = credentialState
        result.msg = '登录认证信息失败'
        return result
      }
    } catch (e) {
      __DEV__ && console.log(e)
      if (e.code === AppleAuthError.CANCELED) {
        result.msg = '用户取消登录'
      } else {
        result.msg = '登录认证失败'
      }
      result.code = e.code
      return result
    }
  }
}