alter table public.productos add column if not exists categoria text;
alter table public.productos add column if not exists imagen text;

insert into public.productos (nombre, categoria, precio, descripcion)
select v.nombre, v.categoria, v.precio, v.descripcion
from (values
    ('Anillo de Oro Clásico', 'Anillos', 2500, 'Anillo de oro de 14k con acabado pulido y diseño atemporal.'),
    ('Anillo de Diamante', 'Anillos', 8500, 'Anillo de compromiso con diamante central de corte brillante.'),
    ('Collar de Plata', 'Collares', 1800, 'Collar de plata .925 con cadena fina y dije minimalista.'),
    ('Collar de Perlas', 'Collares', 4500, 'Collar de perlas cultivadas con broche de plata.'),
    ('Pulsera de Oro', 'Pulseras', 3200, 'Pulsera de oro tejida, ligera y elegante para uso diario.'),
    ('Pulsera Charm', 'Pulseras', 2600, 'Pulsera de plata con dijes intercambiables.'),
    ('Aretes de Diamante', 'Aretes', 4500, 'Aretes tipo broquel con diamantes en montura de oro blanco.'),
    ('Aretes Flor', 'Aretes', 1700, 'Aretes en forma de flor con circonias y baño de oro.')
) as v(nombre, categoria, precio, descripcion)
where not exists (select 1 from public.productos);

create table if not exists public.pedidos (
    id_pedido bigint generated always as identity primary key,
    id_cliente bigint not null references public.clientes(id),
    fecha_entrega date not null,
    estado_pedido text not null default 'Pendiente'
        check (estado_pedido in ('Pendiente', 'En proceso', 'Entregado', 'Cancelado')),
    motivo_cancelacion text,
    total numeric(12, 2) not null default 0,
    created_at timestamptz not null default now(),
    constraint motivo_cancelacion_obligatorio
        check (estado_pedido <> 'Cancelado' or coalesce(trim(motivo_cancelacion), '') <> '')
);

create table if not exists public.detalle_pedido (
    id bigint generated always as identity primary key,
    id_pedido bigint not null references public.pedidos(id_pedido) on delete cascade,
    id_producto bigint not null references public.productos(id),
    cantidad integer not null check (cantidad > 0),
    precio_unitario numeric(12, 2) not null
);

create or replace function public.crear_pedido(p_id_cliente bigint, p_fecha_entrega date, p_items jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
    v_id_pedido bigint;
    v_insertados integer;
begin
    if p_fecha_entrega is null or p_fecha_entrega < (now() at time zone 'America/Mexico_City')::date then
        raise exception 'La fecha compromiso no puede ser anterior al día de hoy.';
    end if;

    if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
        raise exception 'El pedido debe incluir al menos un producto.';
    end if;

    if not exists (select 1 from clientes where id = p_id_cliente) then
        raise exception 'El cliente no existe. Vuelve a identificarte.';
    end if;

    insert into pedidos (id_cliente, fecha_entrega)
    values (p_id_cliente, p_fecha_entrega)
    returning id_pedido into v_id_pedido;

    insert into detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
    select v_id_pedido, p.id, i.cantidad, p.precio
    from jsonb_to_recordset(p_items) as i(id_producto bigint, cantidad integer)
    join productos p on p.id = i.id_producto
    where i.cantidad between 1 and 99;

    get diagnostics v_insertados = row_count;
    if v_insertados <> jsonb_array_length(p_items) then
        raise exception 'Uno de los productos del carrito ya no está disponible o tiene una cantidad inválida.';
    end if;

    update pedidos
    set total = (select sum(cantidad * precio_unitario) from detalle_pedido where id_pedido = v_id_pedido)
    where id_pedido = v_id_pedido;

    return v_id_pedido;
end;
$$;

revoke all on function public.crear_pedido(bigint, date, jsonb) from public;
grant execute on function public.crear_pedido(bigint, date, jsonb) to anon, authenticated;

alter table public.pedidos enable row level security;
alter table public.detalle_pedido enable row level security;

drop policy if exists "Leer productos" on public.productos;
create policy "Leer productos" on public.productos for select to anon, authenticated using (true);

drop policy if exists "Leer pedidos" on public.pedidos;
create policy "Leer pedidos" on public.pedidos for select to anon, authenticated using (true);

drop policy if exists "Actualizar estado de pedidos" on public.pedidos;
create policy "Actualizar estado de pedidos" on public.pedidos for update to anon, authenticated using (estado_pedido in ('Pendiente', 'En proceso')) with check (true);

drop policy if exists "Leer detalle de pedidos" on public.detalle_pedido;
create policy "Leer detalle de pedidos" on public.detalle_pedido for select to anon, authenticated using (true);

revoke insert, update, delete on public.pedidos from anon, authenticated;
revoke insert, update, delete on public.detalle_pedido from anon, authenticated;
grant select on public.pedidos, public.detalle_pedido to anon, authenticated;
grant update (estado_pedido, motivo_cancelacion) on public.pedidos to anon, authenticated;

update public.productos
set nombre = convert_from(convert_to(nombre, 'LATIN1'), 'UTF8'),
    descripcion = convert_from(convert_to(descripcion, 'LATIN1'), 'UTF8')
where nombre like '%Ã%' or descripcion like '%Ã%';