create table usuarios (
id serial primary key,
nome text not null,
email char(50) not null unique,
senha text not null
);

