[//]: # (title: 테스트 페이지)

<web-summary>이 페이지는 테스트 목적으로만 사용됩니다.</web-summary>

<no-index/>

<tldr>
   <p>이 블록은 이미지를 포함하고 있습니다 (<strong>Getting started with Compose Multiplatform</strong> 튜토리얼에서 가져옴).</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Kotlin으로 Spring Boot 프로젝트 생성하기</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Spring Boot 프로젝트에 데이터 클래스 추가하기</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>Spring Boot 프로젝트에 데이터베이스 지원 추가하기</strong><br/>
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 데이터베이스 액세스에 Spring Data CrudRepository 사용하기><br/>
    </p>
</tldr>

## 동기화된 탭

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("kapt") version "1.9.23"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "1.9.23"
}
```

</tab>
</tabs>

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "1.9.23"
}
```

</tab>
</tabs>

## 섹션

### 접힌 섹션 {initial-collapse-state="collapsed" collapsible="true"}

여기에 몇몇 텍스트와 코드 블록:

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## 코드 블록

그냥 코드 블록:

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
{initial-collapse-state="collapsed" collapsible="true"}

### 실행 가능한 코드 블록

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // 출력을 쉽게 읽을 수 있도록 toString() 함수를 자동으로 사용합니다.
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 표

### 마크다운 표

| 기본 타입 배열                                                                  | Java에서의 동등 타입 |
|---------------------------------------------------------------------------------------|--------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`        |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`           |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`           |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`         |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`          |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`            |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`           |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`          |

### XML 표

<table>
    <tr>
        <td><strong>최종 수정일</strong></td>
        <td><strong>2023년 12월</strong></td>
    </tr>
    <tr>
        <td><strong>다음 업데이트</strong></td>
        <td><strong>2024년 6월</strong></td>
    </tr>
</table>

### 코드 블록이 포함된 XML 표

간단한 표:

<table>
    <tr>
        <td>이전</td>
        <td>현재</td>
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

더 복잡한 표:

<table>
    <tr>
        <td></td>
        <td>이전</td>
        <td>현재</td>
    </tr>
    <tr>
        <td rowspan="2"><code>jvmMain</code> 컴파일의 의존성</td>
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
        <td><code>jvmMain</code> 소스 세트의 의존성</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 컴파일의 의존성</td>
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
        <td><code>jvmTest</code> 소스 세트의 의존성</td>
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
    1. 셋-1
    2. 셋-2
    3. 셋-3
        1. 셋-1-1
4. 코드 블록 포함:

   ```kotlin
   jvmTest<Scope>
   ```

### 순서가 없는 목록

* 첫 번째 항목
* 두 번째 항목
* 세 번째 항목
    * 추가 항목
    * 또 다른 항목
        * 와우, 하나 더
* 코드 블록 포함:

   ```kotlin
   jvmTest<Scope>
   ```

### 정의 목록

<deflist collapsible="true">
   <def title="접을 수 있는 항목 #1">
      <p><code>CrudRepository</code> 인터페이스의 <code>findById()</code> 함수의 반환 타입은 <code>Optional</code> 클래스의 인스턴스입니다. 하지만 일관성을 위해 단일 메시지를 포함하는 <code>List</code>를 반환하는 것이 편리합니다. 이를 위해서는 <code>Optional</code> 값이 존재할 경우 해당 값을 풀고(unwrap) 값을 포함하는 리스트를 반환해야 합니다. 이는 <code>Optional</code> 타입에 대한 <a href="extensions.md#extension-functions">확장 함수</a>로 구현될 수 있습니다.</p>
      <p>코드에서 <code>Optional&lt;out T&gt;.toList()</code> 중 <code>.toList()</code>는 <code>Optional</code>에 대한 확장 함수입니다. 확장 함수를 사용하면 모든 클래스에 추가 함수를 작성할 수 있으며, 이는 특히 일부 라이브러리 클래스의 기능을 확장하려는 경우에 유용합니다.</p>
   </def>
   <def title="접을 수 있는 항목 #2">
      <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">이 함수는</a> 새 객체에 데이터베이스에 ID가 없다는 가정 하에 작동합니다. 따라서 삽입을 위해 ID는 <b>null</b>이어야 합니다.</p>
      <p>ID가 <i>null</i>이 아니면, <code>CrudRepository</code>는 해당 객체가 데이터베이스에 이미 존재하며 이것이 <i>삽입</i> 작업이 아닌 <i>업데이트</i> 작업이라고 가정합니다. 삽입 작업 후에는 ID가 데이터 저장소에 의해 생성되어 <code>Message</code> 인스턴스에 다시 할당됩니다. 이것이 <code>id</code> 속성이 <code>var</code> 키워드를 사용하여 선언되어야 하는 이유입니다.</p>
      <p></p>
   </def>
</deflist>

## 텍스트 요소

* **굵은 텍스트**
* _기울임 텍스트_
* `인라인 코드`
* [내부 앵커](#lists)
* [내부 링크](roadmap.md)
* [외부 링크](https://jetbrains.com)
* 이모티콘 ❌✅🆕

## 변수
* 변수 사용: 최신 Kotlin 버전은 %kotlinVersion% 입니다.

## 임베디드 요소

### YouTube 비디오

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20의 새로운 기능"/>

### 그림

일반 (마크다운):

![테스트 생성](create-test.png){width="700"}

일반 (XML):

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

인라인:

![YouTrack](youtrack-logo.png){width=30}{type="joined"}

확대 가능:

![클래스 다이어그램](ksp-class-diagram.svg){thumbnail="true" width="700" thumbnail-same-file="true"}

버튼 스타일:

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="프로젝트 생성" style="block"/>
</a>

## 노트

경고:

> kapt 컴파일러 플러그인의 K2 지원은 [실험적 기능](components-stability.md)입니다.
> 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

참고:

> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)의 경우, 일부 API만 `@ExperimentalForeignApi`를 통한 옵트인이 필요합니다. 이러한 경우, 옵트인 요구 사항에 대한 경고가 표시됩니다.
>
{style="note"}

팁:

> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)의 경우, 일부 API만 `@ExperimentalForeignApi`를 통한 옵트인이 필요합니다. 이러한 경우, 옵트인 요구 사항에 대한 경고가 표시됩니다.
>
{style="tip"}