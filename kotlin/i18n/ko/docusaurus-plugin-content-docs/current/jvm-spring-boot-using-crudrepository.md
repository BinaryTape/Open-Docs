---
title: "데이터베이스 액세스를 위해 Spring Data CrudRepository 사용"
description: "Kotlin으로 작성된 Spring Boot 프로젝트에서 Spring Data 인터페이스를 사용합니다."
---
:::info
<p>
   이 튜토리얼은 <strong>Spring Boot 및 Kotlin 시작하기</strong>의 마지막 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">Kotlin으로 Spring Boot 프로젝트 생성</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">Spring Boot 프로젝트에 데이터 클래스 추가</a><br/><img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support">Spring Boot 프로젝트에 데이터베이스 지원 추가</a><br/><img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>데이터베이스 액세스를 위해 Spring Data CrudRepository 사용</strong>
</p>

:::

이번 파트에서는 서비스 계층을 마이그레이션하여 데이터베이스 액세스에 `JdbcTemplate` 대신 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)의 `CrudRepository`를 사용합니다.
_CrudRepository_는 특정 유형의 리포지토리에 대한 일반적인 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 작업을 위한 Spring Data 인터페이스입니다.
데이터베이스와 상호 작용하기 위한 여러 가지 기본 제공 메서드를 제공합니다.

## 애플리케이션 업데이트

먼저 `CrudRepository` API와 함께 작동하도록 `Message` 클래스를 조정해야 합니다.

1. `@Table` 어노테이션을 `Message` 클래스에 추가하여 데이터베이스 테이블에 대한 매핑을 선언합니다.  
   `id` 필드 앞에 `@Id` 어노테이션을 추가합니다.

    > 이러한 어노테이션에는 추가 임포트도 필요합니다.
    >  
    

    ```kotlin
    // Message.kt
    package demo
   
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table
    
    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

    또한 `Message` 클래스의 사용을 보다 관용적으로 만들기 위해
    `id` 속성의 기본값을 null로 설정하고 데이터 클래스 속성의 순서를 바꿀 수 있습니다.

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    이제 `Message` 클래스의 새 인스턴스를 생성해야 하는 경우 `text` 속성만 매개변수로 지정할 수 있습니다.

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2. `Message` 데이터 클래스와 함께 작동하는 `CrudRepository`에 대한 인터페이스를 선언합니다. `MessageRepository.kt`
   파일을 생성하고 다음 코드를 추가합니다.

    ```kotlin
    // MessageRepository.kt
    package demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3. `MessageService` 클래스를 업데이트합니다. 이제 SQL 쿼리를 실행하는 대신 `MessageRepository`를 사용합니다.

    ```kotlin
    // MessageService.kt
    package demo

    import org.springframework.data.repository.findByIdOrNull
    import org.springframework.stereotype.Service
    
    @Service
    class MessageService(private val db: MessageRepository) {
        fun findMessages(): List<Message> = db.findAll().toList()
    
        fun findMessageById(id: String): Message? = db.findByIdOrNull(id)
    
        fun save(message: Message): Message = db.save(message)
    }
    ```
<h3>확장 함수</h3>
<p>
   `findByIdOrNull()` 함수는 Spring Data JDBC의 `CrudRepository` 인터페이스에 대한 <a href="extensions#extension-functions">확장 함수</a>입니다.
</p>
<h3>CrudRepository save() 함수</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">이 함수는</a> 새 객체에 데이터베이스에 id가 없다는 가정하에 작동합니다. 따라서 삽입 시 id는 <b>null이어야 합니다</b>.
</p>
<p>
   id가 <i>null</i>이 아니면 `CrudRepository`는 객체가 이미 데이터베이스에 존재하고 이것이 <i>삽입</i> 작업이 아닌 <i>업데이트</i> 작업이라고 가정합니다. 삽입 작업 후 `id`는 데이터 저장소에서 생성되어 `Message` 인스턴스에 다시 할당됩니다. 이것이 `id` 속성을 `var` 키워드를 사용하여 선언해야 하는 이유입니다.
</p>
<p>
</p>
       
    

4. 삽입된 객체에 대한 id를 생성하도록 메시지 테이블 정의를 업데이트합니다. `id`는 문자열이므로 `RANDOM_UUID()` 함수를 사용하여 기본적으로 id 값을 생성할 수 있습니다.

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5. `src/main/resources` 폴더에 있는 `application.properties` 파일에서 데이터베이스 이름을 업데이트합니다.

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

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

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("MESSAGES")
data class Message(val text: String, @Id val id: String? = null)
```

```kotlin
// MessageRepository.kt
package demo

import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message, String>
```

```kotlin
// MessageService.kt
package demo

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MessageService(private val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): Message? = db.findByIdOrNull(id)

    fun save(message: Message): Message = db.save(message)
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
        // If the message is null (not found), set response code to 404
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```

## 애플리케이션 실행

애플리케이션을 다시 실행할 준비가 되었습니다.
`JdbcTemplate`을 `CrudRepository`로 대체하여 기능은 변경되지 않았으므로 애플리케이션은 이전과 동일한 방식으로 작동해야 합니다.

## 다음 단계

Kotlin 기능을 탐색하고 언어 학습 진행 상황을 추적하는 데 도움이 되는 개인 언어 맵을 받으세요.

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map" />
</a>

* [Kotlin 코드에서 Java 호출](java-interop) 및 [Java 코드에서 Kotlin 호출](java-to-kotlin-interop)에 대해 자세히 알아보세요.
* [Java-to-Kotlin 변환기](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 알아보세요.
* Java에서 Kotlin으로 마이그레이션 가이드를 확인하세요.
  * [Java 및 Kotlin의 문자열](java-to-kotlin-idioms-strings).
  * [Java 및 Kotlin의 컬렉션](java-to-kotlin-collections-guide).
  * [Java 및 Kotlin의 Null 가능성](java-to-kotlin-nullability-guide).

  ```