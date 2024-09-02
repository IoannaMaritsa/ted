PGDMP  $                    |           tedDatabase    16.4    16.4 Q    $           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            %           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            &           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            '           1262    16398    tedDatabase    DATABASE        CREATE DATABASE "tedDatabase" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Greek_Greece.1253';
    DROP DATABASE "tedDatabase";
                postgres    false            �            1259    16479    articles    TABLE     �   CREATE TABLE public.articles (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    author_id integer,
    publish_date date NOT NULL,
    content text NOT NULL
);
    DROP TABLE public.articles;
       public         heap    postgres    false            �            1259    16478    articles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.articles_id_seq;
       public          postgres    false    225            (           0    0    articles_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;
          public          postgres    false    224            �            1259    16508    attachments    TABLE     �   CREATE TABLE public.attachments (
    id integer NOT NULL,
    article_id integer,
    type character varying(50) NOT NULL,
    url character varying(255) NOT NULL
);
    DROP TABLE public.attachments;
       public         heap    postgres    false            �            1259    16507    attachments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.attachments_id_seq;
       public          postgres    false    228            )           0    0    attachments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;
          public          postgres    false    227            �            1259    16520    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    article_id integer,
    author_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    text text NOT NULL
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    16519    comments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public          postgres    false    230            *           0    0    comments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;
          public          postgres    false    229            �            1259    16492    contacts    TABLE     `   CREATE TABLE public.contacts (
    user_id integer NOT NULL,
    contact_id integer NOT NULL
);
    DROP TABLE public.contacts;
       public         heap    postgres    false            �            1259    16431    experiences    TABLE     �   CREATE TABLE public.experiences (
    id integer NOT NULL,
    user_id integer,
    profession character varying(100) NOT NULL,
    workplace character varying(100) NOT NULL,
    start_date date NOT NULL,
    end_date date
);
    DROP TABLE public.experiences;
       public         heap    postgres    false            �            1259    16430    experiences_id_seq    SEQUENCE     �   CREATE SEQUENCE public.experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.experiences_id_seq;
       public          postgres    false    218            +           0    0    experiences_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.experiences_id_seq OWNED BY public.experiences.id;
          public          postgres    false    217            �            1259    16574    friend_requests    TABLE       CREATE TABLE public.friend_requests (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 #   DROP TABLE public.friend_requests;
       public         heap    postgres    false            �            1259    16573    friend_requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.friend_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.friend_requests_id_seq;
       public          postgres    false    236            ,           0    0    friend_requests_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.friend_requests_id_seq OWNED BY public.friend_requests.id;
          public          postgres    false    235            �            1259    16540    jobs    TABLE     �  CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    creator_id integer,
    company character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    publish_date date NOT NULL,
    type character varying(50) NOT NULL,
    profession character varying(255) NOT NULL,
    experience integer NOT NULL,
    salary integer,
    details text
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    16539    jobs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public          postgres    false    232            -           0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public          postgres    false    231            �            1259    16455    skills    TABLE     h   CREATE TABLE public.skills (
    id integer NOT NULL,
    skill_name character varying(100) NOT NULL
);
    DROP TABLE public.skills;
       public         heap    postgres    false            �            1259    16454    skills_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.skills_id_seq;
       public          postgres    false    222            .           0    0    skills_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;
          public          postgres    false    221            �            1259    16443    studies    TABLE       CREATE TABLE public.studies (
    id integer NOT NULL,
    user_id integer,
    university character varying(100) NOT NULL,
    degree character varying(100) NOT NULL,
    start_date character varying(4) NOT NULL,
    end_date character varying(4) NOT NULL
);
    DROP TABLE public.studies;
       public         heap    postgres    false            �            1259    16442    studies_id_seq    SEQUENCE     �   CREATE SEQUENCE public.studies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.studies_id_seq;
       public          postgres    false    220            /           0    0    studies_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.studies_id_seq OWNED BY public.studies.id;
          public          postgres    false    219            �            1259    16554    submissions    TABLE     �   CREATE TABLE public.submissions (
    id integer NOT NULL,
    job_id integer,
    user_id integer,
    submission_date date NOT NULL
);
    DROP TABLE public.submissions;
       public         heap    postgres    false            �            1259    16553    submissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.submissions_id_seq;
       public          postgres    false    234            0           0    0    submissions_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;
          public          postgres    false    233            �            1259    16594    user_interests    TABLE     f   CREATE TABLE public.user_interests (
    user_id integer NOT NULL,
    article_id integer NOT NULL
);
 "   DROP TABLE public.user_interests;
       public         heap    postgres    false            �            1259    16463    user_skills    TABLE     a   CREATE TABLE public.user_skills (
    user_id integer NOT NULL,
    skill_id integer NOT NULL
);
    DROP TABLE public.user_skills;
       public         heap    postgres    false            �            1259    16420    users    TABLE     j  CREATE TABLE public.users (
    id integer NOT NULL,
    profilepic character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    profession character varying(100),
    workplace character varying(100),
    location character varying(100),
    dob date,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16419    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216            1           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            W           2604    16482    articles id    DEFAULT     j   ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);
 :   ALTER TABLE public.articles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            X           2604    16511    attachments id    DEFAULT     p   ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);
 =   ALTER TABLE public.attachments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227    228            Y           2604    16523    comments id    DEFAULT     j   ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);
 :   ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            T           2604    16434    experiences id    DEFAULT     p   ALTER TABLE ONLY public.experiences ALTER COLUMN id SET DEFAULT nextval('public.experiences_id_seq'::regclass);
 =   ALTER TABLE public.experiences ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            ]           2604    16577    friend_requests id    DEFAULT     x   ALTER TABLE ONLY public.friend_requests ALTER COLUMN id SET DEFAULT nextval('public.friend_requests_id_seq'::regclass);
 A   ALTER TABLE public.friend_requests ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    236    235    236            [           2604    16543    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    231    232            V           2604    16458 	   skills id    DEFAULT     f   ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);
 8   ALTER TABLE public.skills ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            U           2604    16446 
   studies id    DEFAULT     h   ALTER TABLE ONLY public.studies ALTER COLUMN id SET DEFAULT nextval('public.studies_id_seq'::regclass);
 9   ALTER TABLE public.studies ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            \           2604    16557    submissions id    DEFAULT     p   ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);
 =   ALTER TABLE public.submissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    234    234            S           2604    16423    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            o           2606    16486    articles articles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.articles DROP CONSTRAINT articles_pkey;
       public            postgres    false    225            s           2606    16513    attachments attachments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_pkey;
       public            postgres    false    228            u           2606    16528    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    230            q           2606    16496    contacts contacts_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (user_id, contact_id);
 @   ALTER TABLE ONLY public.contacts DROP CONSTRAINT contacts_pkey;
       public            postgres    false    226    226            e           2606    16436    experiences experiences_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.experiences DROP CONSTRAINT experiences_pkey;
       public            postgres    false    218            }           2606    16581 $   friend_requests friend_requests_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.friend_requests DROP CONSTRAINT friend_requests_pkey;
       public            postgres    false    236                       2606    16583 9   friend_requests friend_requests_sender_id_receiver_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_sender_id_receiver_id_key UNIQUE (sender_id, receiver_id);
 c   ALTER TABLE ONLY public.friend_requests DROP CONSTRAINT friend_requests_sender_id_receiver_id_key;
       public            postgres    false    236    236            w           2606    16547    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public            postgres    false    232            i           2606    16460    skills skills_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.skills DROP CONSTRAINT skills_pkey;
       public            postgres    false    222            k           2606    16462    skills skills_skill_name_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_skill_name_key UNIQUE (skill_name);
 F   ALTER TABLE ONLY public.skills DROP CONSTRAINT skills_skill_name_key;
       public            postgres    false    222            g           2606    16448    studies studies_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.studies
    ADD CONSTRAINT studies_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.studies DROP CONSTRAINT studies_pkey;
       public            postgres    false    220            y           2606    16561 *   submissions submissions_job_id_user_id_key 
   CONSTRAINT     p   ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_job_id_user_id_key UNIQUE (job_id, user_id);
 T   ALTER TABLE ONLY public.submissions DROP CONSTRAINT submissions_job_id_user_id_key;
       public            postgres    false    234    234            {           2606    16559    submissions submissions_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.submissions DROP CONSTRAINT submissions_pkey;
       public            postgres    false    234            �           2606    16598 "   user_interests user_interests_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.user_interests
    ADD CONSTRAINT user_interests_pkey PRIMARY KEY (user_id, article_id);
 L   ALTER TABLE ONLY public.user_interests DROP CONSTRAINT user_interests_pkey;
       public            postgres    false    237    237            m           2606    16467    user_skills user_skills_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (user_id, skill_id);
 F   ALTER TABLE ONLY public.user_skills DROP CONSTRAINT user_skills_pkey;
       public            postgres    false    223    223            a           2606    16429    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    216            c           2606    16427    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    16487     articles articles_author_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;
 J   ALTER TABLE ONLY public.articles DROP CONSTRAINT articles_author_id_fkey;
       public          postgres    false    225    4707    216            �           2606    16514 '   attachments attachments_article_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_article_id_fkey;
       public          postgres    false    225    228    4719            �           2606    16529 !   comments comments_article_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_article_id_fkey;
       public          postgres    false    230    225    4719            �           2606    16534     comments comments_author_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;
 J   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_author_id_fkey;
       public          postgres    false    4707    216    230            �           2606    16502 !   contacts contacts_contact_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.users(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.contacts DROP CONSTRAINT contacts_contact_id_fkey;
       public          postgres    false    216    4707    226            �           2606    16497    contacts contacts_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.contacts DROP CONSTRAINT contacts_user_id_fkey;
       public          postgres    false    226    4707    216            �           2606    16437 $   experiences experiences_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.experiences DROP CONSTRAINT experiences_user_id_fkey;
       public          postgres    false    216    218    4707            �           2606    16589 0   friend_requests friend_requests_receiver_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.friend_requests DROP CONSTRAINT friend_requests_receiver_id_fkey;
       public          postgres    false    216    236    4707            �           2606    16584 .   friend_requests friend_requests_sender_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.friend_requests DROP CONSTRAINT friend_requests_sender_id_fkey;
       public          postgres    false    4707    236    216            �           2606    16548    jobs jobs_creator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;
 C   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_creator_id_fkey;
       public          postgres    false    216    4707    232            �           2606    16449    studies studies_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.studies
    ADD CONSTRAINT studies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.studies DROP CONSTRAINT studies_user_id_fkey;
       public          postgres    false    220    4707    216            �           2606    16562 #   submissions submissions_job_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.submissions DROP CONSTRAINT submissions_job_id_fkey;
       public          postgres    false    234    232    4727            �           2606    16567 $   submissions submissions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.submissions DROP CONSTRAINT submissions_user_id_fkey;
       public          postgres    false    234    216    4707            �           2606    16604 -   user_interests user_interests_article_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_interests
    ADD CONSTRAINT user_interests_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.user_interests DROP CONSTRAINT user_interests_article_id_fkey;
       public          postgres    false    237    225    4719            �           2606    16599 *   user_interests user_interests_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_interests
    ADD CONSTRAINT user_interests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.user_interests DROP CONSTRAINT user_interests_user_id_fkey;
       public          postgres    false    4707    237    216            �           2606    16473 %   user_skills user_skills_skill_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.user_skills DROP CONSTRAINT user_skills_skill_id_fkey;
       public          postgres    false    222    223    4713            �           2606    16468 $   user_skills user_skills_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.user_skills DROP CONSTRAINT user_skills_user_id_fkey;
       public          postgres    false    4707    216    223           