import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";

const AuthContext = React.createContext();
const Stack = createStackNavigator();

export default function App({ navigation }) {
  const axios = require("axios").default;
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        //console.log(data);
        if (!data.username.trim()) {
          alert("Please Enter username");
          return;
        }
        if (!data.password.trim()) {
          alert("Please Enter password");
          return;
        }
        navigation.navigate("HomeScreen");
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        if (!data.username.trim()) {
          alert("Please Enter Name");
          return;
        }
        if (!data.password.trim()) {
          alert("Please Enter Email");
          return;
        }
        if (!data.email.trim()) {
          alert("Please Enter Email");
          return;
        }
        try {
          var data = JSON.stringify({
            username: data.username,
            password: data.password,
            email: data.email,
          });
          console.log(data);
          var config = {
            method: "post",
            url: "https://united-creek-276420-default-rtdb.firebaseio.com/register.json",
            headers: {
              "Content-Type": "application/json",
            },
            data,
          };
          axios(config).then(function (response) {
            alert("ok");
            console.log(response.data);
            //navigation.navigate("SignIn");
          });
        } catch (e) {
          alert("error");
          console.log(e);
        }
        // dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      Reset_password: (data) => {
        //setUserError((value) => !value);
        if (!data.email.trim()) {
          alert("Please Enter email");
          return;
        } else {
          nameError: null;
        }
      },
    }),
    []
  );
  const MyTheme = {
    colors: {
      primary: "black",
      background: "#FFD3B5",
      text: "#FFD3B5",
    },
  };
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          {state.userToken == null ? (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  headerShown: false,
                  headerTitle: "Sign In",
                }}
              />
              <Stack.Screen name="Register" component={RegisterUser} />
              <Stack.Screen
                name="ResetScreen"
                component={ResetScreen}
                options={{
                  headerTitle: "Reset Screen",
                }}
              />
            </>
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>ok</Text>
      <Button title="Sign in" onPress={() => alert("ok")} />
    </View>
  );
}

function ResetScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const onSubmitFormHandler = async () => {
    if (!email.trim()) {
      setEmail(() => ({ nameError: "First name required." }));
    } else {
      setEmail(() => ({ nameError: null }));
    }
  };

  const { Reset_password } = React.useContext(AuthContext);

  return (
    <View style={styles.RegisterUsercontainer}>
      <Text style={styles.signuptitle}>Reset Password</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      {!!email.nameError && (
        <Text style={{ color: "red" }}>{email.nameError}</Text>
      )}

      <View style={styles.TouchableOpacitybuttonregister}>
        <TouchableOpacity onPress={() => onSubmitFormHandler()}>
          <AntDesign name="mail" size={60} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RegisterUser() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const { signUp } = React.useContext(AuthContext);
  return (
    <View style={styles.RegisterUsercontainer}>
      <Text style={styles.signuptitle}>Register</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.TouchableOpacitybuttonregister}>
        <TouchableOpacity onPress={() => signUp({ username, email, password })}>
          <AntDesign name="mail" size={60} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
function SignInScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn } = React.useContext(AuthContext);

  return (
    <View style={styles.maincontainer}>
      <Text style={styles.signuptitle}>Sign in</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.subdetail}>
        <View style={styles.frgpasw}>
          <Button
            title="Forgot password ?"
            color={"black"}
            onPress={() => navigation.navigate("ResetScreen")}
          />
        </View>
        <View style={styles.signup}>
          <Button
            title="Sign Up"
            color={"black"}
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </View>

      <View style={styles.TouchableOpacitybuttonSignin}>
        <TouchableOpacity onPress={() => signIn({ username, password })}>
          <Entypo name="fingerprint" size={80} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signuptitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  frgpasw: { marginRight: 10 },
  signup: { marginLeft: 10 },
  subdetail: { flexDirection: "row", paddingBottom: 20 },
  TouchableOpacitybuttonSignin: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  TouchableOpacitybuttonregister: {
    paddingTop: 30,
    paddingLeft: 10,
  },
  maincontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD3B5",
  },
  RegisterUsercontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD3B5",
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 2,
    marginTop: 15,
    borderRadius: 5,
    paddingLeft: 8,
    backgroundColor: "#FFAAA6",
  },
});
