export class SuccessResponseDto {
  constructor(
    public message: string,
    public data: any = null,
  ) {}
}