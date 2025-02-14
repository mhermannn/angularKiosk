# McKiosk - Backend

## Opis
McKiosk to system zarządzania kioskiem samoobsługowym McDonald's. Jest to backend aplikacji napisany w Spring Boot.

## Wymagania środowiskowe
Aby uruchomić aplikację, upewnij się, że masz zainstalowane następujące komponenty:

- **Java 17** (JDK 17 lub nowszy)
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Git**

### Zależności projektu
Aplikacja wykorzystuje następujące zależności:

- Spring Boot 3.4.0
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- Spring Boot Starter OAuth2 Client
- JSON Web Token (jjwt 0.11.5)
- Lombok (1.18.30)
- Baza danych PostgreSQL
- H2 (do testów)

## Instalacja i konfiguracja

1. **Klonowanie repozytorium:**
   ```bash
   git clone https://github.com/mhermannn/angularKiosk.git
   cd mckiosk-backend
   ```

2. **Konfiguracja bazy danych:**
   Upewnij się, że masz uruchomioną bazę danych PostgreSQL i utworzoną bazę `kioskdb`.

   Domyślna konfiguracja w pliku `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/kioskdb
   spring.datasource.username=postgres
   spring.datasource.password=root
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   ```
   Jeśli Twoje dane dostępowe są inne, zaktualizuj je w pliku `application.properties`.

3. **Budowanie aplikacji:**
   ```bash
   mvn clean install
   ```

## Uruchamianie aplikacji

1. **Uruchomienie aplikacji w trybie developerskim:**
   ```bash
   mvn spring-boot:run
   ```


2. **Aplikacja działa na porcie `9393`**. Domyślny adres:
   ```
   http://localhost:9393
   ```

## API
Aplikacja oferuje REST API do obsługi kiosku. Oto kilka przykładowych endpointów:

- `POST /api/users/register` – rejestracja użytkownika
- `POST /api/auth/login` – logowanie użytkownika
- `GET /api/meals` – pobranie listy posiłków
- `POST /api/meals` – dodanie nowego posiłku (wymagana autoryzacja)
- `DELETE /api/meals/{id}` – usunięcie posiłku (wymagana rola ADMIN)

## Autoryzacja i OAuth2
Aplikacja obsługuje logowanie za pomocą Google OAuth2. W pliku `application.properties` znajdują się wymagane klucze:
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```
Zastąp `YOUR_CLIENT_ID` i `YOUR_CLIENT_SECRET` własnymi danymi uzyskanymi w konsoli Google Cloud.

```

## Zabezpieczenia
- JWT do autoryzacji użytkowników
- Spring Security do ochrony endpointów
- CORS skonfigurowany dla frontendu działającego na `http://localhost:4200`
