[//]: # (title: Spring Boot를 사용하여 데이터베이스 기반 RESTful 웹 서비스 만들기 – 튜토리얼)

이 튜토리얼은 Spring Boot를 사용하여 간단한 애플리케이션을 생성하고 정보를 저장하기 위한 데이터베이스를 추가하는 과정을 안내합니다.

이 튜토리얼에서는 다음을 수행합니다:
* HTTP 엔드포인트가 있는 애플리케이션 생성
* JSON 형식으로 데이터 객체 목록을 반환하는 방법 학습
* 객체 저장을 위한 데이터베이스 생성
* 엔드포인트를 사용하여 데이터베이스 객체 쓰기 및 검색

[완성된 프로젝트](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)를 다운로드하여 살펴보거나 이 튜토리얼의 비디오를 시청할 수 있습니다:

<video width="560" height="315" href="gf-kjD2ZmZk" title="Kotlin과 함께하는 Spring 시간. 시작하기"/>

## 시작하기 전에

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치합니다.

## 프로젝트 부트스트랩

Spring Initializr를 사용하여 새 프로젝트를 생성합니다:

> [Spring Boot 플러그인이 설치된 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html)를 사용하여 새 프로젝트를 생성할 수도 있습니다.
>
{style="note"}

1. [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2)를 엽니다. 이 링크는 이 튜토리얼의 프로젝트 설정이 미리 채워진 페이지를 엽니다.
이 프로젝트는 **Gradle**, **Kotlin**, **Spring Web**, **Spring Data JDBC**, **H2 Database**를 사용합니다:

   ![Spring Initializr로 새 프로젝트 생성](spring-boot-create-project-with-initializr.png){width=800}

2. 화면 하단에서 **GENERATE**를 클릭합니다. Spring Initializr는 지정된 설정으로 프로젝트를 생성합니다. 다운로드가 자동으로 시작됩니다.

3. **.zip** 파일의 압축을 풀고 IntelliJ IDEA에서 엽니다.

   프로젝트는 다음 구조를 가집니다:
   ![Spring Boot 프로젝트 구조](spring-boot-project-structure.png){width=350}
 
   `main/kotlin` 폴더 아래에는 애플리케이션에 속하는 패키지와 클래스들이 있습니다. 애플리케이션의 진입점은 `DemoApplication.kt` 파일의 `main()` 메서드입니다.

## 프로젝트 빌드 파일 살펴보기

`build.gradle.kts` 파일을 엽니다.

이 파일은 애플리케이션에 필요한 의존성 목록을 포함하는 Gradle Kotlin 빌드 스크립트입니다.

이 Gradle 파일은 Spring Boot에 표준적이지만, [kotlin-spring](all-open-plugin.md#spring-support) Gradle 플러그인을 포함하여 필요한 Kotlin 의존성도 포함합니다.

## Spring Boot 애플리케이션 살펴보기

`DemoApplication.kt` 파일을 엽니다:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

Kotlin 애플리케이션 파일이 Java 애플리케이션 파일과 다르다는 점에 주목하세요:
* Spring Boot는 public static `main()` 메서드를 찾지만, Kotlin 애플리케이션은 `DemoApplication` 클래스 외부에 정의된 [최상위 함수](functions.md#function-scope)를 사용합니다.
* `DemoApplication` 클래스는 [kotlin-spring](all-open-plugin.md#spring-support) 플러그인이 자동으로 그렇게 처리하므로 `open`으로 선언되지 않습니다.

## 데이터 클래스 및 컨트롤러 생성

엔드포인트를 생성하려면 프로젝트에 [데이터 클래스](data-classes.md)와 컨트롤러를 추가하세요:

1. `DemoApplication.kt` 파일에서 `id`와 `text` 두 가지 속성을 가진 `Message` 데이터 클래스를 생성합니다:

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 같은 파일에서 요청을 처리하고 `Message` 객체 컬렉션을 포함하는 JSON 문서를 반환할 `MessageResource` 클래스를 생성합니다:

   ```kotlin
   @RestController
   class MessageResource {
       @GetMapping("/")
       fun index(): List<Message> = listOf(
           Message("1", "Hello!"),
           Message("2", "Bonjour!"),
           Message("3", "Privet!"),
       )
   }
   ```

`DemoApplication.kt`의 전체 코드:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageResource {
    @GetMapping("/")
    fun index(): List<Message> = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

data class Message(val id: String?, val text: String)
```

## 애플리케이션 실행

이제 애플리케이션을 실행할 준비가 되었습니다:

1. `main()` 메서드 옆의 거터에 있는 녹색 **실행** 아이콘을 클릭하거나 **Alt+Enter** 단축키를 사용하여 IntelliJ IDEA에서 시작 메뉴를 호출합니다:

   ![애플리케이션 실행](spring-boot-run-the-application.png){width=800}

   > 터미널에서 `./gradlew bootRun` 명령어를 실행할 수도 있습니다.
   >
   {style="note"}

2. 애플리케이션이 시작되면 다음 URL을 엽니다: [http://localhost:8080](http://localhost:8080).

   JSON 형식의 메시지 컬렉션이 있는 페이지가 표시됩니다:

   ![애플리케이션 출력](spring-boot-output.png)

## 데이터베이스 지원 추가

애플리케이션에서 데이터베이스를 사용하려면 먼저 두 개의 엔드포인트를 생성합니다: 하나는 메시지 저장용, 다른 하나는 메시지 검색용입니다:

1. `Message` 클래스에 `@Table` 어노테이션을 추가하여 데이터베이스 테이블에 대한 매핑을 선언합니다. `id` 필드 앞에 `@Id` 어노테이션을 추가합니다. 이러한 어노테이션에는 추가 임포트도 필요합니다:

   ```kotlin
   import org.springframework.data.annotation.Id
   import org.springframework.data.relational.core.mapping.Table
  
   @Table("MESSAGES")
   data class Message(@Id val id: String?, val text: String)
   ```

2. 데이터베이스에 접근하기 위해 [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)를 사용합니다:

   ```kotlin
   import org.springframework.data.jdbc.repository.query.Query
   import org.springframework.data.repository.CrudRepository
  
   interface MessageRepository : CrudRepository<Message, String>{
  
       @Query("select * from messages")
       fun findMessages(): List<Message>
   }
   ```

   `MessageRepository` 인스턴스에서 `findMessages()` 메서드를 호출하면 해당 데이터베이스 쿼리를 실행합니다:

   ```sql
   select * from messages
   ```

   이 쿼리는 데이터베이스 테이블에서 모든 `Message` 객체 목록을 검색합니다.

3. `MessageService` 클래스를 생성합니다:

   ```kotlin
   import org.springframework.stereotype.Service
  
   @Service
   class MessageService(val db: MessageRepository) {

       fun findMessages(): List<Message> = db.findMessages()

       fun post(message: Message){
           db.save(message)
       }
   }
   ```

   이 클래스는 두 가지 메서드를 포함합니다:
   * `post()`: 새 `Message` 객체를 데이터베이스에 쓰는 용도
   * `findMessages()`: 데이터베이스에서 모든 메시지를 가져오는 용도

4. `MessageResource` 클래스를 업데이트합니다:

   ```kotlin
   import org.springframework.web.bind.annotation.RequestBody
   import org.springframework.web.bind.annotation.PostMapping
  
  
   @RestController
   class MessageResource(val service: MessageService) {
       @GetMapping("/")
       fun index(): List<Message> = service.findMessages()
  
       @PostMapping("/")
       fun post(@RequestBody message: Message) {
           service.post(message)
       }
   }
   ```

   이제 `MessageService`를 사용하여 데이터베이스와 연동합니다.

## 데이터베이스 구성

애플리케이션에서 데이터베이스를 구성합니다:

1. `src/main/resources`에 `sql`이라는 새 폴더를 생성하고 그 안에 `schema.sql` 파일을 넣어 데이터베이스 스키마를 저장할 것입니다:

   ![새 폴더 생성](spring-boot-sql-scheme.png){width=300}

2. `src/main/resources/sql/schema.sql` 파일을 다음 코드로 업데이트합니다:

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   이 코드는 두 가지 필드, `id`와 `text`를 가진 `messages` 테이블을 생성합니다. 테이블 구조는 `Message` 클래스의 구조와 일치합니다.

3. `src/main/resources` 폴더에 있는 `application.properties` 파일을 열고 다음 애플리케이션 속성을 추가합니다:

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   이 설정은 Spring Boot 애플리케이션에서 데이터베이스를 활성화합니다. 일반적인 애플리케이션 속성의 전체 목록은 [Spring 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)에서 확인하세요.

## HTTP 요청 실행

이전에 생성된 엔드포인트와 연동하려면 HTTP 클라이언트를 사용해야 합니다. IntelliJ IDEA에서는 내장된 [HTTP 클라이언트](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)를 사용할 수 있습니다:

1. 애플리케이션을 실행합니다. 애플리케이션이 실행되면 POST 요청을 실행하여 메시지를 데이터베이스에 저장할 수 있습니다.

2. `requests.http` 파일을 생성하고 다음 HTTP 요청을 추가합니다:

   ```http request
   ### Post 'Hello!"
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Hello!"
   }
  
   ### Post "Bonjour!"
  
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Bonjour!"
   }
  
   ### Post "Privet!"
  
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Privet!"
   }
  
   ### Get all the messages
   GET http://localhost:8080/
   ```

3. 모든 POST 요청을 실행합니다. 요청 선언 옆의 거터에 있는 녹색 **실행** 아이콘을 사용합니다. 이 요청들은 텍스트 메시지를 데이터베이스에 씁니다.

   ![HTTP POST 요청 실행](spring-boot-run-http-request.png)

4. GET 요청을 실행하고 **실행** 도구 창에서 결과를 확인합니다:

   ![HTTP GET 요청 실행](spring-boot-output-2.png)

### 요청 실행의 대체 방법

다른 HTTP 클라이언트나 cURL 명령줄 도구를 사용할 수도 있습니다. 예를 들어, 터미널에서 다음 명령을 실행하여 동일한 결과를 얻을 수 있습니다:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 다음 단계

Kotlin 기능을 탐색하고 언어 학습 진행 상황을 추적하는 데 도움이 되는 개인 언어 맵을 받아보세요. 또한 Kotlin을 Spring과 함께 사용하는 방법에 대한 언어 팁과 유용한 자료를 보내드립니다.

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="get-kotlin-language-map.png" width="700" alt="Kotlin 언어 맵 받기"/>
</a>

> 자료를 받으려면 다음 페이지에서 이메일 주소를 공유해야 합니다.
>
{style="note"}

### 다음도 참조하세요

더 많은 튜토리얼은 Spring 웹사이트를 참조하세요:

* [Spring Boot와 Kotlin으로 웹 애플리케이션 구축하기](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [Kotlin Coroutines 및 RSocket을 사용한 Spring Boot](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)