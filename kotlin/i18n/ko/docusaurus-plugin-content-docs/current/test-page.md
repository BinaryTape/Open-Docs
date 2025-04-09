---
title: "테스트 페이지"
description: "이 페이지는 테스트 목적으로만 사용됩니다."
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::info
<p>
   이것은 이미지 블록입니다 (<strong>Getting started with Compose Multiplatform</strong> 튜토리얼에서 가져옴).
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">Kotlin으로 Spring Boot 프로젝트 생성</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">Spring Boot 프로젝트에 데이터 클래스 추가</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>Spring Boot 프로젝트에 데이터베이스 지원 추가</strong><br/>
      <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepository를 사용하여 데이터베이스 액세스><br/>
</p>

:::

## 동기화된 탭

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("kapt") version "1.9.23"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "1.9.23"
}
```

</TabItem>
</Tabs>

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "1.9.23"
}
```

</TabItem>
</Tabs>

## 섹션

### 축소된 섹션

여기에 일부 텍스트와 코드 블록이 있습니다:

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## 코드 블록

단순한 코드 블록:

```kotlin
    import java.util.*

@Service
class MessageService(val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): List<Message> = db.findById(id).toList()

    fun save(message: Message) {
        db.save(message)
    }

    fun <T : Any> Optional<out T>.toList(): List<T> =
        if (isPresent) listOf(get()) else emptyList()
}
```

### 확장 가능한 코드 블록

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```

### 실행 가능한 코드 블록

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)

    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)

}
```

## 테이블

### Markdown 테이블

| Primitive-type array                                                                  | Equivalent in Java |
|---------------------------------------------------------------------------------------|--------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`        |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`           |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`           |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`         |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`          |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`            |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`           |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`          |

### XML 테이블
<table>
<tr>
<td>
<strong>최종 수정일</strong>
</td>
<td>
<strong>2023년 12월</strong>
</td>
</tr>
<tr>
<td>
<strong>다음 업데이트</strong>
</td>
<td>
<strong>2024년 6월</strong>
</td>
</tr>
</table>

### XML 테이블 (코드 블록 포함)

간단한 테이블:
<table>
<tr>
<td>
이전
</td>
<td>
현재
</td>
</tr>
<tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```
</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```
</td>
</tr>
</table>

더 복잡한 테이블:
<table>
<tr>
<td>
</td>
<td>
이전
</td>
<td>
현재
</td>
</tr>
<tr>
<td rowspan="2">
`jvmMain` 컴파일의 종속성
</td>
<td>

```kotlin
jvm<Scope>
```
</td>
<td>

```kotlin
jvmCompilation<Scope>
```
</td>
</tr>
<tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```
</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```
</td>
</tr>
<tr>
<td>
`jvmMain` 소스 세트의 종속성
</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```
</td>
</tr>
<tr>
<td>
`jvmTest` 컴파일의 종속성
</td>
<td>

```kotlin
jvmTest<Scope>
```
</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```
</td>
</tr>
<tr>
<td>
`jvmTest` 소스 세트의 종속성
</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```
</td>
</tr>
</table>

## 목록

### 순서가 있는 목록

1. 하나
2. 둘
3. 셋
    1. 셋 포인트 1
    2. 셋 포인트 2
    3. 셋 포인트 3
        1. 셋 포인트 1 및 1
4. 코드 블록 포함:

   ```kotlin
   jvmTest<Scope>
   ```

### 순서가 없는 목록

* 첫 번째 글머리 기호
* 두 번째 글머리 기호
* 세 번째 글머리 기호
    * 하나 더
    * 또 다른 것
        * 와, 하나 더
* 코드 블록 포함:

   ```kotlin
   jvmTest<Scope>
   ```

### 정의 목록
<h3>접을 수 있는 항목 #1</h3>
<p>
   `CrudRepository` 인터페이스에서 `findById()` 함수의 반환 유형은 `Optional` 클래스의 인스턴스입니다. 그러나 일관성을 위해 단일 메시지가 있는 `List`를 반환하는 것이 편리합니다. 이를 위해 `Optional` 값이 있으면 래핑 해제하고 값과 함께 목록을 반환해야 합니다. 이는 `Optional` 유형에 대한 <a href="extensions#extension-functions">확장 함수</a>로 구현할 수 있습니다.
</p>
<p>
   코드에서 `Optional&lt;out T&gt;.toList()`, `.toList()`는 `Optional`에 대한 확장 함수입니다. 확장 함수를 사용하면 모든 클래스에 추가 함수를 작성할 수 있으며, 특히 일부 라이브러리 클래스의 기능을 확장하려는 경우에 유용합니다.
</p>
<h3>접을 수 있는 항목 #2</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">이 함수는</a> 새 객체에 데이터베이스에 id가 없다고 가정하고 작동합니다. 따라서 삽입하려면 id가 <b>null이어야 합니다</b>.
</p>
<p>
   id가 <i>null</i>이 아니면 `CrudRepository`는 객체가 이미 데이터베이스에 존재하고 이것이 <i>삽입</i> 작업이 아닌 <i>업데이트</i> 작업이라고 가정합니다. 삽입 작업 후에는 데이터 저장소에서 `id`가 생성되어 `Message` 인스턴스에 다시 할당됩니다. 이것이 `id` 속성을 `var` 키워드를 사용하여 선언해야 하는 이유입니다.
</p>
<p>
</p>
   

## 텍스트 요소

* **굵은 텍스트**
* _기울임꼴 텍스트_
* `inline code`
* [internal anchor](#lists)
* [internal link](roadmap)
* [external link](https://jetbrains.com)
* 이모지 ❌✅🆕

## 변수
* 변수 사용: 최신 Kotlin 버전은 2.1.20입니다.

## 포함된 요소

### YouTube 동영상

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

### 사진

일반 (Markdown):

<img src="/img/create-test.png" alt="Create a test" width="700" style={{verticalAlign: 'middle'}}/>

일반 (XML):

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

인라인:

<img src="/img/youtrack-logo.png" alt="YouTrack" width="30" style={{verticalAlign: 'middle'}}/>

확대/축소 가능:

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="700" style={{verticalAlign: 'middle'}}/>

버튼 스타일:

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="Create a project" />
</a>

## 참고

경고:

:::note
kapt 컴파일러 플러그인의 K2 지원은 [실험적](components-stability)입니다.
옵트인이 필요하며 (자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.

참고:

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리 (예: Foundation, UIKit, POSIX)의 경우 일부 API만 `@ExperimentalForeignApi`로 옵트인이 필요합니다. 이러한 경우 옵트인 요구 사항과 함께 경고가 표시됩니다.

:::

팁:

:::tip
Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리 (예: Foundation, UIKit, POSIX)의 경우 일부 API만 `@ExperimentalForeignApi`로 옵트인이 필요합니다. 이러한 경우 옵트인 요구 사항과 함께 경고가 표시됩니다.

:::