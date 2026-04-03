--
-- PostgreSQL database dump
--

\restrict BfPhekzRBQXQaW0u8odth55tTE2nXPqXWASb0ti0xTCsj5y3RIQrBDxzFzOm07t

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-03-06 13:20:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 75519)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 75520)
-- Name: historical; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA historical;


ALTER SCHEMA historical OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 75522)
-- Name: modulos; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.modulos (
    id_modulo integer NOT NULL,
    nombre_modulo character varying(300) NOT NULL
);


ALTER TABLE auth.modulos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 75521)
-- Name: modulos_id_modulo_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.modulos_id_modulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.modulos_id_modulo_seq OWNER TO postgres;

--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 219
-- Name: modulos_id_modulo_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.modulos_id_modulo_seq OWNED BY auth.modulos.id_modulo;


--
-- TOC entry 222 (class 1259 OID 75529)
-- Name: operaciones_modulos; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.operaciones_modulos (
    id_operacion integer NOT NULL,
    nombre_operacion character varying(300) NOT NULL,
    id_modulo integer NOT NULL
);


ALTER TABLE auth.operaciones_modulos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 75528)
-- Name: operaciones_modulos_id_operacion_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.operaciones_modulos_id_operacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.operaciones_modulos_id_operacion_seq OWNER TO postgres;

--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 221
-- Name: operaciones_modulos_id_operacion_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.operaciones_modulos_id_operacion_seq OWNED BY auth.operaciones_modulos.id_operacion;


--
-- TOC entry 224 (class 1259 OID 75541)
-- Name: roles; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.roles (
    id_rol integer NOT NULL,
    nombre_rol character varying(300) NOT NULL,
    activo boolean NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario_creacion integer,
    id_usuario_modificacion integer
);


ALTER TABLE auth.roles OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 75540)
-- Name: roles_id_rol_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.roles_id_rol_seq OWNER TO postgres;

--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.roles_id_rol_seq OWNED BY auth.roles.id_rol;


--
-- TOC entry 228 (class 1259 OID 75571)
-- Name: roles_operaciones; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.roles_operaciones (
    id_rol_operacion integer NOT NULL,
    id_rol integer NOT NULL,
    id_operacion integer NOT NULL,
    activo boolean NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_eliminacion timestamp with time zone,
    id_usuario_creacion integer,
    id_usuario_eliminacion integer
);


ALTER TABLE auth.roles_operaciones OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 75570)
-- Name: roles_operaciones_id_rol_operacion_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.roles_operaciones_id_rol_operacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.roles_operaciones_id_rol_operacion_seq OWNER TO postgres;

--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 227
-- Name: roles_operaciones_id_rol_operacion_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.roles_operaciones_id_rol_operacion_seq OWNED BY auth.roles_operaciones.id_rol_operacion;


--
-- TOC entry 230 (class 1259 OID 75598)
-- Name: roles_usuarios; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.roles_usuarios (
    id_rol_usuario integer NOT NULL,
    id_rol integer NOT NULL,
    id_usuario_sistema integer NOT NULL,
    activo boolean NOT NULL,
    fecha_asignacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_eliminacion timestamp with time zone,
    id_usuario_creacion integer,
    id_usuario_eliminacion integer
);


ALTER TABLE auth.roles_usuarios OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 75597)
-- Name: roles_usuarios_id_rol_usuario_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.roles_usuarios_id_rol_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.roles_usuarios_id_rol_usuario_seq OWNER TO postgres;

--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 229
-- Name: roles_usuarios_id_rol_usuario_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.roles_usuarios_id_rol_usuario_seq OWNED BY auth.roles_usuarios.id_rol_usuario;


--
-- TOC entry 226 (class 1259 OID 75550)
-- Name: usuarios_sistema; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.usuarios_sistema (
    id_usuario_sistema integer NOT NULL,
    nombre_usuario character varying(300) NOT NULL,
    password character varying(300) NOT NULL,
    activo boolean NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario_creacion integer,
    id_usuario_modificacion integer
);


ALTER TABLE auth.usuarios_sistema OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 75549)
-- Name: usuarios_sistema_id_usuario_sistema_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.usuarios_sistema_id_usuario_sistema_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.usuarios_sistema_id_usuario_sistema_seq OWNER TO postgres;

--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 225
-- Name: usuarios_sistema_id_usuario_sistema_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.usuarios_sistema_id_usuario_sistema_seq OWNED BY auth.usuarios_sistema.id_usuario_sistema;


--
-- TOC entry 232 (class 1259 OID 75635)
-- Name: login_logs; Type: TABLE; Schema: historical; Owner: postgres
--

CREATE TABLE historical.login_logs (
    id_login_log bigint NOT NULL,
    id_usuario_sistema integer NOT NULL,
    fecha_acceso timestamp with time zone NOT NULL,
    ip inet NOT NULL
);


ALTER TABLE historical.login_logs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 75634)
-- Name: login_logs_id_login_log_seq; Type: SEQUENCE; Schema: historical; Owner: postgres
--

CREATE SEQUENCE historical.login_logs_id_login_log_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE historical.login_logs_id_login_log_seq OWNER TO postgres;

--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 231
-- Name: login_logs_id_login_log_seq; Type: SEQUENCE OWNED BY; Schema: historical; Owner: postgres
--

ALTER SEQUENCE historical.login_logs_id_login_log_seq OWNED BY historical.login_logs.id_login_log;


--
-- TOC entry 4673 (class 2604 OID 75525)
-- Name: modulos id_modulo; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.modulos ALTER COLUMN id_modulo SET DEFAULT nextval('auth.modulos_id_modulo_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 75532)
-- Name: operaciones_modulos id_operacion; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.operaciones_modulos ALTER COLUMN id_operacion SET DEFAULT nextval('auth.operaciones_modulos_id_operacion_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 75544)
-- Name: roles id_rol; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles ALTER COLUMN id_rol SET DEFAULT nextval('auth.roles_id_rol_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 75574)
-- Name: roles_operaciones id_rol_operacion; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_operaciones ALTER COLUMN id_rol_operacion SET DEFAULT nextval('auth.roles_operaciones_id_rol_operacion_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 75601)
-- Name: roles_usuarios id_rol_usuario; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_usuarios ALTER COLUMN id_rol_usuario SET DEFAULT nextval('auth.roles_usuarios_id_rol_usuario_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 75553)
-- Name: usuarios_sistema id_usuario_sistema; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuarios_sistema ALTER COLUMN id_usuario_sistema SET DEFAULT nextval('auth.usuarios_sistema_id_usuario_sistema_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 75638)
-- Name: login_logs id_login_log; Type: DEFAULT; Schema: historical; Owner: postgres
--

ALTER TABLE ONLY historical.login_logs ALTER COLUMN id_login_log SET DEFAULT nextval('historical.login_logs_id_login_log_seq'::regclass);


--
-- TOC entry 4860 (class 0 OID 75522)
-- Dependencies: 220
-- Data for Name: modulos; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.modulos (id_modulo, nombre_modulo) FROM stdin;
1	Usuarios
2	Roles
\.


--
-- TOC entry 4862 (class 0 OID 75529)
-- Dependencies: 222
-- Data for Name: operaciones_modulos; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.operaciones_modulos (id_operacion, nombre_operacion, id_modulo) FROM stdin;
1	Agregar usuario	1
2	Editar usuario	1
3	Eliminar usuario	1
4	Restaurar usuario	1
5	Agregar rol	2
6	Editar rol	2
7	Eliminar rol	2
\.


--
-- TOC entry 4864 (class 0 OID 75541)
-- Dependencies: 224
-- Data for Name: roles; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.roles (id_rol, nombre_rol, activo, fecha_creacion, fecha_modificacion, id_usuario_creacion, id_usuario_modificacion) FROM stdin;
1	Administrador de usuarios	t	2025-01-31 11:09:14.250134-06	2025-01-31 11:21:39.437221-06	1	1
2	Administrador de roles	t	2025-01-31 11:20:54.094913-06	2025-01-31 11:22:14.083413-06	1	1
\.


--
-- TOC entry 4868 (class 0 OID 75571)
-- Dependencies: 228
-- Data for Name: roles_operaciones; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.roles_operaciones (id_rol_operacion, id_rol, id_operacion, activo, fecha_creacion, fecha_eliminacion, id_usuario_creacion, id_usuario_eliminacion) FROM stdin;
1	1	1	t	2025-01-31 11:21:39.448041-06	\N	1	\N
2	1	2	t	2025-01-31 11:21:39.448041-06	\N	1	\N
3	1	3	t	2025-01-31 11:21:39.448041-06	\N	1	\N
4	1	4	t	2025-01-31 11:21:39.448041-06	\N	1	\N
5	2	5	t	2025-01-31 11:22:14.091847-06	\N	1	\N
6	2	6	t	2025-01-31 11:22:14.091847-06	\N	1	\N
7	2	7	t	2025-01-31 11:22:14.091847-06	\N	1	\N
\.


--
-- TOC entry 4870 (class 0 OID 75598)
-- Dependencies: 230
-- Data for Name: roles_usuarios; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.roles_usuarios (id_rol_usuario, id_rol, id_usuario_sistema, activo, fecha_asignacion, fecha_eliminacion, id_usuario_creacion, id_usuario_eliminacion) FROM stdin;
1	1	1	t	2025-01-31 11:22:54.147615-06	\N	1	\N
2	2	1	t	2025-01-31 11:22:54.147615-06	\N	1	\N
\.


--
-- TOC entry 4866 (class 0 OID 75550)
-- Dependencies: 226
-- Data for Name: usuarios_sistema; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.usuarios_sistema (id_usuario_sistema, nombre_usuario, password, activo, fecha_creacion, fecha_modificacion, id_usuario_creacion, id_usuario_modificacion) FROM stdin;
1	administrador	$2a$10$aEKl/vQY9Gv9.h.EZd930.BLaSuDlszpFfaCJZlY.ccLxRVdE3joK	t	2025-01-31 11:22:54.140569-06	2025-01-31 11:22:54.140569-06	1	1
\.


--
-- TOC entry 4872 (class 0 OID 75635)
-- Dependencies: 232
-- Data for Name: login_logs; Type: TABLE DATA; Schema: historical; Owner: postgres
--

COPY historical.login_logs (id_login_log, id_usuario_sistema, fecha_acceso, ip) FROM stdin;
\.


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 219
-- Name: modulos_id_modulo_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.modulos_id_modulo_seq', 1, false);


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 221
-- Name: operaciones_modulos_id_operacion_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.operaciones_modulos_id_operacion_seq', 1, false);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.roles_id_rol_seq', 1, false);


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 227
-- Name: roles_operaciones_id_rol_operacion_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.roles_operaciones_id_rol_operacion_seq', 1, false);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 229
-- Name: roles_usuarios_id_rol_usuario_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.roles_usuarios_id_rol_usuario_seq', 1, false);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 225
-- Name: usuarios_sistema_id_usuario_sistema_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.usuarios_sistema_id_usuario_sistema_seq', 1, false);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 231
-- Name: login_logs_id_login_log_seq; Type: SEQUENCE SET; Schema: historical; Owner: postgres
--

SELECT pg_catalog.setval('historical.login_logs_id_login_log_seq', 1, false);


--
-- TOC entry 4687 (class 2606 OID 75527)
-- Name: modulos modulos_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.modulos
    ADD CONSTRAINT modulos_pkey PRIMARY KEY (id_modulo);


--
-- TOC entry 4689 (class 2606 OID 75534)
-- Name: operaciones_modulos operaciones_modulos_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.operaciones_modulos
    ADD CONSTRAINT operaciones_modulos_pkey PRIMARY KEY (id_operacion);


--
-- TOC entry 4695 (class 2606 OID 75576)
-- Name: roles_operaciones roles_operaciones_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_operaciones
    ADD CONSTRAINT roles_operaciones_pkey PRIMARY KEY (id_rol_operacion);


--
-- TOC entry 4691 (class 2606 OID 75548)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4697 (class 2606 OID 75603)
-- Name: roles_usuarios roles_usuarios_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_usuarios
    ADD CONSTRAINT roles_usuarios_pkey PRIMARY KEY (id_rol_usuario);


--
-- TOC entry 4693 (class 2606 OID 75559)
-- Name: usuarios_sistema usuarios_sistema_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_pkey PRIMARY KEY (id_usuario_sistema);


--
-- TOC entry 4699 (class 2606 OID 75642)
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: historical; Owner: postgres
--

ALTER TABLE ONLY historical.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id_login_log);


--
-- TOC entry 4705 (class 2606 OID 75670)
-- Name: roles_operaciones FK_038c73552680352c415cd4637db; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_operaciones
    ADD CONSTRAINT "FK_038c73552680352c415cd4637db" FOREIGN KEY (id_usuario_eliminacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4706 (class 2606 OID 75655)
-- Name: roles_operaciones FK_0e7dedcc9f0ba9f41fb8c4a28de; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_operaciones
    ADD CONSTRAINT "FK_0e7dedcc9f0ba9f41fb8c4a28de" FOREIGN KEY (id_rol) REFERENCES auth.roles(id_rol);


--
-- TOC entry 4709 (class 2606 OID 75700)
-- Name: roles_usuarios FK_4472e29d31ec4ebbacd0ea36fa2; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_usuarios
    ADD CONSTRAINT "FK_4472e29d31ec4ebbacd0ea36fa2" FOREIGN KEY (id_usuario_eliminacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4703 (class 2606 OID 75710)
-- Name: usuarios_sistema FK_5020db7d37150a0149dc61f225e; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuarios_sistema
    ADD CONSTRAINT "FK_5020db7d37150a0149dc61f225e" FOREIGN KEY (id_usuario_modificacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4710 (class 2606 OID 75690)
-- Name: roles_usuarios FK_5970b625603eb90915b6a01b495; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_usuarios
    ADD CONSTRAINT "FK_5970b625603eb90915b6a01b495" FOREIGN KEY (id_usuario_sistema) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4707 (class 2606 OID 75665)
-- Name: roles_operaciones FK_6a6f2f39aef9f1d3bdb85164a10; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_operaciones
    ADD CONSTRAINT "FK_6a6f2f39aef9f1d3bdb85164a10" FOREIGN KEY (id_usuario_creacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4708 (class 2606 OID 75660)
-- Name: roles_operaciones FK_78f171af45040ea5247c9e6c2ff; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_operaciones
    ADD CONSTRAINT "FK_78f171af45040ea5247c9e6c2ff" FOREIGN KEY (id_operacion) REFERENCES auth.operaciones_modulos(id_operacion);


--
-- TOC entry 4711 (class 2606 OID 75695)
-- Name: roles_usuarios FK_941f5974dd69b5c95428af5cc6c; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_usuarios
    ADD CONSTRAINT "FK_941f5974dd69b5c95428af5cc6c" FOREIGN KEY (id_usuario_creacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4701 (class 2606 OID 75680)
-- Name: roles FK_9c6ca043d547b1e6dafae8b7409; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles
    ADD CONSTRAINT "FK_9c6ca043d547b1e6dafae8b7409" FOREIGN KEY (id_usuario_modificacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4702 (class 2606 OID 75675)
-- Name: roles FK_9ead840e5f4ce86377b30de1cf5; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles
    ADD CONSTRAINT "FK_9ead840e5f4ce86377b30de1cf5" FOREIGN KEY (id_usuario_creacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4712 (class 2606 OID 75685)
-- Name: roles_usuarios FK_a6e966904c72a1e9aa61d26c87f; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles_usuarios
    ADD CONSTRAINT "FK_a6e966904c72a1e9aa61d26c87f" FOREIGN KEY (id_rol) REFERENCES auth.roles(id_rol);


--
-- TOC entry 4700 (class 2606 OID 75650)
-- Name: operaciones_modulos FK_b74d7e48ded42baea2a17c761c8; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.operaciones_modulos
    ADD CONSTRAINT "FK_b74d7e48ded42baea2a17c761c8" FOREIGN KEY (id_modulo) REFERENCES auth.modulos(id_modulo);


--
-- TOC entry 4704 (class 2606 OID 75705)
-- Name: usuarios_sistema FK_e18da7278be5a41e16ae84f82d3; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuarios_sistema
    ADD CONSTRAINT "FK_e18da7278be5a41e16ae84f82d3" FOREIGN KEY (id_usuario_creacion) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


--
-- TOC entry 4713 (class 2606 OID 75643)
-- Name: login_logs fk_login_logs_usuario; Type: FK CONSTRAINT; Schema: historical; Owner: postgres
--

ALTER TABLE ONLY historical.login_logs
    ADD CONSTRAINT fk_login_logs_usuario FOREIGN KEY (id_usuario_sistema) REFERENCES auth.usuarios_sistema(id_usuario_sistema);


-- Completed on 2026-03-06 13:20:24

--
-- PostgreSQL database dump complete
--

\unrestrict BfPhekzRBQXQaW0u8odth55tTE2nXPqXWASb0ti0xTCsj5y3RIQrBDxzFzOm07t

