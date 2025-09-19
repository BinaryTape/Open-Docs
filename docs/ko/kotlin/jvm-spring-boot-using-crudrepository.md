[//]: # (title: Spring Data CrudRepository를 사용하여 데이터베이스 접근하기)

<web-summary>코틀린으로 작성된 Spring Boot 프로젝트에서 Spring Data 인터페이스를 사용합니다.</web-summary>

<tldr>
    <p>이 문서는 <strong>Spring Boot 및 Kotlin 시작하기</strong> 튜토리얼의 마지막 부분입니다. 진행하기 전에 이전 단계를 모두 완료했는지 확인하세요:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">코틀린으로 Spring Boot 프로젝트 생성하기</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Spring Boot 프로젝트에 데이터 클래스 추가하기</a><br/><img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support.md">Spring Boot 프로젝트에 데이터베이스 지원 추가하기</a><br/><img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Spring Data CrudRepository를 사용하여 데이터베이스 접근하기</strong></p>
</tldr>

이 섹션에서는 데이터베이스 접근을 위해 `JdbcTemplate` 대신 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)의 `CrudRepository`를 사용하도록 서비스 계층을 마이그레이션합니다. `_CrudRepository_`는 특정 유형의 리포지토리에서 일반 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 작업을 위한 Spring Data 인터페이스입니다. 이는 데이터베이스와 상호 작용하기 위한 여러 메서드를 기본적으로 제공합니다.

## 애플리케이션 업데이트

먼저 `CrudRepository` API와 연동되도록 `Message` 클래스를 조정해야 합니다.

1.  `Message` 클래스에 `@Table` 어노테이션을 추가하여 데이터베이스 테이블에 매핑을 선언합니다.
    `id` 필드 앞에 `@Id` 어노테이션을 추가합니다.

    > 이 어노테이션들은 추가적인 임포트를 필요로 합니다.
    >
    {style="note"}

    ```kotlin
    // Message.kt
    package com.example.demo
   
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table
    
    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

    또한 `Message` 클래스의 사용을 더 관용적으로 만들려면,
    `id` 프로퍼티의 기본값을 `null`로 설정하고 데이터 클래스 프로퍼티의 순서를 바꿀 수 있습니다.

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    이제 `Message` 클래스의 새 인스턴스를 생성해야 할 때, `text` 프로퍼티만 매개변수로 지정할 수 있습니다.

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2.  `Message` 데이터 클래스와 함께 작동할 `CrudRepository`의 인터페이스를 선언합니다. `MessageRepository.kt` 파일을 생성하고 다음 코드를 추가하세요.

    ```kotlin
    // MessageRepository.kt
    package com.example.demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3.  `MessageService` 클래스를 업데이트합니다. 이제 SQL 쿼리를 실행하는 대신 `MessageRepository`를 사용합니다.

    ```kotlin
    // MessageService.kt
    package com.example.demo

    import org.springframework.data.repository.findByIdOrNull
    import org.springframework.stereotype.Service
    
    @Service
    class MessageService(private val db: MessageRepository) {
        fun findMessages(): List<Message> = db.findAll().toList()
    
        fun findMessageById(id: String): Message? = db.findByIdOrNull(id)
    
        fun save(message: Message): Message = db.save(message)
    }
    ```

    <deflist collapsible="true">
       <def title="확장 함수">
          <p><code>findByIdOrNull()</code> 함수는 Spring Data JDBC에서 <code>CrudRepository</code> 인터페이스를 위한 <a href="extensions.md#extension-functions">확장 함수</a>입니다.</p>
       </def>
       <def title="CrudRepository save() 함수">
          <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">이 함수는</a> 새 객체에 데이터베이스에 ID가 없다는 가정을 기반으로 작동합니다. 따라서 삽입을 위해서는 ID가 <b>null이어야 합니다</b>.</p>
          <p>ID가 _null_이 아니면 <code>CrudRepository</code>는 객체가 데이터베이스에 이미 존재하며 이것은 _삽입_ 작업이 아닌 _업데이트_ 작업이라고 가정합니다. 삽입 작업 후에는 <code>id</code>가 데이터 저장소에 의해 생성되어 <code>Message</code> 인스턴스에 다시 할당됩니다. 이것이 <code>id</code> 프로퍼티가 <code>var</code> 키워드를 사용하여 선언되어야 하는 이유입니다.</p>
          <p></p>
       </def>
    </deflist>

4.  삽입된 객체에 대한 ID를 생성하도록 메시지 테이블 정의를 업데이트합니다. `id`는 문자열이므로, `RANDOM_UUID()` 함수를 사용하여 기본적으로 ID 값을 생성할 수 있습니다.

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5.  `src/main/resources` 폴더에 있는 `application.properties` 파일의 데이터베이스 이름을 업데이트합니다.

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

애플리케이션의 전체 코드는 다음과 같습니다.

```kotlin
// DemoApplication.kt
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package com.example.demo

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("MESSAGES")
data class Message(val text: String, @Id val id: String? = null)
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageRepository.kt
package com.example.demo

import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message, String>
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MessageService(private val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): Message? = db.findByIdOrNull(id)

    fun save(message: Message): Message = db.save(message)
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageController.kt
package com.example.demo

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
{initial-collapse-state="collapsed" collapsible="true"}

## 애플리케이션 실행

축하합니다! 애플리케이션이 다시 실행될 준비가 되었습니다.
`JdbcTemplate`을 `CrudRepository`로 교체했지만 기능은 동일하게 유지되므로, 애플리케이션은 이전과 마찬가지로 작동합니다.

이제 `requests.http` 파일에서 [POST 및 GET HTTP 요청을 실행](jvm-spring-boot-add-db-support.md#add-messages-to-database-via-http-request)하여 동일한 결과를 얻을 수 있습니다.

## 다음 단계

코틀린 기능을 탐색하고 언어 학습 진행 상황을 추적하는 데 도움이 되는 개인 언어 맵을 받으세요.

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map" style="block"/>
</a>

*   [코틀린 코드에서 자바 호출하기](java-interop.md) 및 [자바 코드에서 코틀린 호출하기](java-to-kotlin-interop.md)에 대해 자세히 알아보세요.
*   [자바-코틀린 변환기](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 자바 코드를 코틀린으로 변환하는 방법을 알아보세요.
*   자바에서 코틀린으로의 마이그레이션 가이드를 확인하세요:
    *   [자바와 코틀린의 문자열](java-to-kotlin-idioms-strings.md).
    *   [자바와 코틀린의 컬렉션](java-to-kotlin-collections-guide.md).
    *   [자바와 코틀린의 널 가능성](java-to-kotlin-nullability-guide.md).