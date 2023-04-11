import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";

const useAuth = () => {
  // const [currentGoogleUser, setCurrentGoogleUser] = React.useState<any>(null);

  const [currentUser, setCurrentUser] = React.useState<any>(null);

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

        // const response = await axios.post("/api/users", newUser);

        const userReponse = await axios.get("/api/users", {
          params: {
            email: newUser.email,
          },
        });

        // setCurrentUser(response.data);

        // console.log(response.data);

      } catch (error: any) {
        console.log(error);
        switch (error.response.status) {
          case 400:
            console.log("User already exists");
            // login with google
            break;
          default:
            console.log(error.message);
        }
      }

      setShowLoginModal(false);
    },
    onError: (error: any) => {
      console.log(`Failed to continue with Google, message: ${error.message}`)
    },
  });

  return { currentUser, continueWithGoogle, showLoginModal, setShowLoginModal };
};

export default useAuth;
