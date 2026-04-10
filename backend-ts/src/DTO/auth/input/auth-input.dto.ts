export interface GoogleLoginInputDto {
  idToken: string;
}

export interface FacebookLoginInputDto {
  accessToken: string;
}

export interface CompleteVerificationInputDto {
  token: string;
  password?: string;
}
