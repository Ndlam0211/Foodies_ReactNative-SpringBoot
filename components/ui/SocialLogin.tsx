import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useStyles } from 'react-native-unistyles'
import { phoneStyles } from '@/unistyles/phoneStyles'
import Icon from '../global/Icon'
import { RFValue } from 'react-native-responsive-fontsize'

// WebBrowser.maybeCompleteAuthSession();

// const useProxy = true;
// const redirectUri = AuthSession.makeRedirectUri({
//   scheme: "foodies", // phải khớp với app.json
// });

// const discovery = {
//   authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
//   tokenEndpoint: "https://oauth2.googleapis.com/token",
//   revocationEndpoint: "https://oauth2.googleapis.com/revoke",
// };

const SocialLogin: FC = () => {
  const { styles } = useStyles(phoneStyles);

  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const clientId = "799149011042-l48hgtq3p2somc2levvf9fgim89hq180.apps.googleusercontent.com";

//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     {
//       clientId,
//       redirectUri,
//       scopes: ["openid", "profile", "email"],
//       responseType: AuthSession.ResponseType.Token,
//     },
//     discovery
//   );

//   useEffect(() => {
//     if (response?.type === "success") {
//       const { access_token } = response.params;
//       setToken(access_token);
//       getUserInfo(access_token);
//     }
//   }, [response]);

//   const getUserInfo = async (token: string) => {
//     try {
//       const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const user = await res.json();
//       setUserInfo(user);
//     } catch (error) {
//       console.log(error);
//     }
//   };

  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        style={styles.iconContainer}
        // disabled={!request}
        // onPress={() => promptAsync()}
      >
        <Image
          source={require("@/assets/icons/google.png")}
          style={styles.gimg}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon
          name="logo-facebook"
          iconFamily="Ionicons"
          color="#222"
          size={RFValue(18)}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon
          name="ellipsis-horizontal-sharp"
          iconFamily="Ionicons"
          color="#222"
          size={RFValue(18)}
        />
      </TouchableOpacity>
    </View>
  );
}

export default SocialLogin