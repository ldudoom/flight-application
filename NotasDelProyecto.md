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
		#Database Connection
    	URI_MONGODB=mongodb://localhost:27017/flight_application

* Ahora vamos al archivo app.module.ts
**_Importamos las dependencias necesarias para configurar la conexion a la BBDD_**
		import { ConfigModule } from '@nestjs/config';
		import { MongooseModule } from '@nestjs/mongoose';

**_Dentro del arreglo imports (imports: []) agregamos lo siguiente:_**

		ConfigModule.forRoot({
			envFilePath: ['env.development'],
			isGlobal: true 
		}), 
		MongooseModule.forRoot(process.env.URI_MONGODB, {
			useCreateIndex: true,
			useFindAndModify: false
		})