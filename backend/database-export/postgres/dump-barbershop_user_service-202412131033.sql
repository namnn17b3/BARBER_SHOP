PGDMP          !    
            |            barbershop_user_service %   14.15 (Ubuntu 14.15-0ubuntu0.22.04.1) %   14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)     (           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            )           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            *           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            +           1262    42809    barbershop_user_service    DATABASE     l   CREATE DATABASE barbershop_user_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
 '   DROP DATABASE barbershop_user_service;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            ,           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    4            �            1259    42832    users    TABLE     L  CREATE TABLE public.users (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    address character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    gender character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    role character varying(255) DEFAULT USER NOT NULL,
    username character varying(255) NOT NULL,
    avatar character varying(500),
    active boolean DEFAULT true NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    4            �            1259    42831    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    4    211            -           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    210            �           2604    42835    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210    211            %          0    42832    users 
   TABLE DATA                 public          postgres    false    211   "       .           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 64, true);
          public          postgres    false    210            �           2606    42841 "   users uk_6dotkott2kjsp8vw4d0m25fb7 
   CONSTRAINT     ^   ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);
 L   ALTER TABLE ONLY public.users DROP CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7;
       public            postgres    false    211            �           2606    42845    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public            postgres    false    211            �           2606    117873    users users_pk 
   CONSTRAINT     L   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pk;
       public            postgres    false    211            %     x�ŚMS�F��|
�I;�}^v�u/�)P(�I��,�a:`\l�I�Io͡�zn���{�Tv��2ϣt���f����ݟv��w���Yr�;�.�-�W���r>��'?���&����	���M���%���;̞|0=�ܿ�L���}:Y}]����⺸��n�W?��;�=�[}��b���я�.^<?�oovu��'�.����b���b4�;��i��L�w���/_��� �uY�W��K����L���;?>~�,n��Ͽ�:����<�*x�
�p�T4�3���T w���킱3����B:k���`�\%����]�x�x�U4�2��W� ������4z�
�`Z�q0���y�W���; �6k�#��7�D���1��T6T��M*�S�N�욼YC�Uyۤ{�����Yc!W��M*����o�	�5���ɫT"wm�z�āfq�d.w:{�J�Y�^�8�D�o���M*�����E4��`0��N%r�F���j6gX/�*ȱ��p�C��,�%}|�S��`�9Tmȑ�4u*�c��>���g��W��ކ�a�ϡ�s��_�;G�1��P�9Ȱ��T"�osns���D��^�y��8w9T]���'�J%��.��.��ˡqF���T"��r�r����ȫT"o��0��Hu9$D���T`�6l��m�T�Cfh��*����Q�ˑ�rh-�k4u*���r�r�����z�J����M�T�+�I3�ɫT"�ornr��z���M*��79
79RM�{���T"oc]��]�T�#x�Ds*����J�6G�����:����c�p�#��M��^�{�mV
�9Vm�VO�N^����6l��m�U�#g3�i�Tb�osns��e��[�y�}Vw9V]��9��8�ornr���>�թD��	��X�S�8w6o8X���z�>������9M�ʡ��P�JSZ����$�'o�x�fz^��3�B�P*�6�Er���*�L�p��N%��K����;3���j�J��b9\�Y�w���J%�6���Uygg���P�{����V�wθa�{���&z�ۏ8"�N_���f SC	�.a�P��u�s�k�{��/������W�bz��}"r���\�ɯ��bt�L���&��l���)����~�:��u��)f��f����_O�S\?�L����&wVm���bT�m���Hy�)-��a��x< ������3����yR��l[Įu����WK�U1��`�=^��4-����ao���i���nb.��o=�63���?fJ�1�~�8z��[[��!     