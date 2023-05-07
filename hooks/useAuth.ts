import React, { useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { useGoogleLogin } from "@react-oauth/google";
import MDBUser from "@/server/models/MDBUser";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { setCurrentUser } from "@/redux-store/store";

const useAuth = () => {
  // const [currentGoogleUser, setCurrentGoogleUser] = React.useState<any>(null);

  // const [currentUser, setCurrentUser] = React.useState<any>(null);

  // stripe

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] =
    React.useState<boolean>(false);

  const [showSplashScreen, setShowSplashScreen] = React.useState<boolean>(true);

  useEffect(() => {
    reloadCurrentLocalUser()
      .then((user) => {
        // console.log("User reloaded");
      })
      .catch((error) => {
        // console.log("No authenticated user found");

        // redirect to login page
        // if current route or path name is not /, then redirect to pathname and don't use router
        if (window.location.pathname !== "/") {
          window.location.pathname = "/";
        }
      });
  }, []);

  // reload current user promise
  const reloadCurrentLocalUser = async () => {
    return new Promise((resolve, reject) => {
      setShowSplashScreen(true);
      const loggedInUser = localStorage.getItem("currentUser");
      if (loggedInUser) {
        // setCurrentUser(JSON.parse(loggedInUser));
        const loggedInUserData = JSON.parse(loggedInUser);
        dispatch(setCurrentUser(loggedInUserData));
        setShowSplashScreen(false);
        resolve(loggedInUserData);
      } else {
        setShowSplashScreen(false);
        reject("No user found");
        // redirect to login page
      }
    });
  };

  const fetchCurrentUser = async (userId: string) => {
    try {
      const userResponse = await axios({
        method: "GET",
        url: `/api/users/${userId}`,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      })
      dispatch(setCurrentUser(userResponse.data));
      localStorage.setItem("currentUser", JSON.stringify(userResponse.data));
    } catch (error: AxiosError | any) {
      if (error.response) {
        if (error.response.status === 401) {
          // redirect to login page
        }
      }
    }
  };

  // google signin trigger
  const continueWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse: any) => onGoogleLoginSuccess(tokenResponse),
    onError: (error: any) => onGoogleLoginError(error),
  });

  // google signin success handler
  const onGoogleLoginSuccess = async (tokenResponse: any) => {
    try {
      setIsLoadingCurrentUser(true);

      const accessToken = tokenResponse.access_token;
      const googleURL = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;

      const googleUserReponse = await axios.get(googleURL);

      // create new user if not exists in db
      const googleUserData = googleUserReponse.data;
      
      const createUserReponse = await axios({
        method: "POST",
        url: "/api/users",
        data: googleUserData,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      })

      // if user exists, return fetched user data
      setCurrentUser(createUserReponse.data);
      dispatch(setCurrentUser(createUserReponse.data));

      localStorage.setItem(
        "currentUser",
        JSON.stringify(createUserReponse.data)
      );

      // alert("Please try again, we're fixing this issue.")
      setIsLoadingCurrentUser(false);
      setShowLoginModal(false);
    } catch (error: AxiosError | any) {
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data.error === "User already exists"
        ) {
          // user exists handler
          // regularly login
        }
      }
      setIsLoadingCurrentUser(false);
    }
  };

  // const retrieveStripeCustomer = async (stripeCustomerId: string) => {
  //   try {
  //     const customer = await stripe.customers.retrieve("cus_N1EIsJONu0VsIc");
  //     // const customers = await stripe.customers.list();
  //     console.log(customer);
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // }

  const createNewStripeCustomer = async (email: string) => {
    try {
    } catch (error: any) {
      console.log(error);
    }
  };

  // google signin failure handler
  const onGoogleLoginError = (error: any) => {
    console.log("onGoogleLoginError");
    alert("Please try again, we're fixing this issue.");
    setShowLoginModal(false);
  };

  const logOut = () => {
    localStorage.removeItem("currentUser");
    dispatch(setCurrentUser(null));
    window.location.href = "/";
  };

  // const continueWithGoogle = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const accessToken = tokenResponse.access_token;
  //       const googleURL = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;

  //       const googleUserReponse = await axios.get(googleURL);
  //       const googleUserData = googleUserReponse.data;

  //       const newUser = {
  //         name: googleUserData.name,
  //         email: googleUserData.email,
  //         profile_image_url: googleUserData.picture,
  //       };

  //       // const response = await axios.post("/api/users", newUser);

  //       const userReponse = await axios.get("/api/users", {
  //         params: {
  //           email: newUser.email,
  //         },
  //       });

  //       if (userReponse?.data?.data !== null) {
  //         // user exists
  //         console.log("it doesn't exist")
  //         console.log(userReponse.data);
  //         console.log(userReponse.data.data)
  //         setCurrentUser(userReponse.data);
  //         return
  //       }

  //       console.log("still here");

  //       // user does not exist
  //       // create new user
  //       const createNewUserResponse = await axios.post("/api/users", newUser);
  //       setCurrentUser(createNewUserResponse.data);

  //       console.log(createNewUserResponse.data);

  //     } catch (error: any) {
  //       console.log(error);
  //       switch (error.response.status) {
  //         case 400:
  //           console.log("User already exists");
  //           // login with google
  //           break;
  //         default:
  //           console.log(error.message);
  //       }
  //     }

  //     setShowLoginModal(false);
  //   },
  //   onError: (error: any) => {
  //     console.log(`Failed to continue with Google, message: ${error.message}`)
  //   },
  // });

  return {
    continueWithGoogle,
    showLoginModal,
    setShowLoginModal,
    isLoadingCurrentUser,
    showSplashScreen,
    setShowSplashScreen,
    reloadCurrentLocalUser,
    logOut,
    fetchCurrentUser,
  };
};

export default useAuth;
