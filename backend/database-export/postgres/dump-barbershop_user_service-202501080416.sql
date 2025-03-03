PGDMP     -                     }            barbershop_user_service     13.18 (Debian 13.18-1.pgdg120+1) %   14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16406    barbershop_user_service    DATABASE     k   CREATE DATABASE barbershop_user_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';
 '   DROP DATABASE barbershop_user_service;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    16407    users    TABLE     L  CREATE TABLE public.users (
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
       public         heap    postgres    false    3            �            1259    16417    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    200    3            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    201            A           2604    16419    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    201    200            �          0    16407    users 
   TABLE DATA                 public          postgres    false    200          �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 67, true);
          public          postgres    false    201            C           2606    16421 "   users uk_6dotkott2kjsp8vw4d0m25fb7 
   CONSTRAINT     ^   ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);
 L   ALTER TABLE ONLY public.users DROP CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7;
       public            postgres    false    200            E           2606    16423    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public            postgres    false    200            G           2606    16425    users users_pk 
   CONSTRAINT     L   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pk;
       public            postgres    false    200            �   x  x�Ś�R�F��<�T�T���sN��&@�@�33\���|���vy��2���:YR5�1o�BrB�h�3������O����s���,9�}�̖ݛ�^��n�������i��H�@ �¥ �m��Qgd�����l���*�}�m2Z}]��r8ίn��t����~{�d�i�M)6����Y�zylo�-�����h�j��j/��������mo9:���%���޼���	HJ�V����;(.�P�s~r�"Y�.��q�1pš9�dY�*����U0�f��������	[c�dM��B�i��&۲d
-��e����`pǢim^�p���`l)X2+DMG/S�T\�pv��9t�g/S��^t)�ɁaSBhd{�:��C|r'G�$���u�#�&�;��s��c�m��؛�7�o��7%��쳾N}�*~��7�	�������G���z��I��0�j��L}�&~��=Nr"���|e���m|�p����))����J}䮉�ns�ٜ����^�rh�� ��s9%A!?�W��]6�ns�ڜD���T���`�9`}N�����L}�M����>'� ����N��x�9`mN���e�#�osns�ڜ���{�J}���� ��u9Y��k��2���w9w9`]��k�J}��]�]X��Ly��țp9w9d]���U�a�&l�mY�"YS�2���_��p�C��@)ɯ�T���	��p�C��@ſի�ǎ�nrȚ\1'5�����<��a��!kr���N��G��0��59�x{�Ry�r�rȺʧKԧ>�&6X1�搵9DQ�Q�>�&�X1���9$Q�W��=�6+���6��'�'/S���&l��m�X�C��4U�c�osns���y��Ry�}V
w9b]��9��8�ornrĚI��W�>�FN���U9��V��l`��&�1k>��ǯ����K����B_��8H�K��R͞z����ER���Dd��Z����ER��k���ԼL}�M�+��+��JZ)~��J}�M�FR��*�_�P�(��N?���]�����U�TbRpl+��ՠ��s6}F�OF�|��J��F�L�E�P�v�ju�}>_n�N�x��b1�o�Zŝt��n�;�β9f�,�O��Ѡ��Tf�8�i:��櫻l��E��u���2S��v/	Ss	y�ku*�M�[6X1 '��
L@l#l̜zN�~�%�|�����.��Y��bVۼw�r&���n���x������m�:�;^��/Z'��{�no:l���w{W�n�J����$���l��M܃˾�M�M��e�;gӼ�r��mE7��Bژ�q�V֜n�R߼;����i'/G���s}JK��K2&%�"��KS|�$��z9<k���� ���b     