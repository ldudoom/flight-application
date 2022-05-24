## Aplicacion de Vuelos NestJS (Raul Chauvin)
#### Instalacion del framework
En primer lugar, instalamos el CLI de NestJS en caso de no tenerlo

	$ npm i -g @nestjs/cli

Luego lo que vamos a hacer es instalar el framework para iniciar el desarrollo:

	$ nest new flight-application
>_Seleccionamos npm para la instalacion de dependencias_

#### Global Filter
Ahora vamos a crear un filtro global para **manejo de Excepciones**, para lo cual vamos a hacer lo siguiente:

* Dentro del directorio "src" creamos el directorio "commons".
* Dentro de "src/commons" creamos el directorio "filters".
* Dentro de "src/commons/filters" creamos un archivo llamado "http-exceptions.filter.ts".
* Luego de tener lista la programacion del archivo http-exceptions, vamos a main.ts e instanciamos esta clase de manera global.

		app.useGlobalFilters(new AllHttpExceptionsFilter());

#### Global Interceptor
Lo siguiente que vamos a hacer es configurar el interceptor de timeout de manera global tambien. Para eso hacemos lo siguiente:

* Dentro del directorio "src/commons" creamos un directorio llamado "interceptors"
* Dentro del directorio "src/commons/interceptors" creamos el archivo timeout.interceptor.ts
* Luego de programar el archivo vamos a instanciarlo de manera global en main.ts usando la siguiente linea
		app.useGlobalInterceptors(new TimeoutInterceptor());

#### Dependencies 
A continuación vamos a instalar las dependencias necesarias para usar la BBDD de nuestro proyecto
* A continuación la lista de dependencias que vamos a instalar
		$ npm i --save mongoose
		$ npm i --save mongoose-autopopulate
		$ npm i --save @nestjs/mongoose
		$ npm i --save @nestjs/config

#### Conexion a MongoDB
* Creamos un nuevo archivo en la raiz del proyecto para almacenar las variables de entorno de la conexion a la BBDD
		.env.development

* En este archivo colocamos la siguiente variable de entorno
		#.env.development
        #Database Connection
    	URI_MONGODB=mongodb://localhost:27017/flight_application

* Ahora vamos al archivo app.module.ts
**_Importamos las dependencias necesarias para configurar la conexion a la BBDD_**
		# app.module.ts
        import { ConfigModule } from '@nestjs/config';
		import { MongooseModule } from '@nestjs/mongoose';

**_Dentro del arreglo imports (imports: []) agregamos lo siguiente:_**
        # app.module.ts
		ConfigModule.forRoot({
			envFilePath: ['env.development'],
			isGlobal: true 
		}), 
		MongooseModule.forRoot(process.env.URI_MONGODB, {
			useCreateIndex: true,
			useFindAndModify: false
		})

#### Modulo de Usuarios del Sistema
En primer lugar vamos a generar el modulo de usuarios utilizando el CLI de NestJS.

    $ nest g mo auth/user

Ahora vamos a generar el controlador de user.

    $ nest g co auth/user

Lo siguiente es generar el servicio.

    $ nest g s auth/user

Ahora vamos a crear la interface de usuario, para eso vamos a crear los directorios **"interfaces/auth"** dentro de **"commons"**
y dentro de esta carpeta vamos a crear el archivo **_"user.interface.ts"_** con el siguiente código:

    # user.interface.ts
    export interface IUser extends Document{
        name: string;
        username: string;
        email: string;
        password: string;
    }

Ahora creamos el DTO para usuarios, para esto vamos a crear el directorio **"dto"** dentro de **_"src/auth/user"_**.

Dentro de **"src/auth/user/dto"** vamor a crear el archivo **_"user.dto.ts"_** con el siguiente código:

    # user.dto.ts
    export class UserDTO{
        readonly name: string;
        readonly username: string;
        readonly email: string;
        readonly password: string;
    }

Ahora vamos a instalar 2 dependencias que necesitamos para la validación de datos:

    $ npm i class-validator class-transformer

Luego, actualizamos nuestro DTO de la siguiente manera:

    # user.dto.ts
    import { IsEmail, IsNotEmpty, IsString } from "class-validator";

    export class UserDTO{
        @IsNotEmpty()
        @IsString()
        readonly name: string;

        @IsNotEmpty()
        @IsString()
        readonly username: string;

        @IsNotEmpty()
        @IsEmail()
        readonly email: string;
        
        @IsNotEmpty()
        @IsString()
        readonly password: string;
    }

Ahora debemos colcoar la configuración global en **_"src/main.ts"_** para que la validación de datos tenga efecto.

    #main.ts
    app.useGlobalPipes(new ValidationPipe());