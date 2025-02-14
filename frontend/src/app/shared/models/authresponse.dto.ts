export interface AuthResponseDto {
  readonly token: string;
  readonly userId: number;
  readonly username: string;
  readonly role: string;
  readonly resources: number;
}