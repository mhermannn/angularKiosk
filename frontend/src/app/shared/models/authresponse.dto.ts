export interface AuthResponseDto {
  token: string;
  userId: number;
  username: string;
  role: string;
  resources: number;
}