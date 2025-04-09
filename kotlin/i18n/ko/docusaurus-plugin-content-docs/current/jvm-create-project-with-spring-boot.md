---
title: "Kotlin으로 Spring Boot 프로젝트 생성하기"
description: "IntelliJ IDEA를 사용하여 Kotlin으로 Spring Boot 애플리케이션을 생성합니다."
---
:::info
<p>
   본 튜토리얼은 <strong>Spring Boot 및 Kotlin 시작하기</strong>의 첫 번째 파트입니다.
</p><br/>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>Kotlin으로 Spring Boot 프로젝트 생성</strong><br/><img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> Spring Boot 프로젝트에 data class 추가<br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> Spring Boot 프로젝트에 데이터베이스 지원 추가<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 데이터베이스 액세스를 위해 Spring Data CrudRepository 사용<br/>
</p>

:::

튜토리얼의 첫 번째 파트에서는 Project Wizard를 사용하여 IntelliJ IDEA에서 Spring Boot 프로젝트를 만드는 방법을 보여줍니다.

## 시작하기 전에

최신 버전의 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)을 다운로드하여 설치하세요.

:::note
IntelliJ IDEA Community Edition 또는 다른 IDE를 사용하는 경우 [웹 기반 프로젝트 생성기](https://start.spring.io)를 사용하여 Spring Boot 프로젝트를 생성할 수 있습니다.

:::

## Spring Boot 프로젝트 생성

IntelliJ IDEA Ultimate Edition의 Project Wizard를 사용하여 Kotlin으로 새 Spring Boot 프로젝트를 생성합니다.

:::note
[Spring Boot 플러그인이 설치된 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html)를 사용하여 새 프로젝트를 생성할 수도 있습니다.

:::

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2. 왼쪽 패널에서 **New Project** | **Spring Boot**를 선택합니다.
3. Project Wizard 창에서 다음 필드와 옵션을 지정합니다.
   
   * **Name**: demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 이 옵션은 빌드 시스템과 DSL을 지정합니다.
     >
     

   * **Package name**: demo
   * **JDK**: Java JDK
     
     > 이 튜토리얼에서는 **Amazon Corretto version 21**을 사용합니다.
     > JDK가 설치되어 있지 않은 경우 드롭다운 목록에서 다운로드할 수 있습니다.
     >
     
   
   * **Java**: 17

   <img src="/img/create-spring-boot-project.png" alt="Create Spring Boot project" width="800" style={{verticalAlign: 'middle'}}/>

4. 모든 필드를 지정했는지 확인하고 **Next**를 클릭합니다.

5. 튜토리얼에 필요한 다음 종속성을 선택합니다.

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   <img src="/img/set-up-spring-boot-project.png" alt="Set up Spring Boot project" width="800" style={{verticalAlign: 'middle'}}/>

6. **Create**를 클릭하여 프로젝트를 생성하고 설정합니다.

   > IDE가 새 프로젝트를 생성하고 엽니다. 프로젝트 종속성을 다운로드하고 가져오는 데 시간이 걸릴 수 있습니다.
   >
    

7. 완료되면 **Project view**에서 다음 구조를 확인할 수 있습니다.

   <img src="/img/spring-boot-project-view.png" alt="Set up Spring Boot project" width="400" style={{verticalAlign: 'middle'}}/>

   생성된 Gradle 프로젝트는 Maven의 표준 디렉터리 레이아웃에 해당합니다.
   * 애플리케이션에 속하는 패키지와 클래스가 `main/kotlin` 폴더 아래에 있습니다.
   * 애플리케이션의 진입점은 `DemoApplication.kt` 파일의 `main()` 메서드입니다.

## 프로젝트 Gradle 빌드 파일 탐색

`build.gradle.kts` 파일을 엽니다. 이 파일은 애플리케이션에 필요한 종속성 목록을 포함하는 Gradle Kotlin 빌드 스크립트입니다.

Gradle 파일은 Spring Boot에 표준이지만 kotlin-spring Gradle 플러그인(`kotlin("plugin.spring")`)을 포함하여 필요한 Kotlin 종속성도 포함합니다.

다음은 모든 부분과 종속성에 대한 설명이 포함된 전체 스크립트입니다.

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.24" // The version of Kotlin to use
    kotlin("plugin.spring") version "1.9.24" // The Kotlin Spring plugin
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin") // Jackson extensions for Kotlin for working with JSON
    implementation("org.jetbrains.kotlin:kotlin-reflect") // Kotlin reflection library, required for working with Spring
    runtimeOnly("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict") // `-Xjsr305=strict` enables the strict mode for JSR-305 annotations
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

보시다시피 Gradle 빌드 파일에 몇 가지 Kotlin 관련 아티팩트가 추가되었습니다.

1. `plugins` 블록에는 두 개의 Kotlin 아티팩트가 있습니다.

   * `kotlin("jvm")` – 플러그인은 프로젝트에서 사용할 Kotlin 버전을 정의합니다.
   * `kotlin("plugin.spring")` – Spring Framework 기능과 호환되도록 Kotlin 클래스에 `open` modifier를 추가하기 위한 Kotlin Spring compiler plugin

2. `dependencies` 블록에는 몇 가지 Kotlin 관련 모듈이 나열되어 있습니다.

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 모듈은 Kotlin 클래스 및 data class의 직렬화 및 역직렬화에 대한 지원을 추가합니다.
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin reflection library

3. 종속성 섹션 다음에 `kotlin` 플러그인 구성 블록이 표시됩니다.
   여기에서 컴파일러에 추가 인수를 추가하여 다양한 언어 기능을 활성화하거나 비활성화할 수 있습니다.

## 생성된 Spring Boot 애플리케이션 탐색

`DemoApplication.kt` 파일을 엽니다.

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
<h3>클래스 선언 – class DemoApplication</h3>
<p>
   패키지 선언 및 import 문 바로 뒤에 첫 번째 클래스 선언인 `class DemoApplication`이 표시됩니다.
</p>
<p>
   Kotlin에서 클래스에 멤버(속성 또는 함수)가 포함되어 있지 않으면 클래스 본문(`{}`)을 생략할 수 있습니다.
</p>
<h3>@SpringBootApplication annotation</h3>
<p>
   <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation">`@SpringBootApplication annotation`</a>은 Spring Boot 애플리케이션의 편의 annotation입니다.
      Spring Boot의 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">자동 구성</a>, <a href="https://docs.spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">component scan</a>을 활성화하고 "application class"에서 추가 구성을 정의할 수 있습니다.
</p>
<h3>프로그램 진입점 – main()</h3>
<p>
   <a href="basic-syntax#program-entry-point">`main()`</a> 함수는 애플리케이션의 진입점입니다.
</p>
<p>
   `DemoApplication` 클래스 외부의 <a href="functions#function-scope">최상위 함수</a>로 선언됩니다. `main()` 함수는 Spring의 `runApplication(*args)` 함수를 호출하여 Spring Framework로 애플리케이션을 시작합니다.
</p>
<h3>가변 인수 – args: Array&lt;String&gt;</h3>
<p>
   `runApplication()` 함수의 선언을 확인하면 함수의 매개변수가 <a href="functions#variable-number-of-arguments-varargs">`vararg` modifier</a>로 표시되어 있음을 알 수 있습니다. `vararg args: String`.
        이는 함수에 가변 개수의 String 인수를 전달할 수 있음을 의미합니다.
</p>
<h3>스프레드 연산자 – (*args)</h3>
<p>
   `args`는 String 배열로 선언된 `main()` 함수의 매개변수입니다.
        문자열 배열이 있고 해당 내용을 함수에 전달하려면 스프레드 연산자(별표 기호 `*`로 배열을 접두사로 붙임)를 사용합니다.
</p>
   

## 컨트롤러 생성

애플리케이션을 실행할 준비가 되었지만 먼저 해당 로직을 업데이트해 보겠습니다.

Spring 애플리케이션에서 컨트롤러는 웹 요청을 처리하는 데 사용됩니다.
`DemoApplication.kt` 파일과 동일한 패키지에 다음과 같이 `MessageController` 클래스가 있는 `MessageController.kt` 파일을 만듭니다.

```kotlin
// MessageController.kt
package demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```
<h3>@RestController annotation</h3>
<p>
   `MessageController`가 REST Controller임을 Spring에 알려야 하므로 `@RestController` annotation으로 표시해야 합니다.
</p>
<p>
   이 annotation은 이 클래스가 `DemoApplication` 클래스와 동일한 패키지에 있으므로 component scan에 의해 선택됨을 의미합니다.
</p>
<h3>@GetMapping annotation</h3>
<p>
   `@GetMapping`은 HTTP GET 호출에 해당하는 endpoint를 구현하는 REST 컨트롤러의 함수를 표시합니다.
</p>
      ```kotlin
@GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
```
<h3>@RequestParam annotation</h3>
<p>
   함수 매개변수 `name`은 `@RequestParam` annotation으로 표시됩니다. 이 annotation은 메서드 매개변수를 웹 요청 매개변수에 바인딩해야 함을 나타냅니다.
</p>
<p>
   따라서 루트에서 애플리케이션에 액세스하고 `/?name=&lt;your-value&gt;`와 같이 "name"이라는 요청 매개변수를 제공하면 매개변수 값이 `index()` 함수를 호출하기 위한 인수로 사용됩니다.
</p>
<h3>단일 표현식 함수 – index()</h3>
<p>
   `index()` 함수에 문이 하나만 포함되어 있으므로 <a href="functions#single-expression-functions">단일 표현식 함수</a>로 선언할 수 있습니다.
</p>
<p>
   이는 중괄호를 생략할 수 있고 본문이 등호 `=` 뒤에 지정됨을 의미합니다.
</p>
<h3>함수 반환 유형에 대한 유형 추론</h3>
<p>
   `index()` 함수는 반환 유형을 명시적으로 선언하지 않습니다. 대신 컴파일러는 등호 `=`의 오른쪽에서 문의 결과를 살펴 반환 유형을 추론합니다.
</p>
<p>
   `Hello, $name!` 표현식의 유형은 `String`이므로 함수의 반환 유형도 `String`입니다.
</p>
<h3>문자열 템플릿 – $name</h3>
<p>
   `Hello, $name!` 표현식을 Kotlin에서는 <a href="strings#string-templates"><i>문자열 템플릿</i></a>이라고 합니다.
</p>
<p>
   문자열 템플릿은 포함된 표현식이 포함된 문자열 리터럴입니다.
</p>
<p>
   이는 문자열 연결 작업을 위한 편리한 대체 방법입니다.
</p>
   

## 애플리케이션 실행

이제 Spring 애플리케이션을 실행할 준비가 되었습니다.

1. `main()` 메서드 옆의 여백에 있는 녹색 Run 아이콘을 클릭합니다.

    <img src="/img/run-spring-boot-application.png" alt="Run Spring Boot application" width="706" style={{verticalAlign: 'middle'}}/>
    
    > 터미널에서 `./gradlew bootRun` 명령을 실행할 수도 있습니다.
    >
    

    그러면 컴퓨터에서 로컬 서버가 시작됩니다.

2. 애플리케이션이 시작되면 다음 URL을 엽니다.

    ```text
    http://localhost:8080?name=John
    ```

    "Hello, John!"이 응답으로 인쇄되어 표시됩니다.

    <img src="/img/spring-application-response.png" alt="Spring Application response" width="706" style={{verticalAlign: 'middle'}}/>

## 다음 단계

튜토리얼의 다음 파트에서는 Kotlin data class와 애플리케이션에서 사용하는 방법에 대해 알아봅니다.

**[다음 챕터로 진행](jvm-spring-boot-add-data-class)**