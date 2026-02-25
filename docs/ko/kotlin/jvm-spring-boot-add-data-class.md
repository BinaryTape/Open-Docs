[//]: # (title: Spring Boot 프로젝트에 데이터 클래스 추가하기)

<web-summary>Spring Boot 프로젝트에 Kotlin 데이터 클래스를 추가합니다.</web-summary>

<tldr>
    <p>이것은 <strong>Spring Boot와 Kotlin 시작하기</strong> 튜토리얼의 두 번째 파트입니다. 계속하기 전에 이전 단계들을 완료했는지 확인하세요:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Kotlin으로 Spring Boot 프로젝트 만들기</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Spring Boot 프로젝트에 데이터 클래스 추가하기</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Spring Boot 프로젝트에 데이터베이스 지원 추가하기<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 데이터베이스 액세스를 위해 Spring Data CrudRepository 사용하기</p>
</tldr>

이 튜토리얼의 이번 파트에서는 애플리케이션에 기능을 더 추가하고 데이터 클래스와 같은 Kotlin 언어 기능을 더 알아봅니다.
`MessageController` 클래스가 직렬화된 객체 컬렉션을 포함하는 JSON 문서로 응답하도록 수정해야 합니다.

## 애플리케이션 업데이트

1. 동일한 패키지 내의 `DemoApplication.kt` 파일 옆에 `Message.kt` 파일을 생성합니다.
2. `Message.kt` 파일에 `id`와 `text`라는 두 개의 프로퍼티를 가진 데이터 클래스를 생성합니다:

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 클래스는 데이터 전달에 사용됩니다. 직렬화된 `Message` 객체 리스트는 컨트롤러가 브라우저 요청에 응답할 JSON 문서를 구성하게 됩니다.

   <deflist collapsible="true">
       <def title="데이터 클래스 – data class Message">
          <p>Kotlin에서 <a href="data-classes.md">데이터 클래스</a>(data classes)의 주요 목적은 데이터를 보유하는 것입니다. 이러한 클래스는 <code>data</code> 키워드로 표시되며, 표준 기능과 일부 유틸리티 함수들이 클래스 구조로부터 기계적으로 유도되는 경우가 많습니다.</p>
          <p>이 예제에서 <code>Message</code>를 데이터 클래스로 선언한 이유는 주요 목적이 데이터를 저장하는 것이기 때문입니다.</p>
       </def>
       <def title="val 및 var 프로퍼티">
          <p><a href="properties.md">Kotlin 클래스의 프로퍼티</a>는 다음과 같이 선언할 수 있습니다:</p>
          <list>
             <li><i>가변(mutable)</i>: <code>var</code> 키워드 사용</li>
             <li><i>읽기 전용(read-only)</i>: <code>val</code> 키워드 사용</li>
          </list>
          <p><code>Message</code> 클래스는 <code>val</code> 키워드를 사용하여 <code>id</code>와 <code>text</code> 두 개의 프로퍼티를 선언합니다.
          컴파일러는 이 두 프로퍼티에 대한 게터(getter)를 자동으로 생성합니다.
          <code>Message</code> 클래스의 인스턴스가 생성된 후에는 이 프로퍼티들의 값을 다시 할당할 수 없습니다.
          </p>
       </def>
       <def title="널 허용 타입 – String?">
          <p>Kotlin은 <a href="null-safety.md#nullable-types-and-non-nullable-types">널 허용 타입(nullable types)에 대한 내장 지원</a>을 제공합니다. Kotlin의 타입 시스템은 <code>null</code>을 가질 수 있는 참조(<i>nullable references</i>)와 가질 수 없는 참조(<i>non-nullable references</i>)를 구분합니다.<br/>
          예를 들어, 일반적인 <code>String</code> 타입 변수는 <code>null</code>을 가질 수 없습니다. null을 허용하려면 <code>String?</code>과 같이 작성하여 변수를 널 허용 문자열로 선언할 수 있습니다.
          </p>
          <p>이번에는 <code>Message</code> 클래스의 <code>id</code> 프로퍼티가 널 허용 타입으로 선언되었습니다.
          따라서 <code>id</code> 값으로 <code>null</code>을 전달하여 <code>Message</code> 클래스의 인스턴스를 생성할 수 있습니다:
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. `MessageController.kt` 파일에서 `index()` 함수 대신 `Message` 객체 리스트를 반환하는 `listMessages()` 함수를 생성합니다:

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
          <p>Kotlin 표준 라이브러리는 세트(sets), 리스트(lists), 맵(maps)과 같은 기본 컬렉션 타입에 대한 구현을 제공합니다.<br/>
          각 컬렉션 타입은 <i>읽기 전용</i> 또는 <i>가변</i>일 수 있습니다:</p>
          <list>
              <li><i>읽기 전용</i> 컬렉션은 컬렉션 요소에 접근하는 연산을 제공합니다.</li>
              <li><i>가변</i> 컬렉션은 요소를 추가, 제거, 업데이트하는 쓰기 연산도 제공합니다.</li>
          </list>
          <p>이러한 컬렉션의 인스턴스를 생성하기 위해 Kotlin 표준 라이브러리에서 해당 팩토리 함수를 제공합니다.
          </p>
          <p>이 튜토리얼에서는 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> 함수를 사용하여 <code>Message</code> 객체 리스트를 생성합니다.
          이는 객체의 <i>읽기 전용</i> 리스트를 생성하는 팩토리 함수로, 리스트에서 요소를 추가하거나 제거할 수 없습니다.<br/>
          리스트에 쓰기 연산을 수행해야 한다면, <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> 함수를 호출하여 가변 리스트 인스턴스를 생성하세요.
          </p>
       </def>
       <def title="후행 쉼표 (Trailing comma)">
          <p><a href="coding-conventions.md#trailing-commas">후행 쉼표</a>는 일련의 요소 중 <b>마지막 항목</b> 뒤에 붙는 쉼표 기호입니다:</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>이는 Kotlin 문법의 편리한 기능이며 완전히 선택 사항입니다. 후행 쉼표가 없어도 코드는 정상적으로 작동합니다.
          </p>
          <p>위 예제에서 <code>Message</code> 객체 리스트를 생성할 때 마지막 <code>listOf()</code> 함수 인자 뒤에 후행 쉼표가 포함되었습니다.</p>
       </def>
    </deflist>

이제 `MessageController`의 응답은 `Message` 객체 컬렉션을 포함하는 JSON 문서가 됩니다.

> Spring 애플리케이션의 모든 컨트롤러는 Jackson 라이브러리가 클래스패스에 있는 경우 기본적으로 JSON 응답을 렌더링합니다.
> [build.gradle.kts 파일에 `spring-boot-starter-webmvc` 의존성을 지정](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)했으므로, Jackson을 _전이(transitive)_ 의존성으로 가져오게 되었습니다.
> 따라서 엔드포인트가 JSON으로 직렬화할 수 있는 데이터 구조를 반환하면 애플리케이션은 JSON 문서로 응답합니다.
>
{style="note"}

다음은 `DemoApplication.kt`, `MessageController.kt`, `Message.kt` 파일의 전체 코드입니다:

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

    ![애플리케이션 실행](messages-in-json-format.png){width=700}

## 다음 단계

튜토리얼의 다음 파트에서는 프로젝트에 데이터베이스를 추가 및 설정하고 HTTP 요청을 만들어 보겠습니다.

**[다음 장으로 진행하기](jvm-spring-boot-add-db-support.md)**