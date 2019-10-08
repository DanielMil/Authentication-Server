export enum status {
    Success = "Success", 
    Failure = "Failure"
}

export interface userModel {
    username: string,
    password: string,
    email: string, 
    id: any,
    resetPasswordToken: string,
    resetPasswordExpiration: number,
    save: (err?: Error) => void
};

export interface MailObject {
    from: string | undefined,
    to: string,
    subject: string,
    text: string
}
