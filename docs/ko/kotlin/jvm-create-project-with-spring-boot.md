[//]: # (title: Kotlin으로 Spring Boot 프로젝트 생성하기)

<web-summary>IntelliJ IDEA를 사용하여 Kotlin으로 Spring Boot 애플리케이션을 생성합니다.</web-summary>

<tldr>
    <p>이것은 **Spring Boot와 Kotlin 시작하기** 튜토리얼의 첫 번째 부분입니다:</p><br/>
    <p><img src="icon-1.svg" width="20" alt="First step"/> **Kotlin으로 Spring Boot 프로젝트 생성하기**<br/><img src="icon-2-todo.svg" width="20" alt="Second step"/> Spring Boot 프로젝트에 데이터 클래스 추가하기<br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Spring Boot 프로젝트에 데이터베이스 지원 추가하기<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepository를 사용하여 데이터베이스 액세스하기<br/></p>
</tldr>

이 튜토리얼의 첫 번째 부분은 IntelliJ IDEA에서 프로젝트 마법사(Project Wizard)를 사용하여 Gradle로 Spring Boot 프로젝트를 생성하는 방법을 보여줍니다.

> 이 튜토리얼은 Gradle을 빌드 시스템으로 사용할 것을 요구하지 않습니다. Maven을 사용하더라도 동일한 단계를 따를 수 있습니다.
> 
{style="note"}

## 시작하기 전에

[IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치하세요.

> IntelliJ IDEA Community Edition 또는 다른 IDE를 사용하는 경우, [웹 기반 프로젝트 생성기](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)를 사용하여 Spring Boot 프로젝트를 생성할 수 있습니다.
> 
{style="tip"}

## Spring Boot 프로젝트 생성하기

IntelliJ IDEA Ultimate Edition에서 프로젝트 마법사를 사용하여 Kotlin으로 새 Spring Boot 프로젝트를 생성하세요:

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택하세요. 
2. 왼쪽 패널에서 **New Project** | **Spring Boot**를 선택하세요.
3. **New Project** 창에서 다음 필드와 옵션을 지정하세요:
   
   * **Name**: demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 이 옵션은 빌드 시스템과 DSL을 지정합니다.
     >
     {style="tip"}

   * **Package name**: com.example.demo
   * **JDK**: Java JDK
     
     > 이 튜토리얼은 **Amazon Corretto 버전 23**을 사용합니다.
     > JDK가 설치되어 있지 않다면, 드롭다운 목록에서 다운로드할 수 있습니다.
     >
     {style="note"}
   
   * **Java**: 17
   
     > Java 17이 설치되어 있지 않다면, JDK 드롭다운 목록에서 다운로드할 수 있습니다.
     >
     {style="tip"}

   ![Spring Boot 프로젝트 생성](create-spring-boot-project.png){width=800}

4. 모든 필드를 지정했는지 확인하고 **Next**를 클릭하세요.

5. 튜토리얼에 필요한 다음 의존성(dependency)을 선택하세요:

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   ![Spring Boot 프로젝트 설정](set-up-spring-boot-project.png){width=800}

6. **Create**를 클릭하여 프로젝트를 생성하고 설정하세요.

   > IDE가 새 프로젝트를 생성하고 엽니다. 프로젝트 의존성을 다운로드하고 가져오는 데 시간이 걸릴 수 있습니다.
   >
   {style="tip"} 

7. 이후, **Project view**에서 다음 구조를 확인할 수 있습니다:

   ![Spring Boot 프로젝트 설정](spring-boot-project-view.png){width=400}

   생성된 Gradle 프로젝트는 Maven의 표준 디렉터리 레이아웃과 일치합니다:
   * 애플리케이션에 속하는 패키지와 클래스는 `main/kotlin` 폴더 아래에 있습니다.
   * 애플리케이션의 진입점은 `DemoApplication.kt` 파일의 `main()` 메서드입니다.

## 프로젝트 Gradle 빌드 파일 살펴보기 {initial-collapse-state="collapsed" collapsible="true"}

`build.gradle.kts` 파일을 엽니다: 이 파일은 애플리케이션에 필요한 의존성 목록을 포함하는 Gradle Kotlin 빌드 스크립트입니다.

Gradle 파일은 Spring Boot의 표준이지만, `kotlin("plugin.spring")`과 같은 kotlin-spring Gradle 플러그인을 포함하여 필요한 Kotlin 의존성도 포함합니다.

다음은 모든 부분과 의존성에 대한 설명이 포함된 전체 스크립트입니다:

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "%springBootSupportedKotlinVersion%" // The version of Kotlin to use
    kotlin("plugin.spring") version "%springBootSupportedKotlinVersion%" // The Kotlin Spring plugin
    id("org.springframework.boot") version "%springBootVersion%"
    id("io.spring.dependency-management") version "1.1.7"
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

보시다시피, Gradle 빌드 파일에는 몇 가지 Kotlin 관련 아티팩트가 추가되어 있습니다:

1. `plugins` 블록에는 두 개의 Kotlin 아티팩트가 있습니다:

   * `kotlin("jvm")` – 프로젝트에서 사용할 Kotlin 버전을 정의하는 플러그인
   * `kotlin("plugin.spring")` – Kotlin 클래스에 `open` 수정자를 추가하여 Spring Framework 기능과 호환되도록 하는 Kotlin Spring 컴파일러 플러그인

2. `dependencies` 블록에는 몇 가지 Kotlin 관련 모듈이 나열되어 있습니다:

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – Kotlin 클래스 및 데이터 클래스의 직렬화 및 역직렬화를 지원하는 모듈
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 리플렉션 라이브러리

3. 의존성 섹션 다음에는 `kotlin` 플러그인 구성 블록을 볼 수 있습니다.
   여기에서 컴파일러에 추가 인수를 추가하여 다양한 언어 기능을 활성화하거나 비활성화할 수 있습니다.

Kotlin 컴파일러 옵션에 대한 자세한 내용은 [](gradle-compiler-options.md)에서 확인할 수 있습니다.

## 생성된 Spring Boot 애플리케이션 살펴보기

`DemoApplication.kt` 파일을 엽니다:

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

<deflist collapsible="true">
   <def title="클래스 선언하기 – class DemoApplication">
      <p>패키지 선언과 임포트 문 바로 뒤에 첫 번째 클래스 선언인 `class DemoApplication`을 볼 수 있습니다.</p>
      <p>Kotlin에서 클래스에 멤버(프로퍼티 또는 함수)가 포함되지 않으면 클래스 본문(`{}`)을 완전히 생략할 수 있습니다.</p>
   </def>
   <def title="@SpringBootApplication 애노테이션">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation">`@SpringBootApplication` 애노테이션</a>은 Spring Boot 애플리케이션의 편의 애노테이션입니다.
      이 애노테이션은 Spring Boot의 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">자동 구성</a>, <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">컴포넌트 스캔</a>을 활성화하고 "애플리케이션 클래스"에 추가 구성을 정의할 수 있도록 합니다.
      </p>
   </def>
   <def title="프로그램 진입점 – main()">
      <p>[<a href="basic-syntax.md#program-entry-point">`main()`</a>] 함수는 애플리케이션의 진입점입니다.</p>
      <p>`DemoApplication` 클래스 외부에 [<a href="functions.md#function-scope">최상위 함수</a>]로 선언됩니다. `main()` 함수는 Spring Framework를 사용하여 애플리케이션을 시작하기 위해 Spring의 `runApplication(*args)` 함수를 호출합니다.</p>
   </def>
   <def title="가변 인자 – args: Array&lt;String&gt;">
      <p>`runApplication()` 함수의 선언을 확인하면, 함수의 매개변수가 [<a href="functions.md#variable-number-of-arguments-varargs">`vararg` 수정자</a>]로 표시되어 있는 것을 볼 수 있습니다: `vararg args: String`.
        이는 함수에 가변 개수의 String 인자를 전달할 수 있음을 의미합니다.
      </p>
   </def>
   <def title="스프레드 연산자 – (*args)">
      <p>`args`는 String 배열로 선언된 `main()` 함수의 매개변수입니다.
        String 배열이 있고 그 내용을 함수에 전달하고자 할 때, 스프레드 연산자(배열 앞에 별표 기호 `*`를 붙입니다)를 사용하세요.
      </p>
   </def>
</deflist>

## 컨트롤러 생성하기

애플리케이션은 실행할 준비가 되었지만, 먼저 로직을 업데이트해 봅시다.

Spring 애플리케이션에서 컨트롤러는 웹 요청을 처리하는 데 사용됩니다.
동일한 패키지에 `DemoApplication.kt` 파일 옆에 다음과 같이 `MessageController` 클래스를 포함하는 `MessageController.kt` 파일을 생성하세요:

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```

<deflist collapsible="true">
   <def title="@RestController 애노테이션">
      <p>Spring에게 `MessageController`가 REST 컨트롤러임을 알려야 하므로, `@RestController` 애노테이션으로 표시해야 합니다.</p>
      <p>이 애노테이션은 `DemoApplication` 클래스와 동일한 패키지에 있기 때문에 이 클래스가 컴포넌트 스캔에 의해 감지될 것임을 의미합니다.</p>
   </def>
   <def title="@GetMapping 애노테이션">
      <p>`@GetMapping`은 HTTP GET 호출에 해당하는 엔드포인트를 구현하는 REST 컨트롤러의 함수를 표시합니다:</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="@RequestParam 애노테이션">
      <p>함수 매개변수 `name`은 `@RequestParam` 애노테이션으로 표시됩니다. 이 애노테이션은 메서드 매개변수가 웹 요청 매개변수에 바인딩되어야 함을 나타냅니다.</p>
      <p>따라서 루트에서 애플리케이션에 접근하고 `/?name=<your-value>`와 같이 "name"이라는 요청 매개변수를 제공하면, 해당 매개변수 값이 `index()` 함수를 호출하는 인자로 사용됩니다.</p>
   </def>
   <def title="단일 표현식 함수 – index()">
      <p>`index()` 함수는 하나의 문장만 포함하므로, [<a href="functions.md#single-expression-functions">단일 표현식 함수</a>]로 선언할 수 있습니다.</p>
      <p>이는 중괄호를 생략하고 등호(`=`) 뒤에 본문을 지정할 수 있음을 의미합니다.</p>
   </def>
   <def title="함수 반환 타입에 대한 타입 추론">
      <p>`index()` 함수는 반환 타입을 명시적으로 선언하지 않습니다. 대신, 컴파일러는 등호(`=`)의 오른쪽에 있는 문장의 결과를 보고 반환 타입을 추론합니다.</p>
      <p>`Hello, $name!` 표현식의 타입은 `String`이며, 따라서 함수의 반환 타입도 `String`입니다.</p>
   </def>
   <def title="문자열 템플릿 – $name">
      <p>`Hello, $name!` 표현식은 Kotlin에서 [<a href="strings.md#string-templates"><i>문자열 템플릿</i></a>]이라고 불립니다.</p>
      <p>문자열 템플릿은 포함된 표현식을 포함하는 문자열 리터럴입니다.</p>
      <p>이는 문자열 연결 연산을 편리하게 대체할 수 있습니다.</p>
   </def>
</deflist>

## 애플리케이션 실행하기

이제 Spring 애플리케이션을 실행할 준비가 되었습니다:

1. `DemoApplication.kt` 파일에서 `main()` 메서드 옆의 거터에 있는 녹색 **Run** 아이콘을 클릭하세요:

    ![Spring Boot 애플리케이션 실행](run-spring-boot-application.png){width=706}
    
    > 터미널에서 `./gradlew bootRun` 명령을 실행할 수도 있습니다.
    >
    {style="tip"}

    이렇게 하면 컴퓨터에서 로컬 서버가 시작됩니다.

2. 애플리케이션이 시작되면 다음 URL을 여세요:

    ```text
    http://localhost:8080?name=John
    ```

    "Hello, John!"이 응답으로 출력되는 것을 볼 수 있습니다:

    ![Spring 애플리케이션 응답](spring-application-response.png){width=706}

## 다음 단계

이 튜토리얼의 다음 부분에서는 Kotlin 데이터 클래스와 이를 애플리케이션에서 사용하는 방법에 대해 알아볼 것입니다.

**[다음 챕터로 진행하기](jvm-spring-boot-add-data-class.md)**