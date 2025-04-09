---
title: "Spring Boot 프로젝트에 데이터베이스 지원 추가"
description: "JDBC 템플릿을 사용하여 Kotlin으로 작성된 Sprint Boot 프로젝트에 데이터베이스 지원을 추가합니다."
---
:::info
<p>
   이 튜토리얼은 <strong>Spring Boot 및 Kotlin 시작하기</strong>의 세 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하십시오.
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">Kotlin으로 Spring Boot 프로젝트 생성하기</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">Spring Boot 프로젝트에 데이터 클래스 추가하기</a><br/><img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>Spring Boot 프로젝트에 데이터베이스 지원 추가하기</strong><br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 데이터베이스 액세스를 위해 Spring Data CrudRepository 사용하기
</p>

:::

이 튜토리얼에서는 JDBC를 사용하여 데이터베이스를 프로젝트에 추가하고 구성하는 방법을 알아봅니다. JVM 애플리케이션에서는 JDBC를 사용하여 데이터베이스와 상호 작용합니다.
편의를 위해 Spring Framework는 JDBC 사용을 간소화하고 일반적인 오류를 방지하는 데 도움이 되는 `JdbcTemplate` 클래스를 제공합니다.

## 데이터베이스 지원 추가하기

Spring Framework 기반 애플리케이션에서 일반적인 방법은 소위 _서비스_ 계층 내에서 데이터베이스 액세스 로직을 구현하는 것입니다. 여기가 비즈니스 로직이 있는 곳입니다.
Spring에서는 클래스가 애플리케이션의 서비스 계층에 속한다는 것을 나타내기 위해 `@Service` 어노테이션으로 클래스를 표시해야 합니다.
이 애플리케이션에서는 이 목적으로 `MessageService` 클래스를 만듭니다.

동일한 패키지에서 `MessageService.kt` 파일과 `MessageService` 클래스를 다음과 같이 만듭니다.

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message): Message {
        db.update(
            "insert into messages values ( ?, ? )",
            message.id, message.text
        )
        return message
    }
}
```
<h3>생성자 인수 및 의존성 주입 – (private val db: JdbcTemplate)</h3>
<p>
   Kotlin의 클래스에는 주 생성자가 있습니다. 하나 이상의 <a href="classes#secondary-constructors">보조 생성자</a>를 가질 수도 있습니다.
      <i>주 생성자</i>는 클래스 헤더의 일부이며 클래스 이름과 선택적 유형 매개 변수 뒤에 옵니다. 이 경우 생성자는 `(val db: JdbcTemplate)`입니다.
</p>
<p>
   `val db: JdbcTemplate`는 생성자의 인수입니다.
</p>
      ```kotlin
@Service
      class MessageService(private val db: JdbcTemplate)
```
<h3>후행 람다 및 SAM 변환</h3>
<p>
   `findMessages()` 함수는 `JdbcTemplate` 클래스의 `query()` 함수를 호출합니다. `query()` 함수는 두 개의 인수를 사용합니다. String 인스턴스로의 SQL 쿼리와 행당 하나의 객체를 매핑하는 콜백입니다.
</p>
      ```sql
db.query("...", RowMapper { ... } )
```<br/>
<p>
   `RowMapper` 인터페이스는 하나의 메서드만 선언하므로 인터페이스 이름을 생략하여 람다 표현식을 통해 구현할 수 있습니다. Kotlin 컴파일러는 함수 호출에 대한 매개 변수로 사용하기 때문에 람다 표현식을 변환해야 하는 인터페이스를 알고 있습니다. 이를 <a href="java-interop#sam-conversions">Kotlin의 SAM 변환</a>이라고 합니다.
</p>
      ```sql
db.query("...", { ... } )
```<br/>
<p>
   SAM 변환 후 query 함수는 첫 번째 위치에 String과 마지막 위치에 람다 표현식, 이렇게 두 개의 인수로 끝납니다. Kotlin 규칙에 따르면 함수의 마지막 매개 변수가 함수인 경우 해당 인수로 전달된 람다 표현식을 괄호 바깥에 배치할 수 있습니다. 이러한 구문을 <a href="lambdas#passing-trailing-lambdas">후행 람다</a>라고도 합니다.
</p>
      ```sql
db.query("...") { ... }
```
<h3>사용되지 않은 람다 인수에 대한 밑줄</h3>
<p>
   여러 매개 변수가 있는 람다의 경우 밑줄 `_` 문자를 사용하여 사용하지 않는 매개 변수의 이름을 바꿀 수 있습니다.
</p>
<p>
   따라서 query 함수 호출에 대한 최종 구문은 다음과 같습니다.
</p>
      ```kotlin
db.query("select * from messages") { response, _ `->`
          Message(response.getString("id"), response.getString("text"))
      }
```
   

## MessageController 클래스 업데이트하기

새로운 `MessageService` 클래스를 사용하도록 `MessageController.kt`를 업데이트합니다.

```kotlin
// MessageController.kt
package demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class MessageController(private val service: MessageService) {
    @GetMapping
    fun listMessages() = service.findMessages()

    @PostMapping
    fun post(@RequestBody message: Message): ResponseEntity<Message> {
        val savedMessage = service.save(message)
        return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
    }
}
```
<h3>@PostMapping 어노테이션</h3>
<p>
   HTTP POST 요청을 처리하는 메서드는 `@PostMapping` 어노테이션으로 어노테이션해야 합니다. HTTP Body 콘텐츠로 전송된 JSON을 객체로 변환하려면 메서드 인수에 대해 `@RequestBody` 어노테이션을 사용해야 합니다. 애플리케이션의 클래스 경로에 Jackson 라이브러리가 있기 때문에 변환이 자동으로 수행됩니다.
</p>
<h3>ResponseEntity</h3>
<p>
   `ResponseEntity`는 상태 코드, 헤더 및 본문을 포함한 전체 HTTP 응답을 나타냅니다.
</p>
<p>
   `created()` 메서드를 사용하면 응답 상태 코드(201)를 구성하고 생성된 리소스에 대한 컨텍스트 경로를 나타내는 위치 헤더를 설정할 수 있습니다.
</p>
   

## MessageService 클래스 업데이트하기

`Message` 클래스의 `id`는 nullable String으로 선언되었습니다.

```kotlin
data class Message(val id: String?, val text: String)
```

그러나 데이터베이스에 `null`을 `id` 값으로 저장하는 것은 옳지 않습니다. 이 상황을 정상적으로 처리해야 합니다.

데이터베이스에 메시지를 저장하는 동안 `id`가 `null`일 때 새 값을 생성하도록 `MessageService.kt` 파일의 코드를 업데이트합니다.

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.UUID

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message): Message {
        val id = message.id ?: UUID.randomUUID().toString() // Generate new id if it is null
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id) // Return a copy of the message with the new id
   }
}
```
<h3>Elvis 연산자 – ?:</h3>
<p>
   `message.id ?: UUID.randomUUID().toString()` 코드는 <a href="null-safety#elvis-operator">Elvis 연산자(if-not-null-else 약칭) `?:`</a>를 사용합니다. `?:`의 왼쪽에 있는 표현식이 `null`이 아니면 Elvis 연산자는 해당 표현식을 반환하고, 그렇지 않으면 오른쪽에 있는 표현식을 반환합니다. 오른쪽 표현식은 왼쪽 표현식이 `null`인 경우에만 평가됩니다.
</p>
   

애플리케이션 코드가 데이터베이스와 함께 작동할 준비가 되었습니다. 이제 데이터 소스를 구성해야 합니다.

## 데이터베이스 구성하기

애플리케이션에서 데이터베이스를 구성합니다.

1. `src/main/resources` 디렉토리에 `schema.sql` 파일을 만듭니다. 여기에는 데이터베이스 객체 정의가 저장됩니다.

   <img src="/img/create-database-schema.png" alt="Create database schema" width="400" style={{verticalAlign: 'middle'}}/>

2. `src/main/resources/schema.sql` 파일을 다음 코드로 업데이트합니다.

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   여기에서는 `id`와 `text`라는 두 개의 열이 있는 `messages` 테이블을 만듭니다. 테이블 구조는 `Message` 클래스의 구조와 일치합니다.

3. `src/main/resources` 폴더에 있는 `application.properties` 파일을 열고 다음 애플리케이션 속성을 추가합니다.

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   이러한 설정을 통해 Spring Boot 애플리케이션에서 데이터베이스를 사용할 수 있습니다.  
   일반적인 애플리케이션 속성의 전체 목록은 [Spring 설명서](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)를 참조하십시오.

## HTTP 요청을 통해 데이터베이스에 메시지 추가하기

이전에 생성된 엔드포인트로 작업하려면 HTTP 클라이언트를 사용해야 합니다. IntelliJ IDEA에서는 내장된 HTTP 클라이언트를 사용하십시오.

1. 애플리케이션을 실행합니다. 애플리케이션이 가동되어 실행되면 POST 요청을 실행하여 데이터베이스에 메시지를 저장할 수 있습니다.

2. 프로젝트 루트 폴더에 `requests.http` 파일을 만들고 다음 HTTP 요청을 추가합니다.

   ```http request
   ### Post "Hello!"
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

3. 모든 POST 요청을 실행합니다. 요청 선언 옆의 여백에 있는 녹색 **실행** 아이콘을 사용합니다.
   이러한 요청은 텍스트 메시지를 데이터베이스에 씁니다.

   <img src="/img/execute-post-requests.png" alt="Execute POST request" style={{verticalAlign: 'middle'}}/>

4. GET 요청을 실행하고 **실행** 도구 창에서 결과를 확인합니다.

   <img src="/img/execute-get-requests.png" alt="Execute GET requests" style={{verticalAlign: 'middle'}}/>

### 요청을 실행하는 다른 방법 

다른 HTTP 클라이언트 또는 cURL 명령줄 도구를 사용할 수도 있습니다. 예를 들어, 터미널에서 다음 명령을 실행하여 동일한 결과를 얻습니다.

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## ID로 메시지 검색하기

ID로 개별 메시지를 검색하도록 애플리케이션의 기능을 확장합니다.

1. `MessageService` 클래스에서 새 함수 `findMessageById(id: String)`를 추가하여 ID로 개별 메시지를 검색합니다.

    ```kotlin
    // MessageService.kt
    package demo

    import org.springframework.stereotype.Service
    import org.springframework.jdbc.core.JdbcTemplate
    import org.springframework.jdbc.core.query
    import java.util.*
    
    @Service
    class MessageService(private val db: JdbcTemplate) {
    
        fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ `->`
            Message(response.getString("id"), response.getString("text"))
        }.singleOrNull()
    
        fun save(message: Message): Message {
            val id = message.id ?: UUID.randomUUID().toString() // Generate new id if it is null
            db.update(
                "insert into messages values ( ?, ? )",
                id, message.text
            )
            return message.copy(id = id) // Return a copy of the message with the new id
        }
    }
    ```
   
    > ID로 메시지를 가져오는 데 사용되는 `.query()` 함수는 Spring Framework에서 제공하는 [Kotlin 확장 함수](extensions#extension-functions)입니다.
    > 위 코드에서와 같이 추가로 `import org.springframework.jdbc.core.query`를 해야 합니다.
    >
    

2. `id` 매개 변수를 사용하여 새로운 `index(...)` 함수를 `MessageController` 클래스에 추가합니다.

    ```kotlin
    // MessageController.kt
    package demo

    import org.springframework.http.ResponseEntity
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.PathVariable
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestBody
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController
    import java.net.URI
    
    @RestController
    @RequestMapping("/")
    class MessageController(private val service: MessageService) {
        @GetMapping
        fun listMessages() = ResponseEntity.ok(service.findMessages())
        
        @PostMapping
        fun post(@RequestBody message: Message): ResponseEntity<Message> {
            val savedMessage = service.save(message)
            return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
        }
        
        @GetMapping("/{id}")
        fun getMessage(@PathVariable id: String): ResponseEntity<Message> =
            service.findMessageById(id).toResponseEntity()
        
        private fun Message?.toResponseEntity(): ResponseEntity<Message> =
            // If the message is null (not found), set response code to 404
            this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build() 
    }
    ```
<h3>컨텍스트 경로에서 값 검색하기</h3>
<p>
   Spring Framework는 새로운 함수를 `@GetMapping(&quot;/{id}&quot;)`로 어노테이션했으므로 컨텍스트 경로에서 메시지 `id`를 검색합니다. 함수 인수를 `@PathVariable`로 어노테이션하여 검색된 값을 함수 인수로 사용하도록 프레임워크에 지시합니다. 새로운 함수는 `MessageService`를 호출하여 ID로 개별 메시지를 검색합니다.
</p>
<h3>매개 변수 목록에서 vararg 인수 위치</h3>
<p>
   `query()` 함수는 세 개의 인수를 사용합니다.
</p>
<list>
<li>실행하려면 매개 변수가 필요한 SQL 쿼리 문자열</li>
<li>String 유형의 매개 변수인 `id`</li>
<li>람다 표현식으로 구현된 `RowMapper` 인스턴스</li>
</list>
<p>
   `query()` 함수의 두 번째 매개 변수는 <i>가변 인수</i>(`vararg`)로 선언됩니다. Kotlin에서는 가변 인수 매개 변수의 위치가 매개 변수 목록의 마지막 위치일 필요는 없습니다.
</p>
<h3>Nullable 수신자가 있는 확장 함수</h3>
<p>
   확장은 nullable 수신자 유형으로 정의할 수 있습니다. 수신자가 `null`이면 `this`도 `null`입니다. 따라서 nullable 수신자 유형으로 확장을 정의할 때는 함수 본문 내에서 `this == null` 검사를 수행하는 것이 좋습니다.
</p>
<p>
   위의 `toResponseBody` 함수에서와 같이 null-safe 호출 연산자(`?.`)를 사용하여 null 검사를 수행할 수도 있습니다.
</p>
         ```kotlin
this?.let { ResponseEntity.ok(it) }
```
<h3>ResponseEntity</h3>
<p>
   `ResponseEntity`는 상태 코드, 헤더 및 본문을 포함한 HTTP 응답을 나타냅니다. 콘텐츠를 보다 효과적으로 제어하면서 사용자 지정된 HTTP 응답을 클라이언트에 다시 보낼 수 있는 일반 래퍼입니다.
</p>
    
    

다음은 애플리케이션의 전체 코드입니다.

```kotlin
// DemoApplication.kt
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
   runApplication<DemoApplication>(*args)
}
```

```kotlin
// Message.kt
package demo

data class Message(val id: String?, val text: String)
```

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
        Message(response.getString("id"), response.getString("text"))
    }

    fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ `->`
        Message(response.getString("id"), response.getString("text"))
    }.singleOrNull()

    fun save(message: Message): Message {
        val id = message.id ?: UUID.randomUUID().toString()
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id)
    }
}
```

```kotlin
// MessageController.kt
package demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class MessageController(private val service: MessageService) {
    @GetMapping
    fun listMessages() = ResponseEntity.ok(service.findMessages())

    @PostMapping
    fun post(@RequestBody message: Message): ResponseEntity<Message> {
        val savedMessage = service.save(message)
        return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
    }

    @GetMapping("/{id}")
    fun getMessage(@PathVariable id: String): ResponseEntity<Message> =
        service.findMessageById(id).toResponseEntity()

    private fun Message?.toResponseEntity(): ResponseEntity<Message> =
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```

## 애플리케이션 실행하기

Spring 애플리케이션을 실행할 준비가 되었습니다.

1. 애플리케이션을 다시 실행합니다.

2. `requests.http` 파일을 열고 새로운 GET 요청을 추가합니다.

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. GET 요청을 실행하여 데이터베이스에서 모든 메시지를 검색합니다.

4. **실행** 도구 창에서 ID 중 하나를 복사하여 다음과 같이 요청에 추가합니다.

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f16c1d2e-08dc-455c-abfe-68440229b84f
    ```
    
    > 위에 언급된 메시지 ID 대신 메시지 ID를 넣으세요.
    >
    

5. GET 요청을 실행하고 **실행** 도구 창에서 결과를 확인합니다.

    <img src="/img/retrieve-message-by-its-id.png" alt="Retrieve message by its id" width="706" style={{verticalAlign: 'middle'}}/>

## 다음 단계

마지막 단계에서는 Spring Data를 사용하여 데이터베이스에 더 많이 사용되는 연결을 사용하는 방법을 보여줍니다. 

**[다음 장으로 진행하기](jvm-spring-boot-using-crudrepository)**