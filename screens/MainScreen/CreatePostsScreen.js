import React, { useState, useEffect } from "react";

import {
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import * as Location from "expo-location";

import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import noImgPlaceholder from "../../assets/img/postsScreenPlaceholderNoImage_opt.png";
import withImgPlaceholder from "../../assets/img/postsScreenPlaceholderWithImage_opt.png";

import {
  PostsContainer,
  CreatePostsImgContainer,
  CreatePostsImgIcon,
  CreatePostsInfo,
  CreatePostsInputContainer,
  CreatePostsInput,
  CreatePostsRemoveIconContainer,
  CreatePostsSubmitBtn,
  CreatePostsSubmitText,
  CreatePostsLocationIconContainer,
  CreatePostsDetailsContainer,
  CreatePostsImgSubContainer,
  CreatePostsCameraView,
  CreatePostsSnapBtn,
  CreatePostsSnapPreview,
  CreatePostsSnapPreviewContainer,
} from "../../ui/main";

const calculatedScreenWidth = `${Math.floor(
  Dimensions.get("window").width - 32
)}px`;

const initialState = {
  uri: "",
  name: "",
  location: "",
  latitude: "",
  longitude: "",
};

export default function CreatePostsScreen({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [photoData, setPhotoData] = useState(initialState);
  const [imgIsAdded, setImgIsAdded] = useState(false);
  const [isNameInFocus, setIsNameInFocus] = useState(false);
  const [isLocationInFocus, setIsLocationInFocus] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (photoData.uri && photoData.name && photoData.location) {
      setSubmitIsDisabled(false);
    }
  });

  const takePhoto = async () => {
    setImgIsAdded(true);
    const photo = await camera.takePictureAsync();
    const location = await Location.getCurrentPositionAsync();
    console.log(location);
    setPhotoData((prevState) => ({
      ...prevState,
      uri: photo.uri,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
  };

  const nameHandler = (value) =>
    setPhotoData((prevState) => ({ ...prevState, name: value }));
  const locationHandler = (value) =>
    setPhotoData((prevState) => ({ ...prevState, location: value }));

  const onInputFocus = (name) => {
    setKeyboardIsShown(true);
    switch (name) {
      case "name":
        setIsNameInFocus(true);
        break;
      case "location":
        setIsLocationInFocus(true);
        break;
      default:
        alert("Something went wrong...");
        return;
    }
  };

  const onInputBlur = (name) => {
    switch (name) {
      case "name":
        setIsNameInFocus(false);
        break;
      case "location":
        setIsLocationInFocus(false);
        break;
      default:
        alert("Something went wrong...");
        return;
    }
  };

  const onScreenPress = () => {
    Keyboard.dismiss();
    setKeyboardIsShown(false);
  };

  const removeData = () => {
    setPhotoData(initialState);
    setSubmitIsDisabled(true);
    setImgIsAdded(false);
  };

  const onSubmit = () => {
    console.log("Photo data:", photoData);
    navigation.navigate("????????????????????", { photoData });
    setPhotoData(initialState);
    setSubmitIsDisabled(true);
    setImgIsAdded(false);
  };

  return (
    <TouchableWithoutFeedback onPress={onScreenPress}>
      <PostsContainer keyboardIsShown={keyboardIsShown}>
        <CreatePostsImgContainer>
          <CreatePostsImgSubContainer>
            <CreatePostsCameraView ref={setCamera}></CreatePostsCameraView>
          </CreatePostsImgSubContainer>
          {photoData.uri !== "" && (
            <CreatePostsSnapPreviewContainer>
              <CreatePostsSnapPreview
                source={{ uri: photoData.uri }}
              ></CreatePostsSnapPreview>
            </CreatePostsSnapPreviewContainer>
          )}
          <CreatePostsSnapBtn onPress={takePhoto}>
            <CreatePostsImgIcon
              source={imgIsAdded ? withImgPlaceholder : noImgPlaceholder}
            ></CreatePostsImgIcon>
          </CreatePostsSnapBtn>
          <CreatePostsInfo>
            {imgIsAdded ? "???????????????????? ????????" : "?????????????????????? ????????"}
          </CreatePostsInfo>
        </CreatePostsImgContainer>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : ""}>
          <CreatePostsDetailsContainer screenWidth={calculatedScreenWidth}>
            <CreatePostsInputContainer isInFocus={isNameInFocus}>
              <CreatePostsInput
                placeholder="??????????..."
                value={photoData.name}
                onChangeText={nameHandler}
                onFocus={() => onInputFocus("name")}
                onBlur={() => onInputBlur("name")}
                isInFocus={isNameInFocus}
              />
            </CreatePostsInputContainer>
            <CreatePostsInputContainer isInFocus={isLocationInFocus} isLastItem>
              <CreatePostsLocationIconContainer>
                <EvilIcons name="location" size={24} color="#bdbdbd" />
              </CreatePostsLocationIconContainer>
              <CreatePostsInput
                placeholder="??????????????..."
                value={photoData.location}
                onChangeText={locationHandler}
                onFocus={() => onInputFocus("location")}
                onBlur={() => onInputBlur("location")}
                isInFocus={isLocationInFocus}
              />
            </CreatePostsInputContainer>
          </CreatePostsDetailsContainer>
        </KeyboardAvoidingView>
        <CreatePostsSubmitBtn
          submitIsDisabled={submitIsDisabled}
          disabled={submitIsDisabled}
          screenWidth={calculatedScreenWidth}
          onPress={onSubmit}
        >
          <CreatePostsSubmitText submitIsDisabled={submitIsDisabled}>
            ????????????????????????
          </CreatePostsSubmitText>
        </CreatePostsSubmitBtn>
        <CreatePostsRemoveIconContainer onPress={removeData}>
          <AntDesign name="delete" size={24} color="#bdbdbd" />
        </CreatePostsRemoveIconContainer>
      </PostsContainer>
    </TouchableWithoutFeedback>
  );
}
