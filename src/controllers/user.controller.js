import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details
  // validation - not empty
  // check if user already exists
  // check for images, avatar
  // upload images to cloudinary
  // create user object, create entry in db
  // remove password and refresh token from response
  // check for user creation
  // return response
  const { username, email, password, fullName } = req.body;
  console.log("email", email);
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError("All fields are required", 400);
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError("User with email or username already exists", 409);
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError("Avatar file is required", 400);
  }
  // upload images to cloudinary
  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError("Avatar file is required", 400);
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });
  const createdUser = await User.findByIdAndUpdate(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError("Something went wrong while registering the user", 500);
  }
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
