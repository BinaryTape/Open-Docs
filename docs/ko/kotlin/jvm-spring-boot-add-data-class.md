---
title: "Spring Boot 프로젝트에 데이터 클래스 추가하기"
description: "Spring Boot 프로젝트에 Kotlin 데이터 클래스를 추가합니다."
---
:::info
<p>
   이 튜토리얼은 <strong>Spring Boot와 Kotlin 시작하기</strong>의 두 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하십시오.
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">Kotlin으로 Spring Boot 프로젝트 생성</a><br/><img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>Spring Boot 프로젝트에 데이터 클래스 추가</strong><br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> Spring Boot 프로젝트에 데이터베이스 지원 추가<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepository를 사용하여 데이터베이스 액세스
</p>

:::

이 튜토리얼의 이 파트에서는 애플리케이션에 몇 가지 기능을 더 추가하고 데이터 클래스와 같은 Kotlin 언어 기능을 더 자세히 알아봅니다.
`MessageController` 클래스를 변경하여 직렬화된 객체의 컬렉션을 포함하는 JSON 문서를 응답해야 합니다.

## 애플리케이션 업데이트

1. 동일한 패키지에서 두 개의 속성 `id` 및 `text`가 있는 데이터 클래스를 사용하여 `Message.kt` 파일을 만듭니다.

    ```kotlin
    // Message.kt
    package demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 클래스는 데이터 전송에 사용됩니다. 직렬화된 `Message` 객체 목록은 컨트롤러가 브라우저 요청에 응답할 JSON 문서를 구성합니다.
<h3>데이터 클래스 – data class Message</h3>
<p>
   Kotlin의 <a href="data-classes">데이터 클래스(data classes)</a>의 주요 목적은 데이터를 보유하는 것입니다. 이러한 클래스는 `data` 키워드로 표시되며 일부 표준 기능과 일부 유틸리티 함수는 종종 클래스 구조에서 기계적으로 파생될 수 있습니다.
</p>
<p>
   이 예제에서는 `Message`의 주요 목적이 데이터를 저장하는 것이므로 데이터 클래스로 선언했습니다.
</p>
<h3>val 및 var 속성</h3>
<p>
   <a href="properties">Kotlin의 속성(Properties in Kotlin)</a> 클래스는 다음 중 하나로 선언할 수 있습니다.
</p>
<list>
<li>`var` 키워드를 사용하는 <i>mutable</i></li>
<li>`val` 키워드를 사용하는 <i>read-only</i></li>
</list>
<p>
   `Message` 클래스는 `val` 키워드를 사용하여 `id` 및 `text`라는 두 개의 속성을 선언합니다.
          컴파일러는 이러한 속성 모두에 대해 getter를 자동으로 생성합니다.
          `Message` 클래스의 인스턴스가 생성된 후에는 이러한 속성의 값을 다시 할당할 수 없습니다.
</p>
<h3>Nullable 유형 – String?</h3>
<p>
   Kotlin은 <a href="null-safety#nullable-types-and-non-nullable-types">nullable 유형에 대한 기본 제공 지원</a>을 제공합니다. Kotlin에서 유형 시스템은 `null`을 포함할 수 있는 참조(<i>nullable 참조</i>)와 포함할 수 없는 참조(<i>non-nullable 참조</i>)를 구별합니다.<br/>
          예를 들어 `String` 유형의 일반 변수는 `null`을 포함할 수 없습니다. null을 허용하려면 변수를 `String?`로 작성하여 nullable 문자열로 선언할 수 있습니다.
</p>
<p>
   `Message` 클래스의 `id` 속성은 이번에는 nullable 유형으로 선언됩니다.
          따라서 `id`에 대한 값으로 `null`을 전달하여 `Message` 클래스의 인스턴스를 만들 수 있습니다.
</p>
          ```kotlin
Message(null, "Hello!")
```
       
   
2. `MessageController.kt` 파일에서 `index()` 함수 대신 `Message` 객체 목록을 반환하는 `listMessages()` 함수를 만듭니다.

    ```kotlin
    // MessageController.kt
    package demo
   
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
<h3>컬렉션 – listOf()</h3>
<p>
   Kotlin 표준 라이브러리는 기본 컬렉션 유형(세트, 목록 및 맵)에 대한 구현을 제공합니다.<br/>
          한 쌍의 인터페이스는 각 컬렉션 유형을 나타냅니다.
</p>
<list>
<li>컬렉션 요소에 액세스하기 위한 작업을 제공하는 <i>read-only</i> 인터페이스입니다.</li>
<li>해당 read-only 인터페이스를 확장하여 요소 추가, 제거 및 업데이트와 같은 쓰기 작업을 수행하는 <i>mutable</i> 인터페이스입니다.</li>
</list>
<p>
   해당 팩토리 함수는 Kotlin 표준 라이브러리에서 이러한 컬렉션의 인스턴스를 만들기 위해 제공됩니다.
</p>
<p>
   이 튜토리얼에서는 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html">`listOf()`</a> 함수를 사용하여 `Message` 객체 목록을 만듭니다.
          이것은 객체의 <i>read-only</i> 목록을 만드는 팩토리 함수입니다. 목록에서 요소를 추가하거나 제거할 수 없습니다.<br/>
          목록에서 쓰기 작업을 수행해야 하는 경우 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html">`mutableListOf()`</a> 함수를 호출하여 mutable 목록 인스턴스를 만듭니다.
</p>
<h3>후행 쉼표</h3>
<p>
   <a href="coding-conventions#trailing-commas">후행 쉼표(trailing comma)</a>는 일련의 요소의 <b>마지막 항목</b> 뒤에 있는 쉼표 기호입니다.
</p>
            ```kotlin
Message("3", "Privet!"),
```
<p>
   이것은 Kotlin 구문의 편리한 기능이며 완전히 선택 사항입니다. 코드는 후행 쉼표 없이도 계속 작동합니다.
</p>
<p>
   위의 예에서 `Message` 객체 목록을 만드는 데는 마지막 `listOf()` 함수 인수 뒤에 후행 쉼표가 포함됩니다.
</p>
       
    

`MessageController`의 응답은 이제 `Message` 객체의 컬렉션을 포함하는 JSON 문서가 됩니다.

:::note
Jackson 라이브러리가 클래스 경로에 있는 경우 Spring 애플리케이션의 모든 컨트롤러는 기본적으로 JSON 응답을 렌더링합니다.
[`build.gradle.kts` 파일에서 `spring-boot-starter-web` 종속성을 지정했으므로](jvm-create-project-with-spring-boot#explore-the-project-gradle-build-file) Jackson을 _transitive_ 종속성으로 받았습니다.
따라서 엔드포인트가 JSON으로 직렬화될 수 있는 데이터 구조를 반환하는 경우 애플리케이션은 JSON 문서를 응답합니다.

:::

다음은 `DemoApplication.kt`, `MessageController.kt` 및 `Message.kt` 파일의 전체 코드입니다.

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
// MessageController.kt
package demo

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

```kotlin
// Message.kt
package demo

data class Message(val id: String?, val text: String)
```

## 애플리케이션 실행

Spring 애플리케이션을 실행할 준비가 되었습니다.

1. 애플리케이션을 다시 실행합니다.

2. 애플리케이션이 시작되면 다음 URL을 엽니다.

    ```text
    http://localhost:8080
    ```

    JSON 형식의 메시지 컬렉션이 있는 페이지가 표시됩니다.

    <img src="/img/messages-in-json-format.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

## 다음 단계

튜토리얼의 다음 파트에서는 프로젝트에 데이터베이스를 추가 및 구성하고 HTTP 요청을 합니다.

**[다음 장으로 진행](jvm-spring-boot-add-db-support)**