--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5 (Homebrew)
-- Dumped by pg_dump version 15.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: nicolemerriman
--

CREATE TABLE public.expenses (
    expense_id integer NOT NULL,
    trip_id integer,
    date date NOT NULL,
    category character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    textsearchable_index_col tsvector,
    user_id integer NOT NULL,
    CONSTRAINT expenses_category_check CHECK (((category)::text = ANY ((ARRAY['food'::character varying, 'transportation'::character varying, 'entertainment'::character varying, 'accommodations'::character varying])::text[])))
);


ALTER TABLE public.expenses OWNER TO nicolemerriman;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE; Schema: public; Owner: nicolemerriman
--

CREATE SEQUENCE public.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.expenses_expense_id_seq OWNER TO nicolemerriman;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicolemerriman
--

ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;


--
-- Name: itinerary; Type: TABLE; Schema: public; Owner: nicolemerriman
--

CREATE TABLE public.itinerary (
    event_id integer NOT NULL,
    trip_id integer,
    event_name character varying(255) NOT NULL,
    location text,
    start_datetime timestamp without time zone NOT NULL,
    end_datetime timestamp without time zone NOT NULL,
    description text,
    reminder character varying(50),
    textsearchable_index_col tsvector,
    user_id integer,
    CONSTRAINT itinerary_reminder_check CHECK (((reminder)::text = ANY ((ARRAY['none'::character varying, '15 minutes before'::character varying, '30 minutes before'::character varying, '1 hour before'::character varying, '1 day before'::character varying])::text[])))
);


ALTER TABLE public.itinerary OWNER TO nicolemerriman;

--
-- Name: itinerary_event_id_seq; Type: SEQUENCE; Schema: public; Owner: nicolemerriman
--

CREATE SEQUENCE public.itinerary_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.itinerary_event_id_seq OWNER TO nicolemerriman;

--
-- Name: itinerary_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicolemerriman
--

ALTER SEQUENCE public.itinerary_event_id_seq OWNED BY public.itinerary.event_id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: nicolemerriman
--

CREATE TABLE public.media (
    media_id integer NOT NULL,
    trip_id integer,
    tags text,
    notes text,
    media_file bytea,
    textsearchable_index_col tsvector,
    file_key character varying(255),
    tripname character varying(255),
    user_id integer NOT NULL
);


ALTER TABLE public.media OWNER TO nicolemerriman;

--
-- Name: media_media_id_seq; Type: SEQUENCE; Schema: public; Owner: nicolemerriman
--

CREATE SEQUENCE public.media_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_media_id_seq OWNER TO nicolemerriman;

--
-- Name: media_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicolemerriman
--

ALTER SEQUENCE public.media_media_id_seq OWNED BY public.media.media_id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: nicolemerriman
--

CREATE TABLE public.trips (
    trip_id integer NOT NULL,
    destination character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    purpose text,
    notes text,
    textsearchable_index_col tsvector,
    file_key character varying(255),
    user_id integer NOT NULL
);


ALTER TABLE public.trips OWNER TO nicolemerriman;

--
-- Name: trips_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: nicolemerriman
--

CREATE SEQUENCE public.trips_trip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trips_trip_id_seq OWNER TO nicolemerriman;

--
-- Name: trips_trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicolemerriman
--

ALTER SEQUENCE public.trips_trip_id_seq OWNED BY public.trips.trip_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nicolemerriman
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO nicolemerriman;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nicolemerriman
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO nicolemerriman;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicolemerriman
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: expenses expense_id; Type: DEFAULT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);


--
-- Name: itinerary event_id; Type: DEFAULT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.itinerary ALTER COLUMN event_id SET DEFAULT nextval('public.itinerary_event_id_seq'::regclass);


--
-- Name: media media_id; Type: DEFAULT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.media ALTER COLUMN media_id SET DEFAULT nextval('public.media_media_id_seq'::regclass);


--
-- Name: trips trip_id; Type: DEFAULT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.trips ALTER COLUMN trip_id SET DEFAULT nextval('public.trips_trip_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: nicolemerriman
--

COPY public.expenses (expense_id, trip_id, date, category, amount, description, textsearchable_index_col, user_id) FROM stdin;
3	2	2023-11-15	entertainment	35.00	Movie	\N	5
4	2	2023-11-17	food	80.00	Restaurant bill	\N	5
\.


--
-- Data for Name: itinerary; Type: TABLE DATA; Schema: public; Owner: nicolemerriman
--

COPY public.itinerary (event_id, trip_id, event_name, location, start_datetime, end_datetime, description, reminder, textsearchable_index_col, user_id) FROM stdin;
1	1	Skiing at Aspen Mountain	Aspen Mountain, Colorado	2022-10-23 09:00:00	2022-10-23 16:00:00	Full day skiing and exploring the slopes.	1 hour before	\N	5
2	1	Visit the Maroon Bells	Maroon Bells, Colorado	2022-10-24 08:00:00	2022-10-24 12:00:00	Hiking trip to the Maroon Bells in the morning.	30 minutes before	\N	5
5	2	Meeting with Clients	Company Headquarters, Woodlands, Texas	2023-11-15 09:00:00	2023-11-15 12:00:00	Business meeting at the company headquarters.	1 day before	\N	5
6	2	Team Dinner	Local Restaurant, Woodlands, Texas	2023-11-16 19:00:00	2023-11-16 21:00:00	Dinner with the project team at a local restaurant.	1 hour before	\N	5
7	\N	Visit Times Square	Times Square, New York, NY	2023-12-10 10:00:00	2023-12-10 13:00:00	Exploring the vibrant lights and shops in Times Square.	1 hour before	\N	5
8	\N	Central Park and Museum	Central Park, New York, NY	2023-12-11 09:00:00	2023-12-11 15:00:00	Morning walk in Central Park followed by a visit to the Metropolitan Museum of Art.	1 hour before	\N	5
9	\N	Statue of Liberty and Ellis Island	Statue of Liberty National Monument, New York, NY	2023-12-12 10:00:00	2023-12-12 14:00:00	Ferry ride and tours of the Statue of Liberty and Ellis Island.	1 hour before	\N	5
10	\N	Broadway Show	Broadway, New York, NY	2023-12-13 19:00:00	2023-12-13 22:00:00	Evening at a Broadway show.	1 day before	\N	5
11	\N	Shopping in SoHo	SoHo, New York, NY	2023-12-14 10:00:00	2023-12-14 13:00:00	Last-minute shopping in SoHo before departure.	30 minutes before	\N	5
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: nicolemerriman
--

COPY public.media (media_id, trip_id, tags, notes, media_file, textsearchable_index_col, file_key, tripname, user_id) FROM stdin;
4	2	Woodlands, Business, Texas	The Woodlands, Texas business trip.	\N	\N	woodlands,texas.jpg	Woodlands Trip	5
5	1	Aspen, Winter, Mountains	Beautiful view of Aspen mountains.	\N	\N	aspen.jpg	Aspen Trip	5
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: nicolemerriman
--

COPY public.trips (trip_id, destination, start_date, end_date, purpose, notes, textsearchable_index_col, file_key, user_id) FROM stdin;
1	Aspen, Colorado	2022-10-21	2022-10-28	Vacation	\N	\N	\N	5
2	Woodlands, Texas	2023-11-15	2023-11-20	Business	\N	\N	\N	5
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nicolemerriman
--

COPY public.users (id, name, email, password) FROM stdin;
1	Nicole Merriman	nicole.merriman17@gmail.com	$2b$10$5OhmwSoM.pCThelP7gvkUew4tGvbS3JinjXi5aoBAKH0gtAp47qj6
3	Test User	test@example.com	$2b$10$fjqi1SS6bKtxy/gE1L3CT.RPqWLRSgOkUKLqNvoI9R3eOHmu32x/y
4	Test User	testuser1_wanderlogixs@gmail.com	$2a$10$mAyDk3cgu9HsnwIaHf44qOaX.rSuOhP5S6x5YGxBPqDW2lHVw./U6
5	DemoUser	demo@example.com	$2a$10$5kC4TMFguLszRjtErnjQcOeEibsWkmjrtkh06XX2QwR9oPTDPHeBC
6			$2b$10$QG2zkqRC2.YiUzvWID9TVebo/KqzgEDBiOvW/ZE1dr48R09eCNEXO
\.


--
-- Name: expenses_expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicolemerriman
--

SELECT pg_catalog.setval('public.expenses_expense_id_seq', 4, true);


--
-- Name: itinerary_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicolemerriman
--

SELECT pg_catalog.setval('public.itinerary_event_id_seq', 11, true);


--
-- Name: media_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicolemerriman
--

SELECT pg_catalog.setval('public.media_media_id_seq', 5, true);


--
-- Name: trips_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicolemerriman
--

SELECT pg_catalog.setval('public.trips_trip_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicolemerriman
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: itinerary itinerary_pkey; Type: CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_pkey PRIMARY KEY (event_id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (media_id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: textsearch_idx_on_expenses; Type: INDEX; Schema: public; Owner: nicolemerriman
--

CREATE INDEX textsearch_idx_on_expenses ON public.expenses USING gin (textsearchable_index_col);


--
-- Name: textsearch_idx_on_itinerary; Type: INDEX; Schema: public; Owner: nicolemerriman
--

CREATE INDEX textsearch_idx_on_itinerary ON public.itinerary USING gin (textsearchable_index_col);


--
-- Name: textsearch_idx_on_media; Type: INDEX; Schema: public; Owner: nicolemerriman
--

CREATE INDEX textsearch_idx_on_media ON public.media USING gin (textsearchable_index_col);


--
-- Name: textsearch_idx_on_trips; Type: INDEX; Schema: public; Owner: nicolemerriman
--

CREATE INDEX textsearch_idx_on_trips ON public.trips USING gin (textsearchable_index_col);


--
-- Name: expenses expenses_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id);


--
-- Name: expenses expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: itinerary itinerary_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id);


--
-- Name: itinerary itinerary_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: media media_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id);


--
-- Name: media media_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicolemerriman
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

