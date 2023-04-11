import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setUser } from "@/redux-store/store";
import MDBUser from "@/server/models/MDBUser";

const useAuth = () => {
  // const [currentGoogleUser, setCurrentGoogleUser] = React.useState<any>(null);

  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const continueWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        const googleURL = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;
  
        const googleUserReponse = await axios.get(googleURL);
        const googleUserData = googleUserReponse.data;

        const newUser = {
          name: googleUserData.name,
          email: googleUserData.email,
          profile_image_url: googleUserData.picture,
        };

        const response = await axios.post("/api/users", newUser);

        console.log(response.data);

      } catch (error: any) {
        console.log(error.message);
      }

      setShowLoginModal(false);
    },
    onError: (error: any) => {
      console.log(`Failed to continue with Google, message: ${error.message}`)
    },
  });

  return { continueWithGoogle, showLoginModal, setShowLoginModal };
};

export default useAuth;
