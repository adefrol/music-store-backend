export class CreateUserDto {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    recovery_code: string;
    register_code: string;
}
