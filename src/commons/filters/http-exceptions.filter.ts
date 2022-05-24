import { ArgumentsHost, Catch, ExceptionFilter, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter{
    
    private readonly _logger = new Logger(AllHttpExceptionsFilter.name);
    
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.getResponse() : exception;

        this._logger.error(`Status Code: ${status} | Error: ${JSON.stringify(message)}`);

        response.status(status).json({
            time: new Date().toISOString(),
            path: request.url,
            error: message
        });
    }
}