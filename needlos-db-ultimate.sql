DROP DATABASE IF EXISTS NeedlOS;
CREATE DATABASE NeedlOS;
USE NeedlOS;

CREATE TABLE Cliente(
	id_cliente INT PRIMARY KEY NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido VARCHAR(20) NOT NULL,
	telefono VARCHAR(15) NOT NULL,
	fecha_registro DATE NOT NULL
);

CREATE TABLE Pedido(
	id_pedido INT PRIMARY KEY NOT NULL,
	fecha DATE NOT NULL,
	foto_pedido BIT NOT NULL,
	total_abonos DECIMAL(10,2) NOT NULL,
	saldo DECIMAL(10,2) NOT NULL,
    id_cliente_fk INT,
    CONSTRAINT FK_cliente_pedido FOREIGN KEY (id_cliente_fk)
    REFERENCES Cliente(id_cliente)
);

CREATE TABLE Detalle_pedido(
	id_detalle_pedido INT PRIMARY KEY NOT NULL,
	cantidad INT NOT NULL,
	precio_unitario DECIMAL(10,2) NOT NULL,
	descripcion VARCHAR(50) NOT NULL,
    id_pedido_fk INT,
    CONSTRAINT FK_pedido_detPedido FOREIGN KEY (id_pedido_fk)
    REFERENCES Pedido(id_pedido)
); 

CREATE TABLE Estado(
	id_estado INT PRIMARY KEY NOT NULL,
    estado VARCHAR(15) NOT NULL
);

CREATE TABLE Estado_pedido(
	id_estado INT NOT NULL,
    id_detalle_pedido INT NOT NULL,
	fecha DATETIME,
	CONSTRAINT PK_Estado_pedido PRIMARY KEY(id_estado, id_detalle_pedido),
    CONSTRAINT FK_estado_estPedido FOREIGN KEY (id_estado)
    REFERENCES Estado(id_estado),
    CONSTRAINT FK_detPedido_estPedido FOREIGN KEY (id_detalle_pedido)
    REFERENCES Detalle_pedido(id_detalle_pedido)
);

CREATE TABLE Metodo (
	id_metodo INT PRIMARY KEY NOT NULL,
    metodo VARCHAR(15) NOT NULL
);

CREATE TABLE Detalle_abono(
	id_detalle_abono INT PRIMARY KEY NOT NULL,  -- Clave primaria única
	monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    id_detalle_pedido_fk INT,  -- Clave foránea hacia Detalle_pedido
    id_metodo_fk INT,  -- Clave foránea hacia Metodo
    CONSTRAINT FK_detPedido_detAbono FOREIGN KEY (id_detalle_pedido_fk)
    REFERENCES Detalle_pedido(id_detalle_pedido),
    CONSTRAINT FK_metodo_detAbono FOREIGN KEY (id_metodo_fk)
    REFERENCES Metodo(id_metodo)
);

CREATE TABLE Ingreso(
	id_ingreso INT PRIMARY KEY NOT NULL,
	fecha_ingreso DATE NOT NULL
);

CREATE TABLE Tipo_documento(
	id_tipo_documento INT PRIMARY KEY NOT NULL,
	descripcion_tipo VARCHAR(3) NOT NULL
);

CREATE TABLE Empleado(
	id_empleado INT PRIMARY KEY NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(16) NOT NULL,
    n_documento INT NOT NULL,
    id_tipo_documento_fk INT,
    CONSTRAINT FK_tipoD_empleado FOREIGN KEY (id_tipo_documento_fk)
    REFERENCES Tipo_documento(id_tipo_documento)
);

CREATE TABLE Prenda(
	id_prenda INT PRIMARY KEY NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    id_detalles_pedido_fk INT,
    id_empleado_fk INT,
    CONSTRAINT FK_empleado_prenda FOREIGN KEY (id_empleado_fk)
    REFERENCES Empleado(id_empleado),
    CONSTRAINT FK_detPedido_prenda FOREIGN KEY (id_detalles_pedido_fk)
    REFERENCES Detalle_pedido(id_detalle_pedido)
);

CREATE TABLE Material(
	id_material INT PRIMARY KEY NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    descripcion VARCHAR(40),
    stock_actual INT NOT NULL DEFAULT 0
);

CREATE TABLE Material_usado(
	id_prenda INT NOT NULL,
    id_material INT NOT NULL,
    cantidad_usada INT NOT NULL,
    CONSTRAINT PK_Material_usado PRIMARY KEY (id_prenda, id_material),
    CONSTRAINT FK_prenda_matUsado FOREIGN KEY (id_prenda)
    REFERENCES Prenda(id_prenda) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_material_matUsado FOREIGN KEY (id_material)
    REFERENCES Material(id_material) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Material_ingresado(
	id_ingreso INT NOT NULL,
    id_material INT NOT NULL,
    precio DECIMAL(10,2),
    cantidad INT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    CONSTRAINT PK_Material_ingresado PRIMARY KEY (id_ingreso, id_material),
    CONSTRAINT FK_ingreso_materialI FOREIGN KEY (id_ingreso)
    REFERENCES Ingreso(id_ingreso),
    CONSTRAINT FK_material_materialI FOREIGN KEY (id_material)
    REFERENCES Material(id_material)
);

CREATE TABLE Pago(
	id_pago INT PRIMARY KEY NOT NULL,
	fecha DATETIME NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    id_empleado_fk INT,
    CONSTRAINT FK_empleado_pago FOREIGN KEY (id_empleado_fk)
    REFERENCES Empleado(id_empleado)
);
