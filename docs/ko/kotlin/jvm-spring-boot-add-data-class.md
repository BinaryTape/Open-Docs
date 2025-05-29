[//]: # (title: Spring Boot 프로젝트에 데이터 클래스 추가하기)
[//]: # (description: Spring Boot 프로젝트에 Kotlin 데이터 클래스를 추가합니다.)

<tldr>
    <p>이 문서는 <strong>Spring Boot와 Kotlin 시작하기</strong> 튜토리얼의 두 번째 파트입니다. 진행하기 전에 이전 단계를 완료했는지 확인하세요:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Kotlin으로 Spring Boot 프로젝트 생성하기</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Spring Boot 프로젝트에 데이터 클래스 추가하기</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Spring Boot 프로젝트에 데이터베이스 지원 추가하기<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepository를 사용하여 데이터베이스 접근하기</p>
</tldr>

이 튜토리얼에서는 애플리케이션에 추가 기능을 구현하고 데이터 클래스와 같은 더 많은 Kotlin 언어 기능을 알아봅니다.
이를 위해 `MessageController` 클래스를 수정하여 직렬화된 객체 컬렉션을 포함하는 JSON 문서로 응답하도록 해야 합니다.

## 애플리케이션 업데이트

1. `DemoApplication.kt` 파일과 동일한 패키지 내에 `Message.kt` 파일을 생성합니다.
2. `Message.kt` 파일에 `id`와 `text` 두 가지 속성을 가진 데이터 클래스를 생성합니다:

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 클래스는 데이터 전송에 사용될 것입니다. 직렬화된 `Message` 객체 목록은 컨트롤러가 브라우저 요청에 응답할 JSON 문서를 구성하게 됩니다.

   <deflist collapsible="true">
       <def title="데이터 클래스 – data class Message">
          <p>Kotlin의 <a href="data-classes.md">데이터 클래스</a>의 주요 목적은 데이터를 보관하는 것입니다. 이러한 클래스는 `data` 키워드로 표시되며, 일부 표준 기능과 유틸리티 함수는 클래스 구조로부터 자동으로 파생될 수 있습니다.</p>
          <p>이 예제에서는 `Message` 클래스의 주요 목적이 데이터를 저장하는 것이므로 데이터 클래스로 선언했습니다.</p>
       </def>
       <def title="val 및 var 속성">
          <p>Kotlin 클래스의 <a href="properties.md">속성</a>은 다음과 같이 선언할 수 있습니다:</p>
          <list>
             <li><i>가변(mutable)</i>: `var` 키워드 사용</li>
             <li><i>읽기 전용(read-only)</i>: `val` 키워드 사용</li>
          </list>
          <p>`Message` 클래스는 `id`와 `text` 두 속성을 `val` 키워드를 사용하여 선언합니다.
          컴파일러는 이 두 속성에 대한 getter를 자동으로 생성합니다.
          `Message` 클래스의 인스턴스가 생성된 후에는 이 속성들의 값을 재할당할 수 없습니다.
          </p>
       </def>
       <def title="널러블 타입 – String?">
          <p>Kotlin은 <a href="null-safety.md#nullable-types-and-non-nullable-types">널러블 타입(nullable types)에 대한 내장 지원</a>을 제공합니다. Kotlin에서는 타입 시스템이 `null`을 가질 수 있는 참조(<i>널러블 참조</i>)와 가질 수 없는 참조(<i>비널러블 참조</i>)를 구분합니다.<br/>
          예를 들어, 일반적인 `String` 타입 변수는 `null`을 가질 수 없습니다. `null`을 허용하려면 `String?`을 사용하여 변수를 널러블 문자열로 선언할 수 있습니다.
          </p>
          <p>`Message` 클래스의 `id` 속성은 이번에는 널러블 타입으로 선언되었습니다.
          따라서 `id`에 `null` 값을 전달하여 `Message` 클래스의 인스턴스를 생성할 수 있습니다:
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. `MessageController.kt` 파일에서 `index()` 함수 대신 `Message` 객체 목록을 반환하는 `listMessages()` 함수를 생성합니다:

    ```kotlin
    // MessageController.kt
    package com.example.demo
   
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController

    @RestController
    @RequestMapping("/")
    class MessageController {
        @GetMapping
        fun listMessages() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

    <deflist collapsible="true">
       <def title="컬렉션 – listOf()">
          <p>Kotlin 표준 라이브러리는 기본 컬렉션 타입(세트, 리스트, 맵)에 대한 구현을 제공합니다.<br/>
          각 컬렉션 타입은 <i>읽기 전용(read-only)</i> 또는 <i>가변(mutable)</i>일 수 있습니다:</p>
          <list>
              <li><i>읽기 전용</i> 컬렉션은 컬렉션 요소에 접근하는 연산을 제공합니다.</li>
              <li><i>가변</i> 컬렉션은 요소 추가, 제거, 업데이트와 같은 쓰기 연산도 제공합니다.</li>
          </list>
          <p>해당 컬렉션 인스턴스를 생성하기 위한 팩토리 함수(factory function) 또한 Kotlin 표준 라이브러리에서 제공됩니다.
          </p>
          <p>이 튜토리얼에서는 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html">`listOf()`</a> 함수를 사용하여 `Message` 객체 목록을 생성합니다.
          이 함수는 객체의 <i>읽기 전용</i> 목록을 생성하는 팩토리 함수입니다. 목록에서 요소를 추가하거나 제거할 수 없습니다.<br/>
          목록에 쓰기 연산을 수행해야 하는 경우, <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html">`mutableListOf()`</a> 함수를 호출하여 가변(mutable) 목록 인스턴스를 생성하세요.
          </p>
       </def>
       <def title="후행 쉼표">
          <p><a href="coding-conventions.md#trailing-commas">후행 쉼표(trailing comma)</a>는 일련의 요소 중 <b>마지막 항목</b> 뒤에 오는 쉼표 기호입니다:</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>이는 Kotlin 구문의 편리한 기능이며, 완전히 선택 사항입니다. 이 쉼표가 없어도 코드는 여전히 작동합니다.
          </p>
          <p>위 예제에서는 `Message` 객체 목록을 생성할 때 마지막 `listOf()` 함수 인자 뒤에 후행 쉼표가 포함되어 있습니다.</p>
       </def>
    </deflist>

`MessageController`의 응답은 이제 `Message` 객체 컬렉션을 포함하는 JSON 문서가 될 것입니다.

> Spring 애플리케이션의 모든 컨트롤러는 Jackson 라이브러리가 클래스패스에 있는 경우 기본적으로 JSON 응답을 렌더링합니다.
> [B`build.gradle.kts` 파일에 `spring-boot-starter-web` 의존성을 지정](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)했으므로, Jackson은 _전이적(transitive)_ 의존성으로 포함되었습니다.
> 따라서, 엔드포인트가 JSON으로 직렬화될 수 있는 데이터 구조를 반환하면 애플리케이션은 JSON 문서로 응답합니다.
>
{style="note"}

`DemoApplication.kt`, `MessageController.kt`, `Message.kt` 파일의 전체 코드는 다음과 같습니다:

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
// MessageController.kt
package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MessageController {
    @GetMapping
    fun listMessages() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package com.example.demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed" collapsible="true"}

## 애플리케이션 실행

Spring 애플리케이션을 실행할 준비가 되었습니다:

1. 애플리케이션을 다시 실행합니다.

2. 애플리케이션이 시작되면 다음 URL을 엽니다:

    ```text
    http://localhost:8080
    ```

    JSON 형식의 메시지 컬렉션이 포함된 페이지를 볼 수 있습니다:

    ![Run the application](messages-in-json-format.png){width=800}

## 다음 단계

튜토리얼의 다음 파트에서는 프로젝트에 데이터베이스를 추가하고 구성하며, HTTP 요청을 수행할 것입니다.

**[다음 챕터로 진행하기](jvm-spring-boot-add-db-support.md)**