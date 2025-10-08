CREATE TABLE categories (
id integer PRIMARY KEY  NOT NULL,
name VARCHAR(255), 
created_at timestamp without time zone,
description text
);

CREATE TABLE images ( id integer PRIMARY KEY NOT NULL, filename text, data bytea, 
mimetype text);

CREATE TABLE products ( id integer PRIMARY KEY NOT NULL, name VARCHAR(255),
long_description text,
category_id integer,
price numeric(10,2),
discounted_price numeric(10,2),
is_featured BOOLEAN,
created_at timestamp without time zone,
display_image_id integer,
short_description text,
in_stock BOOLEAN,
image_ids integer[],
features jsonb[]
);