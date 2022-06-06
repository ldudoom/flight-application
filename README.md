# Aplicacion de Vuelos NestJS
###### Notas del proyecto
## Instalacion del framework
* En primer lugar, instalamos el CLI de NestJS en caso de no tenerlo instalado
    ```bash
    $ npm i -g @nestjs/cli
    ```

* Luego lo que vamos a hacer es instalar el framework para iniciar el desarrollo:
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
* Esta es la lista de dependencias que vamos a instalar

    ```bash	
    $ npm i --save mongoose
    $ npm i --save mongoose-autopopulate
    $ npm i --save @nestjs/mongoose
    $ npm i --save @nestjs/config
    ```

## Conexion a MongoDB
* Creamos un nuevo archivo en la raiz del proyecto para almacenar las variables de entorno de la conexion a la BBDD
		**_.env.development_**

* En este archivo colocamos la siguiente variable de entorno
		```
        #.env.development
        #Database Connection
        URI_MONGODB=mongodb://localhost:27017/flight_application
        ```

* Vamos al archivo **_app.module.ts_** e importamos las dependencias necesarias para configurar la conexion a la BBDD
		
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
* En primer lugar vamos a generar el modulo de usuarios utilizando el CLI de NestJS.
    ```bash
    $ nest g mo auth/user
    ```

* Generamos el controlador de user.
    ```bash
    $ nest g co auth/user
    ```

* Lo siguiente es generar el servicio.
    ```bash
    $ nest g s auth/user
    ```

Creamos la interface de usuario, para eso vamos a crear los directorios **"interfaces/auth"** dentro de **"commons"**
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

Creamos el DTO para usuarios, para esto vamos a crear el directorio **"dto"** dentro de **_"src/auth/user"_**.

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

Vamos a instalar 2 dependencias que necesitamos para la validación de datos:

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
      name: USER.name,
      useFactory: () => UserSchema
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
_Es un método asíncrono que recibe el DTO de user y devuelve como resultado una Promesa de la interface IUser. Se encripta la clave del usuario y luego se manda a almacenar en la BBDD para finalmente retornar el usuario creado_
```javascript
async store(userDTO: UserDTO): Promise<IUser>{
  const hash = await this.hashPassword(userDTO.password);
  const newUser = new this._model({...userDTO, password: hash});
  return await newUser.save();
}
```


### Creando endpoint para obtener la lista de usuarios

Vamos a crear el método **_index_** usando el decorador **_@Get_** de la siguiente manera

_Nota:_ Recordemos importar Get

```javascript
import { Body, Controller, Post, Get } from '@nestjs/common';
```
##### user.controller.ts
```javascript
@Get()
index(){
    return this._userService.getAll();
}
```

Ahora nos queda simplemente implementar el método _getAll()_ en nuestro servicio

_Es un método asíncrono que devuelve un Promesa con un arreglo de IUser_
#### user.service.ts
```javascript
async getAll(): Promise<IUser[]>{
    return await this._model.find();
}
```


### Creando endpoint para obtener un usuario por su ID

En primer lugar vamos a crear el metodo **_show_** en el controlador de la siguiente manera:

_Usamos el decorador @Get en este método y obtenemos el ID del usuario como un parámetro de la URL para devolver el usuario como resultado_

_Nota:_ Recordemos importar Param

```javascript
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
```
##### user.controller.ts
```javascript
@Get(':id')
show(@Param('id') id:string ){
    return this._userService.getUser(id);
}
```

Ahora vamos a implementar el método **_getUser()_** en el servicio **_user.service.ts_**

_Método asíncrono que devuelve una Promesa con la interface IUser_
##### user.service.ts
```javascript
async getUser(id: string): Promise<IUser>{
    return await this._model.findById(id);
}
```


### Creando endpoint para actualizar la informacion de un usuario

En primer lugar actualizamos el controlador agregando le metodo **_update_** con el decorador @Put para actualizar el usuario.
El método _update_ lo vamos a codificar de la siguiente manera:

_Nota:_ Recordemos importar Put

```javascript
import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
```
##### user.controller.ts
```javascript
@Put(':id')
update(@Param('id') id:string, @Body() userDTO: UserDTO){
    return this._userService.update(id, userDTO);
}
```

Ahora vamos a programar el método **_update_** en el archivo **_user.service.ts_**

##### user.service.ts
```javascript
async update(id: string, userDTO: UserDTO): Promise<IUser>{
    const hash = await this.hashPassword(userDTO.password);
    const user = {...userDTO, password: hash}
    return await this._model.findByIdAndUpdate(id, user, {new: true});
}
```


### Creando endpoint para eliminar un usuario

En primer lugar actualizamos el controlador agregando le metodo **_destroy_** con el decorador @Delete para eliminar el usuario.
El método _destroy_ lo vamos a codificar de la siguiente manera:

_Nota:_ Recordemos importar Delete

```javascript
import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
```
##### user.controller.ts
```javascript
@Delete(':id')
destroy(@Param('id') id:string){
    return this._userService.delete(id);
}
```

Ahora vamos a programar el método **_delete_** en el archivo **_user.service.ts_**

_NOTA: Debemos importar HttpStatus de **@nest/common**_

```javascript
import { HttpStatus, Injectable } from '@nestjs/common';
```

##### user.service.ts
```javascript
async delete(id: string): Promise<Object>{
    await this._model.findByIdAndDelete(id);
    return {
        status: HttpStatus.OK,
        message: 'User deleted'
    };
}
```


## Modulo de Pasajeros
### Configuración inicial (Estructura del módulo de pasajeros)

Ahora vamos a generar toda la esrtuctura de Pasajeros.

* En primer lugar vamos a crear el modulo usando el CLI de Nest

    ```bash
    $ nest g mo manage/passenger
    ```

* Ahora vamos a crear el controlador
    ```bash
    $ nest g co manage/passenger
    ```

* Y un servicio
    ```bash
    $ nest g s manage/passenger
    ```

En este momento, se debe haber importado tanto el controlador como el servicio dentro del modulo de pasajeros. Verifiquemos que el modulo de pasajeros "**_src/manage/passenger/passenger.module.ts_**" se encuentre estructurado de la siguiente manera:

##### passenger.module.ts

```javascript
import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService]
})
export class PassengerModule {}
```

Creamos el DTO para pasajeros, para esto vamos a crear el directorio **"dto"** dentro de **_"src/manage/passenger"_**.
Dentro de **"src/manage/passenger/dto"** vamor a crear el archivo **_"passenger.dto.ts"_** con el siguiente código:

##### passenger.dto.ts
```javascript
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class PassengerDTO{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}
```

Creamos la interface de pasajero **_"passenger.interface.ts"_** dentro de **"src/commons/interfaces/manage/"** con el siguiente código:

##### passenger.interface.ts
```javascript
export interface IPassenger extends Document{
    name: string;
    email: string;
}
```

### Creando esquema y modelo de passenger

Lo primero que vamos a hacer es crear el directorio **_"schema"_** dentro de **"src/manage/passenger"**.

Dentro de **"src/manage/passenger/schema"** vamos a crear el archivo **_"passenger.schema.ts"_**

El código del archivo **passenger.schema.ts** es el siguiente:

##### passenger.schema.ts
```javascript
import * as mongoose from 'mongoose';

export const PassengerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

PassengerSchema.index({email: 1}, {unique: true});
```

Vamos ahora a agregar dentro de **"src/commons/models/models.ts"** el siguiente código.

##### models.ts
```javascript
export const PASSENGER = {name: 'passengers'};
```

Luego, esta constante **_"PASSENGER"_**, junto con **_"passenger.schema.ts"_** la vamos a importar en el modulo **"src/manage/passenger/passenger.module.ts"** de la siguiente manera:

##### passenger.module.ts
```javascript
import { MongooseModule } from '@nestjs/mongoose';
import { PASSENGER } from 'src/commons/models/models';
import { PassengerSchema } from './schema/passenger.schema';

imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PASSENGER.name,
        useFactory: () => PassengerSchema
      }
    ])
  ],
```


### Creando endpoint para creacion de pasajero

En primer lugar vamos a cambiar la URI del controlador **"src/manage/passenger/passenger.controller.ts"** de pasajeros colocando lo siguiente:

##### passenger.controller.ts
```javascript
@Controller('api/v1/passenger')
```

Vamos a importar los elementos necesarios para poder crear el metodo para almacenar pasajeros.

##### passenger.controller.ts
```javascript
import { Controller, Body, Post } from '@nestjs/common';
import { PassengerDTO } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';
```

Ahora vamos a inyectar nuestro servicio en el constructor del controlador de la siguiente manera:

##### passenger.controller.ts
```javascript
constructor(private readonly _passengerService: PassengerService){}
```

Por ultimo, colocamos la programación del método **_store_** de nuestro controlador:

##### passenger.controller.ts
```javascript
@Post()
store(@Body() passengerDTO: PassengerDTO){
    return this._passengerService.store(passengerDTO);
}
```

Lo siguiente es programar el método **_store_** en el servicio **_"src/manage/passenger/passenger.service.ts"_**

Importamos las librerias y componentes necesarios:
##### passenger.service.ts
```javascript
import { Injectable } from '@nestjs/common';
import { IPassenger } from 'src/commons/interfaces/manage/passenger.interface';
import { PassengerDTO } from './dto/passenger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PASSENGER } from 'src/commons/models/models';
import { Model } from 'mongoose';
```

Inyectamos el modelo y la interface de passenger en el constructor
##### passenger.service.ts
```javascript
constructor(@InjectModel(PASSENGER.name) private readonly _model: Model<IPassenger>){}
```

Y programamos el metodo para insertar el pasajero en la BBDD
##### passenger.service.ts
_Es un método asíncrono que recibe el DTO de user y devuelve como resultado una Promesa de la interface IPassenger y luego se manda a almacenar en la BBDD para finalmente retornar el pasajero creado_
```javascript
async store(passengerDTO: PassengerDTO): Promise<IPassenger>{
  const newPassenger = new this._model({...passengerDTO});
  return await newPassenger.save();
}
```


### Creando endpoint para obtener la lista de pasajeros

Vamos a crear el método **_index_** usando el decorador **_@Get_** de la siguiente manera

_Nota:_ Recordemos importar Get

```javascript
import { Body, Controller, Post, Get } from '@nestjs/common';
```
##### passenger.controller.ts
```javascript
@Get()
index(){
    return this._passengerService.getAll();
}
```

Ahora nos queda simplemente implementar el método _getAll()_ en nuestro servicio

_Es un método asíncrono que devuelve un Promesa con un arreglo de IPassenger_
#### passenger.service.ts
```javascript
async getAll(): Promise<IPassenger[]>{
    return await this._model.find();
}
```


### Creando endpoint para obtener un pasajero por su ID

En primer lugar vamos a crear el metodo **_show_** en el controlador de la siguiente manera:

_Usamos el decorador @Get en este método y obtenemos el ID del pasajero como un parámetro de la URL para devolver el pasajero como resultado_

_Nota:_ Recordemos importar Param

```javascript
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
```
##### passenger.controller.ts
```javascript
@Get(':id')
show(@Param('id') id:string ){
    return this._passengerService.getPassenger(id);
}
```

Ahora vamos a implementar el método **_getPassenger()_** en el servicio **_passenger.service.ts_**

_Método asíncrono que devuelve una Promesa con la interface IPassenger_
##### passenger.service.ts
```javascript
async getPassenger(id: string): Promise<IPassenger>{
    return await this._model.findById(id);
}
```


### Creando endpoint para actualizar la informacion de un pasajero

En primer lugar actualizamos el controlador agregando le metodo **_update_** con el decorador @Put para actualizar el pasajero.
El método _update_ lo vamos a codificar de la siguiente manera:

_Nota:_ Recordemos importar Put

```javascript
import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
```
##### passenger.controller.ts
```javascript
@Put(':id')
update(@Param('id') id:string, @Body() passengerDTO: PassengerDTO){
    return this._passengerService.update(id, passengerDTO);
}
```

Ahora vamos a programar el método **_update_** en el archivo **_passenger.service.ts_**

##### passenger.service.ts
```javascript
async update(id: string, passengerDTO: PassengerDTO): Promise<IPassenger>{
    const passenger = {...passengerDTO}
    return await this._model.findByIdAndUpdate(id, passenger, {new: true});
}
```


### Creando endpoint para eliminar un pasajero

En primer lugar actualizamos el controlador agregando le metodo **_destroy_** con el decorador @Delete para eliminar el pasajero.
El método _destroy_ lo vamos a codificar de la siguiente manera:

_Nota:_ Recordemos importar Delete

```javascript
import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
```
##### passenger.controller.ts
```javascript
@Delete(':id')
destroy(@Param('id') id:string){
    return this._passengerService.delete(id);
}
```

Ahora vamos a programar el método **_delete_** en el archivo **_passenger.service.ts_**

_NOTA: Debemos importar HttpStatus de **@nest/common**_

```javascript
import { HttpStatus, Injectable } from '@nestjs/common';
```

##### passenger.service.ts
```javascript
async delete(id: string): Promise<Object>{
    await this._model.findByIdAndDelete(id);
    return {
        status: HttpStatus.OK,
        message: 'Passenger deleted'
    };
}
```


## Modulo de Vuelos
### Configuración inicial (Estructura del módulo de vuelos)

Ahora vamos a generar toda la esrtuctura de Vuelos.

* En primer lugar vamos a crear el modulo usando el CLI de Nest

    ```bash
    $ nest g mo manage/flight
    ```

* Ahora vamos a crear el controlador
    ```bash
    $ nest g co manage/flight
    ```

* Y un servicio
    ```bash
    $ nest g s manage/flight
    ```

En este momento, se debe haber importado tanto el controlador como el servicio dentro del modulo de vuelos. Verifiquemos que el modulo de vuelos "**_src/manage/flight/flight.module.ts_**" se encuentre estructurado de la siguiente manera:

##### flight.module.ts
```javascript
import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';

@Module({
  controllers: [FlightController],
  providers: [FlightService]
})
export class FlightModule {}
```

Creamos el DTO para vuelos, para esto vamos a crear el directorio **"dto"** dentro de **_"src/manage/flight"_**.
Dentro de **"src/manage/flight/dto"** vamor a crear el archivo **_"flight.dto.ts"_** con el siguiente código:

##### flight.dto.ts
```javascript
import { IsEmail, IsNotEmpty, IsString, IsStringDate } from "class-validator";

export class PassengerDTO{
    @IsNotEmpty()
    @IsString()
    readonly pilot: string;

    @IsNotEmpty()
    @IsString()
    readonly airplane: string;

    @IsNotEmpty()
    @IsString()
    readonly destinationCity: string;

    @IsNotEmpty()
    @IsStringDate()
    readonly flightDate: Date;
}
```

Creamos la interface de vuelo **_"flight.interface.ts"_** dentro de **"src/commons/interfaces/manage/"** con el siguiente código:

##### flight.interface.ts
```javascript
import { IPassenger } from "./passenger.interface";

export interface IFlight extends Document{
    pilot: string;
    airplane: string;
    destinationCity: string;
    flightDate: Date;
    passengers: IPassenger[];
}
```

### Creando esquema y modelo de vuelos

Lo primero que vamos a hacer es crear el directorio **_"schema"_** dentro de **"src/manage/flight"**.

Dentro de **"src/manage/flight/schema"** vamos a crear el archivo **_"flight.schema.ts"_**

El código del archivo **flight.schema.ts** es el siguiente:

##### flight.schema.ts
```javascript
import * as mongoose from 'mongoose';

export const FlightSchema = new mongoose.Schema({
    pilot:{
        type: String,
        required: true
    },
    airplane:{
        type: String,
        required: true
    },
    destinationCity:{
        type: String,
        required: true
    },
    flightDate:{
        type: Date,
        required: true
    },
    passengers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'passengers' }]
}, {
    timestamps: true
});
```

Vamos ahora a agregar dentro de **"src/commons/models/models.ts"** el siguiente código.

##### models.ts
```javascript
export const FLIGHT = {name: 'flights'};
```

Luego, esta constante **_"FLIGHT"_**, junto con **_"flight.schema.ts"_** la vamos a importar en el modulo **"src/manage/flight/flight.module.ts"** de la siguiente manera:

##### flight.module.ts
```javascript
import { MongooseModule } from '@nestjs/mongoose';
import { FLIGHT } from 'src/commons/models/models';
import { FlightSchema } from './schema/flight.schema';
import { PassengerModule } from '../passenger/passenger.module';

imports: [
    MongooseModule.forFeatureAsync([
      {
        name: FLIGHT.name,
        useFactory: () => FlightSchema.plugin(require('mongoose-autopopulate'))
      }
    ]), PassengerModule
  ],
```

### Creando endpoint para creacion de vuelo

En primer lugar vamos a cambiar la URI del controlador **"src/manage/flight/flight.controller.ts"** de vuelos colocando lo siguiente:

##### flight.controller.ts
```javascript
@Controller('api/v1/flight')
```

Vamos a importar los elementos necesarios para poder crear el metodo para almacenar vuelos.

##### flight.controller.ts
```javascript
import { Controller, Body, Post } from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';
```

Ahora vamos a inyectar nuestro servicio en el constructor del controlador de la siguiente manera:

##### flight.controller.ts
```javascript
constructor(private readonly _flightService: FlightService){}
```

Por ultimo, colocamos la programación del método **_store_** de nuestro controlador:

##### flight.controller.ts
```javascript
@Post()
store(@Body() flightDTO: FlightDTO){
    return this._flightService.store(flightDTO);
}
```

Lo siguiente es programar el método **_store_** en el servicio **_"src/manage/flight/flight.service.ts"_**

Importamos las librerias y componentes necesarios:
##### flight.service.ts
```javascript
import { Injectable } from '@nestjs/common';
import { IFlight } from 'src/commons/interfaces/manage/flight.interface';
import { FlightDTO } from './dto/flight.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FLIGHT } from 'src/commons/models/models';
import { Model } from 'mongoose';
```

Inyectamos el modelo y la interface de vuelo en el constructor
##### flight.service.ts
```javascript
constructor(@InjectModel(FLIGHT.name) private readonly _model: Model<IFlight>){}
```

Y programamos el metodo para insertar el vuelo en la BBDD
##### flight.service.ts
_Es un método asíncrono que recibe el DTO de flight y devuelve como resultado una Promesa de la interface IFlight y luego se manda a almacenar en la BBDD para finalmente retornar el vuelo creado_

```javascript
async store(flightDTO: FlightDTO): Promise<IFlight>{
  return await new this._model(flightDTO).save();
}
```


### Creando endpoint para obtener la lista de vuelos

Vamos a crear el método **_index_** usando el decorador **_@Get_** de la siguiente manera

_Nota:_ Recordemos importar Get

```javascript
import { Body, Controller, Post, Get } from '@nestjs/common';
```
##### flight.controller.ts
```javascript
@Get()
index(){
    return this._flightService.getAll();
}
```

Ahora nos queda simplemente implementar el método _getAll()_ en nuestro servicio

_Es un método asíncrono que devuelve un Promesa con un arreglo de IFlight_
#### flight.service.ts
```javascript
async getAll(): Promise<IFlight[]>{
    return await this._model.find();
}
```


### Creando endpoint para obtener un vuelo por su ID

En primer lugar vamos a crear el metodo **_show_** en el controlador de la siguiente manera:

_Usamos el decorador @Get en este método y obtenemos el ID del vuelo como un parámetro de la URL para devolver el vuelo como resultado_

_Nota:_ Recordemos importar Param

```javascript
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
```
##### flight.controller.ts
```javascript
@Get(':id')
show(@Param('id') id:string ){
    return this._flightService.getFlight(id);
}
```

Ahora vamos a implementar el método **_getFlight()_** en el servicio **_flight.service.ts_**

_Método asíncrono que devuelve una Promesa con la interface IFlight_
##### flight.service.ts
```javascript
async getFlight(id: string): Promise<IFlight>{
    return await this._model.findById(id);
}
```


### Creando endpoint para actualizar la informacion de un vuelo

En primer lugar actualizamos el controlador agregando le metodo **_update_** con el decorador @Put para actualizar el vuelo.
El método _update_ lo vamos a codificar de la siguiente manera:

_Nota:_ Recordemos importar Put

```javascript
import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
```
##### flight.controller.ts
```javascript
@Put(':id')
update(@Param('id') id:string, @Body() flightDTO: FlightDTO){
    return this._flightService.update(id, flightDTO);
}
```

Ahora vamos a programar el método **_update_** en el archivo **_flight.service.ts_**

##### flight.service.ts
```javascript
async update(id: string, flightDTO: FlightDTO): Promise<IFlight>{
    return await this._model.findByIdAndUpdate(id, flightDTO, {new: true});
}
```


### Creando endpoint para eliminar un vuelo

En primer lugar actualizamos el controlador agregando le metodo **_destroy_** con el decorador @Delete para eliminar el vuelo.
El método _destroy_ lo vamos a codificar de la siguiente manera:

_Nota:_ Recordemos importar Delete

```javascript
import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
```
##### flight.controller.ts
```javascript
@Delete(':id')
destroy(@Param('id') id:string){
    return this._flightService.delete(id);
}
```

Ahora vamos a programar el método **_delete_** en el archivo **_flight.service.ts_**

_NOTA: Debemos importar HttpStatus de **@nest/common**_

```javascript
import { HttpStatus, Injectable } from '@nestjs/common';
```

##### flight.service.ts
```javascript
async delete(id: string): Promise<Object>{
    await this._model.findByIdAndDelete(id);
    return {
        status: HttpStatus.OK,
        message: 'Flight deleted'
    };
}
```


### Agregar pasajeros al vuelo

Vamos a agregar en el controlador **_"src/manage/flight/flight.controller.ts"_** el siguiente codigo:

##### flight.controller.ts
```javascript
// Importamos todo lo necesario para realizar estas acciones
import { Controller, Body, Post, Get, Param, Put, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { PassengerService } from '../passenger/passenger.service';

// Inyectamos el servicio de passengers al constructor de esta manera

constructor(
    private readonly _flightService: FlightService,
    private readonly _passengerService: PassengerService
){}

@Post('flight/:flightId/passenger/:passengerId')
async addPassenger(@Param('flightId') flightId: string, @Param('passengerId') passengerId: string)
{
    const passenger = await this._passengerService.getPassenger(passengerId);
    if( ! passenger){
        throw new HttpException('Passenger not found', HttpStatus.NOT_FOUND);
    }
    return this._flightService.addPassenger(flightId, passengerId);
}
```

Para poder utilizar el servicio de passenger en el controlador de vuelos, debemos exportar el servicio de passenger.

Para eso, vamos a exportar el servicio de passenger en el archivo **_"src/manage/passenger/passenger.module.ts"_**

* Bajo el arreglo _"providers"_ agregamos lo siguiente
##### passenger.module.ts
```javascript
exports: [PassengerService]
```

Ahora vamos a agregar el metodo **_addPassenger_** al servicio de vuelos **_"src/manage/flight/flight.service.ts"_**

##### flight.service.ts
```javascript
async addPassenger(flightId: string, passengerId: string): Promise<IFlight>
{
    return await this._model.findByIdAndUpdate(
            flightId, 
            { 
                $addToSet: { passengers:passengerId } 
            }, 
            { new: true }
    ).populate('passengers');
}
```


### Actualizacion de Metodos de vuelos para obtener pasajeros

Vamos a actualizar la logica para que cuando se consulte la lista de vuelos y un vuelo por ID, el sistema retorne no solo el ID de
cada pasajero, sino todo el objeto de pasajero.

Para eso, en el servicio de vuelos **_"src/manage/flight/flight.service.ts"_** hacemos los siguientes cambios:

##### flight.service.ts
```javascript
// Método que lista los vuelos
async getAll(): Promise<IFlight[]>
{
    return await this._model.find().populate('passengers');
}

// Metodo que trae un vuelo por su ID
async getFlight(id: string): Promise<IFlight>
{
    return await this._model.findById(id).populate('passengers');
}

// Metodo que actualiza un vuelo
async update(id: string, flightDTO: FlightDTO): Promise<IFlight>
{
    return await this._model.findByIdAndUpdate(id, flightDTO, {new: true}).populate('passengers');
}
```

### Consumiendo APIs

Primero vamos a instalar las siguientes dependencias:

```bash
$ npm i axios moment
```


