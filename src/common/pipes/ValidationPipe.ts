import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException
} from '@nestjs/common';
import { validate } from 'class-validator';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype) return value;
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(this.formatErrors(errors));
        }

        return value;
    }

    private formatErrors(errors: any[]) {
        return errors.map(err => ({
            property: err.property,
            constraints: err.constraints
        }));
    }
}
