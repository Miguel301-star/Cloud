CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS inventory (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 category TEXT NOT NULL,
 price NUMERIC(14,2) NOT NULL CHECK(price>=0),
 stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0),
 min_stock INTEGER NOT NULL DEFAULT 0 CHECK(min_stock>=0),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS fiados (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 neighbor TEXT NOT NULL,
 phone TEXT NOT NULL,
 total_debt NUMERIC(14,2) NOT NULL CHECK(total_debt>=0),
 paid NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK(paid>=0),
 detail TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS suppliers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 detail TEXT NOT NULL,
 total_amount NUMERIC(14,2) NOT NULL CHECK(total_amount>=0),
 paid NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK(paid>=0),
 day TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_fiados_neighbor ON fiados(neighbor);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);


-- Datos iniciales de demostración del prototipo original.
INSERT INTO inventory(id,name,category,price,stock,min_stock) VALUES
('10000000-0000-4000-8000-000000000001','Arroz Roa 1kg','Abarrotes',4200,24,6),
('10000000-0000-4000-8000-000000000002','Aceite Gourmet 900ml','Abarrotes',14500,8,3),
('10000000-0000-4000-8000-000000000003','Coca-Cola 1.5L','Bebidas',5500,15,5),
('10000000-0000-4000-8000-000000000004','Cerveza Águila Lata','Bebidas',3000,48,12),
('10000000-0000-4000-8000-000000000005','Leche Colanta 1L','Lácteos',4300,4,6),
('10000000-0000-4000-8000-000000000006','Papas Margarita Pollo','Snacks',2500,20,8)
ON CONFLICT(id) DO NOTHING;

INSERT INTO fiados(id,neighbor,phone,total_debt,paid,detail) VALUES
('20000000-0000-4000-8000-000000000001','Don Pedro (Taller)','311 456 7890',34500,10000,'2 Cervezas, 1 Papas'),
('20000000-0000-4000-8000-000000000002','Doña Martha (C.14)','300 987 6543',18200,0,'Leche Colanta, Pan')
ON CONFLICT(id) DO NOTHING;

INSERT INTO suppliers(id,name,detail,total_amount,paid,day) VALUES
('30000000-0000-4000-8000-000000000001','Bavaria','4 Cajas Cerveza Águila',180000,80000,'Jueves'),
('30000000-0000-4000-8000-000000000002','Coca-Cola','3 Cajas 1.5L',120000,0,'Martes')
ON CONFLICT(id) DO NOTHING;
