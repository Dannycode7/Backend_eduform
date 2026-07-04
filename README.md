# Schéma de la Base de Données - Plateforme d'Apprentissage en Ligne

Ce document détaille le schéma de la base de données pour une plateforme d'apprentissage en ligne (e-learning), gérée avec l'ORM [Prisma](https://www.prisma.io/). Le système utilise une base de données PostgreSQL avec une architecture multi-schémas pour séparer l'authentification des données publiques de l'application.

## Table des matières

- [Aperçu de l'architecture](#aperçu-de-larchitecture)
- [Modèles de données](#modèles-de-données)
  - [AuthUser](#authuser)
  - [User](#user)
  - [Course](#course)
  - [Enrollment](#enrollment)
  - [Favorite](#favorite)
  - [Payment](#payment)
- [Énumérations (Enums)](#énumérations-enums)
- [Relations](#relations)
- [Mise en place et utilisation](#mise-en-place-et-utilisation)

## Aperçu de l'architecture

Le projet est structuré autour de deux schémas PostgreSQL pour une meilleure organisation et sécurité des données :

- **`auth`** : Contient les données brutes des utilisateurs provenant du système d'authentification (probablement Supabase Auth).
- **`public`** : Contient toutes les données métier de l'application (profils utilisateurs, cours, inscriptions, etc.).

Prisma est configuré pour utiliser la fonctionnalité `multiSchema` afin de gérer cette séparation.

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider  = "postgresql"
  schemas   = ["public", "auth"]
}
```

---

## Modèles de données

Voici une description détaillée de chaque modèle dans le schéma `public` et `auth`.

### `AuthUser`

Ce modèle, situé dans le schéma `auth`, représente un utilisateur du point de vue de l'authentification. Il sert de pont avec la table des utilisateurs de Supabase.

```prisma
model AuthUser {
  id          String  @id @db.Uuid
  email       String  @unique
  userProfile User?

  @@map("users")
  @@schema("auth")
}
```

- **`id`**: Identifiant unique de l'utilisateur (UUID), synchronisé avec Supabase Auth.
- **`email`**: Adresse e-mail unique de l'utilisateur.
- **`userProfile`**: Relation optionnelle un-à-un vers le profil public de l'utilisateur.

### `User`

Ce modèle, dans le schéma `public`, contient les informations de profil et les statistiques de l'utilisateur au sein de la plateforme.

```prisma
model User {
  id              Int          @id @default(autoincrement())
  supabaseId      String       @unique @db.Uuid
  name            String
  email           String       @unique
  avatar          String?      @default("...")
  role            Role         @default(STUDENT)
  isActive        Boolean      @default(true)
  
  authUser        AuthUser     @relation(fields: [supabaseId], references: [id], onDelete: Cascade)

  // Statistiques
  premiumStatus   String       @default("Membre Edu Gratuit")
  primaryCategory String?      @default("Développement Web")
  studyHours      Int          @default(0)
  averageGrade    Int          @default(0)
  
  // Relations
  enrollments     Enrollment[]
  favorites       Favorite[]
  payments        Payment[]
 
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@schema("public")
}
```

- **`supabaseId`**: Clé étrangère qui lie ce profil à l'enregistrement `AuthUser` correspondant.
- **`role`**: Rôle de l'utilisateur (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
- **Relations**: Un utilisateur peut avoir plusieurs inscriptions (`Enrollment`), favoris (`Favorite`) et paiements (`Payment`).

### `Course`

Représente un cours disponible sur la plateforme.

```prisma
model Course {
  id           String       @id @default(uuid())
  title        String
  category     Category
  difficulty   Difficulty
  description  String       @db.Text
  image        String       @default("...")
  duration     String       // Ex: "12h 30m"
  lessonsCount Int          @default(0)
  rating       Float        @default(4.5)
  instructor   String
  price        Float        @default(0.0)
  
  // Relations
  enrollments  Enrollment[]
  favorites    Favorite[]
  payments     Payment[]

  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  @@map("courses")
  @@schema("public")
}
```

- **`category`**, **`difficulty`**: Catégories et niveaux de difficulté définis par des énumérations.
- **Relations**: Un cours peut être associé à plusieurs inscriptions, favoris et paiements.

### `Enrollment`

Table de liaison qui représente l'inscription d'un `User` à un `Course`.

```prisma
model Enrollment {
  id           String    @id @default(uuid())
  userId       Int
  courseId     String
  progress     Int       @default(0) // 0 à 100
  lastAccessed DateTime? @default(now())
  
  // Relations
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  course       Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([userId, courseId])
  @@map("enrollments")
  @@schema("public")
}
```

- **`progress`**: Progression de l'utilisateur dans le cours (en pourcentage).
- **`@@unique([userId, courseId])`**: Assure qu'un utilisateur ne peut s'inscrire qu'une seule fois au même cours.

### `Favorite`

Permet à un `User` de marquer un `Course` comme favori.

```prisma
model Favorite {
  id        String   @id @default(uuid())
  userId    Int
  courseId  String
  
  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, courseId])
  @@map("favorites")
  @@schema("public")
}
```

### `Payment`

Enregistre les transactions financières pour l'achat de cours.

```prisma
model Payment {
  id            String         @id @default(uuid())
  userId        Int
  courseId      String
  amount        Float
  operator      MobileOperator
  phoneNumber   String
  status        PaymentStatus  @default(PENDING)
  transactionId String?        @unique

  // Relations
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  course        Course         @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@map("payments")
  @@schema("public")
}
```

---

## Énumérations (Enums)

Plusieurs énumérations sont utilisées pour standardiser les valeurs de certains champs :

- **`Role`**: `STUDENT`, `INSTRUCTOR`, `ADMIN`
- **`Category`**: `DESIGN`, `MARKETING`, `DEVELOPPEMENT`, etc.
- **`Difficulty`**: `DEBUTANT`, `INTERMEDIAIRE`, `AVANCE`
- **`PaymentStatus`**: `PENDING`, `SUCCESS`, `FAILED`
- **`MobileOperator`**: `ORANGE`, `MTN`, `MPESA`, `AIRTEL`

---

## Relations

- **`AuthUser` <-> `User`**: Relation un-à-un. Chaque utilisateur d'authentification a un profil public.
- **`User` <-> `Course`**: Relation plusieurs-à-plusieurs via les tables `Enrollment`, `Favorite` et `Payment`.

---

## Mise en place et utilisation

1.  **Prérequis** : Assurez-vous d'avoir Node.js et une base de données PostgreSQL accessible.

2.  **Configuration** :
    - Installez les dépendances : `npm install`
    - Configurez votre chaîne de connexion à la base de données dans le fichier `.env`.

3.  **Générer le client Prisma** :
    ```bash
    npx prisma generate
    ```

4.  **Appliquer le schéma à la base de données** :
    Pour le développement, utilisez `migrate dev` pour créer et appliquer les migrations.
    ```bash
    npx prisma migrate dev --name init
    ```
    Pour synchroniser rapidement le schéma sans créer de fichier de migration (utile pour le prototypage) :
    ```bash
    npx prisma db push
    ```
