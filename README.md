# Aplicacion de Vuelos NestJS
###### Notas del proyecto
## Instalacion del framework
En primer lugar, instalamos el CLI de NestJS en caso de no tenerlo instalado

```bash
$ npm i -g @nestjs/cli
```

Luego lo que vamos a hacer es instalar el framework para iniciar el desarrollo:

```bash
$ nest new flight-application
```

>_Seleccionamos npm para la instalacion de dependencias_

## Global Filter
Ahora vamos a crear un filtro global para **manejo de Excepciones**, para lo cual vamos a hacer lo siguiente:

* Dentro del directorio "src" creamos el directorio "commons".
* Dentro de "src/commons" creamos el directorio "filters".
* Dentro de "src/commons/filters" creamos un archivo llamado "http-exceptions.filter.ts".
* Luego de tener lista la programacion del archivo http-exceptions, vamos a main.ts e instanciamos esta clase de manera global.

```javascript
app.useGlobalFilters(new AllHttpExceptionsFilter());
```

## Global Interceptor
Lo siguiente que vamos a hacer es configurar el interceptor de timeout de manera global tambien. Para eso hacemos lo siguiente:

* Dentro del directorio "src/commons" creamos un directorio llamado "interceptors"
* Dentro del directorio "src/commons/interceptors" creamos el archivo timeout.interceptor.ts
* Luego de programar el archivo vamos a instanciarlo de manera global en main.ts usando la siguiente linea

    ```javascript
    app.useGlobalInterceptors(new TimeoutInterceptor());
    ```

## Dependencies 
A continuación vamos a instalar las dependencias necesarias para usar la BBDD de nuestro proyecto
* A continuación la lista de dependencias que vamos a instalar

    ```bash	
    $ npm i --save mongoose
    $ npm i --save mongoose-autopopulate
    $ npm i --save @nestjs/mongoose
    $ npm i --save @nestjs/config
    ```

## Conexion a MongoDB
* Creamos un nuevo archivo en la raiz del proyecto para almacenar las variables de entorno de la conexion a la BBDD
		.env.development

* En este archivo colocamos la siguiente variable de entorno
		#.env.development
        #Database Connection
    	URI_MONGODB=mongodb://localhost:27017/flight_application

* Ahora vamos al archivo app.module.ts
**_Importamos las dependencias necesarias para configurar la conexion a la BBDD_**
		
##### app.module.ts
```javascript
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
```

**_Dentro del arreglo imports (imports: []) agregamos lo siguiente:_**
##### app.module.ts
```javascript
ConfigModule.forRoot({
    envFilePath: ['env.development'],
    isGlobal: true 
}), 
MongooseModule.forRoot(process.env.URI_MONGODB)
```

## Modulo de Usuarios del Sistema
### Configuración inicial (Estructura del módulo de usuarios)
En primer lugar vamos a generar el modulo de usuarios utilizando el CLI de NestJS.

```bash
$ nest g mo auth/user
```

Ahora vamos a generar el controlador de user.

```bash
$ nest g co auth/user
```

Lo siguiente es generar el servicio.

```bash
$ nest g s auth/user
```

Ahora vamos a crear la interface de usuario, para eso vamos a crear los directorios **"interfaces/auth"** dentro de **"commons"**
y dentro de esta carpeta vamos a crear el archivo **_"user.interface.ts"_** con el siguiente código:

##### user.interface.ts
```javascript
export interface IUser extends Document{
    name: string;
    username: string;
    email: string;
    password: string;
}
```

Ahora creamos el DTO para usuarios, para esto vamos a crear el directorio **"dto"** dentro de **_"src/auth/user"_**.

Dentro de **"src/auth/user/dto"** vamor a crear el archivo **_"user.dto.ts"_** con el siguiente código:

##### user.dto.ts
```javascript
export class UserDTO{
    readonly name: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
}
```

Ahora vamos a instalar 2 dependencias que necesitamos para la validación de datos:

```bash
$ npm i class-validator class-transformer
```

Luego, actualizamos nuestro DTO de la siguiente manera:

##### user.dto.ts
```javascript
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
```

Ahora debemos colcoar la configuración global en **_"src/main.ts"_** para que la validación de datos tenga efecto.

##### main.ts
```javascript
app.useGlobalPipes(new ValidationPipe());
```

### Creando esquema y modelo de user

Lo primero que vamos a hacer es crear el directorio **_"schema"_** dentro de **"src/auth/user"**.

Dentro de **"src/auth/user/schema"** vamos a crear el archivo **_"user.schema.ts"_**

El código del archivo **user.schema.ts** es el siguiente:

##### user.schema.ts
```javascript
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
```

Vamos ahora a crear el directorio **_"models"_** dentro de **"src/commons"**.
Dentro de **"models"** creamos el archivo **_"models.ts"_** con el siguiente código.

##### models.ts
```javascript
export const USER = {name: 'users'};
```

Luego, esta constante **_"USER"_**, junto con **_"user.schema.ts"_** la vamos a importar en el modulo **"src/auth/user/user.module.ts"** de la siguiente manera:

##### user.module.ts
```javascript
import { MongooseModule } from '@nestjs/mongoose';
import { USER } from 'src/commons/models/models';
import { UserSchema } from './schema/user.schema';

imports: [
  MongooseModule.forFeatureAsync([
    {
      name:USER.name,
      useFactory:() => {
        return UserSchema;
      }
    }
  ])
],
```

### Creando endpoint para creacion de usuario

En primer lugar vamos a cambiar la URI del controlador **"src/auth/user/user.controller.ts"** de usuarios colocando lo siguiente:

##### user.controller.ts
```javascript
@Controller('api/v1/user')
```

Vamos a importar los elementos necesarios para poder crear el metodo para almacenar usuarios.

##### user.controller.ts
```javascript
import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
```

Ahora vamos a inyectar nuestro servicio en el constructor del controlador de la siguiente manera:

##### user.controller.ts
```javascript
constructor(private readonly _userService: UserService){}
```

Por ultimo, colocamos la programación del método **_store_** de nuestro controlador:

##### user.controller.ts
```javascript
@Post()
store(@Body() userDTO: UserDTO){
    return this._userService.store(userDTO);
}
```

Vamos a instalar una libreria para encriptar los passwords de los usuarios:

```bash
$ npm i bcrypt
```

Lo siguiente es programar el método **_store_** en el servicio **_"src/auth/user/user.service.ts"_**

Importamos las librerias y componentes necesarios:
##### user.service.ts
```javascript
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/commons/interfaces/auth/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from 'src/commons/models/models';
import { Model } from 'mongoose';
```

Inyectamos el modelo y la interface de user en el constructor
##### user.service.ts
```javascript
constructor(@InjectModel(USER.name) private readonly _model: Model<IUser>){}
```

Generamos un metodo para encriptar el password del usuario
##### user.service.ts
```javascript
async hashPassword(password: string): Promise<string>{
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
```

Y programamos el metodo para insertar el usuario en la BBDD
##### user.service.ts
```javascript
async store(userDTO: UserDTO): Promise<IUser>{
  const hash = await this.hashPassword(userDTO.password);
  const newUser = new this._model({...userDTO, password: hash});
  return await newUser.save();
}
```



