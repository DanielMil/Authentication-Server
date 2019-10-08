export enum status {
    Success = "Success",
    Failure = "Failure"
}

export interface userModel {
    email: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordExpiration: number,
    additionalInfo: object,
    id: any,
    save: (err?: Error) => Promise<any>
};

export interface MailObject {
    from: string | undefined,
    to: string,
    subject: string,
    text: string
}
