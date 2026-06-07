[//]: # (title: Java 프로젝트에 Kotlin 추가하기 – 튜토리얼)

<web-summary>기존 Java 프로젝트에 Kotlin 통합하기 - Maven 또는 Gradle 빌드 파일 구성, 소스 파일 구성, IntelliJ IDEA에서 Java 코드를 Kotlin으로 변환하는 방법을 알아봅니다.</web-summary>

Kotlin은 Java와 완전히 상호 운용 가능하므로, 모든 것을 새로 작성할 필요 없이 기존 Java 프로젝트에 점진적으로 도입할 수 있습니다.

이 튜토리얼에서는 다음 내용을 배웁니다:

* Java와 Kotlin 코드를 모두 컴파일할 수 있도록 Maven 또는 Gradle 빌드 도구를 설정합니다.
* 프로젝트 디렉터리에서 Java 및 Kotlin 소스 파일을 구성합니다.
* IntelliJ IDEA를 사용하여 Java 파일을 Kotlin으로 변환합니다.

> 이 튜토리얼을 위해 기존의 Java 프로젝트를 사용하거나, Maven 및 Gradle 빌드 파일이 이미 설정된 공개 [샘플 프로젝트](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)를 클론할 수 있습니다.
> 
> 또한, 우리가 [준비한 스킬](https://github.com/Kotlin/kotlin-agent-skills/blob/main/skills/kotlin-tooling-java-to-kotlin/SKILL.md)을 사용하여 선택한 AI 에이전트에게 변환 작업을 맡길 수도 있습니다. AI 처리 결과는 완전히 예측 가능하지 않을 수 있다는 점을 유의하세요.
>
{style="tip"}

## 프로젝트 구성

Java 프로젝트에 Kotlin을 추가하려면 사용하는 빌드 도구에 따라 Kotlin과 Java를 모두 사용하도록 프로젝트를 구성해야 합니다.

프로젝트 구성을 통해 Kotlin과 Java 코드가 모두 올바르게 컴파일되고 서로 원활하게 참조할 수 있도록 합니다.

### Maven

> **IntelliJ IDEA 2025.3**부터는 Maven 기반 Java 프로젝트에 첫 번째 Kotlin 파일을 추가할 때, IDE가 `pom.xml` 파일을 자동으로 업데이트하여 Kotlin Maven 플러그인과 표준 종속성을 포함합니다. 버전이나 빌드 단계를 사용자 정의하려는 경우 여전히 수동으로 구성할 수 있습니다.
>
{style="note"}

Maven 프로젝트에서 Kotlin과 Java를 함께 사용하려면, `pom.xml` 파일에 Kotlin Maven 플러그인을 적용하고 Kotlin 종속성을 추가하세요:

1. `<properties>` 섹션에 Kotlin 버전 속성을 추가합니다:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. `<dependencies>` 섹션에 필요한 종속성을 추가하고, `<plugins>` 섹션에 다음을 추가합니다:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,55"}

3. `<build><plugins>` 섹션에 Kotlin 플러그인을 추가합니다:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="57-58,95-96,99-107"}

   Kotlin Maven 플러그인에서 `<extensions>true</extensions>`를 활성화하면 다음과 같은 이점이 있습니다:

   * 프로젝트에 `kotlin-stdlib` 종속성을 자동으로 추가합니다.
   * Kotlin을 먼저 컴파일한 다음 Java를 컴파일하도록 실행 단계(execution phases)를 구성합니다.
   * Java 코드에서 Kotlin 코드를 참조하고 그 반대의 경우도 가능하게 합니다.
   * JVM 타겟 버전을 Java 컴파일러 버전과 자동으로 일치시킵니다.

   확장(extensions)이 포함된 Kotlin Maven 플러그인을 사용할 때는 `<build><pluginManagement>` 섹션에 별도의 `maven-compiler-plugin`이 필요하지 않습니다.

4. IDE에서 Maven 프로젝트를 다시 로드합니다.
5. 구성을 확인하기 위해 테스트를 실행합니다:

    ```bash
    ./mvnw clean test
    ```

### Gradle

Gradle 프로젝트에서 Kotlin과 Java를 함께 사용하려면, `build.gradle.kts` 파일에 Kotlin JVM 플러그인을 적용하고 Kotlin 종속성을 추가하세요:

1. `plugins {}` 블록에 Kotlin JVM 플러그인을 추가합니다:

    ```kotlin
    plugins {
        // Other plugins
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2. Java 버전과 일치하도록 JVM 툴체인(toolchain) 버전을 설정합니다:

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   이렇게 하면 Kotlin이 Java 코드와 동일한 JDK 버전을 사용하게 됩니다.

3. `dependencies {}` 블록에 Kotlin 테스트 유틸리티를 제공하고 JUnit과 통합되는 `kotlin("test")` 라이브러리를 추가합니다:

    ```kotlin
    dependencies {
        // Other dependencies
    
        testImplementation(kotlin("test"))
        // Other test dependencies
    }
    ```

4. IDE에서 Gradle 프로젝트를 다시 로드합니다.
5. 구성을 확인하기 위해 테스트를 실행합니다:

    ```bash
    ./gradlew clean test
    ```

## 프로젝트 구조

이 구성을 사용하면 동일한 소스 디렉터리에 Java와 Kotlin 파일을 혼합하여 사용할 수 있습니다:

```none
src/
  ├── main/
  │    ├── java/          # Java 및 Kotlin 프로덕션 코드
  │    └── kotlin/        # 추가 Kotlin 프로덕션 코드 (선택 사항)
  └── test/
       ├── java/          # Java 및 Kotlin 테스트 코드
       └── kotlin/        # 추가 Kotlin 테스트 코드 (선택 사항)
```

이러한 디렉터리를 수동으로 생성하거나, 첫 번째 Kotlin 파일을 추가할 때 IntelliJ IDEA가 생성하도록 할 수 있습니다.

Kotlin 플러그인은 `src/main/java` 및 `src/test/java` 디렉터리를 모두 자동으로 인식하므로, 동일한 디렉터리에 `.kt` 및 `.java` 파일을 보관할 수 있습니다.

## Java 파일을 Kotlin으로 변환하기

Kotlin 플러그인에는 Java 파일을 Kotlin으로 자동으로 변환해 주는 Java to Kotlin 변환기(_J2K_)가 포함되어 있습니다. 파일에서 J2K를 사용하려면, 해당 파일의 컨텍스트 메뉴 또는 IntelliJ IDEA의 **Code** 메뉴에서 **Convert Java File to Kotlin File**을 클릭하세요.

![Convert Java to Kotlin](convert-java-to-kotlin.png){width=500}

이 변환기가 완벽하지는 않지만, Java의 대부분의 보일러플레이트(boilerplate) 코드를 Kotlin으로 변환하는 데 꽤 훌륭한 역할을 합니다. 하지만 때때로 약간의 수동 수정이 필요할 수 있습니다.

## 컴파일러 플러그인 살펴보기 {initial-collapse-state="collapsed" collapsible="true"}

[Spring](https://spring.io/)이나 JPA(Java Persistence API)를 사용하는 더 복잡한 프로젝트가 있는 경우, Kotlin 언어 기능을 프레임워크 요구 사항에 맞게 자동으로 조정하여 보일러플레이트 코드를 줄여주는 Kotlin 컴파일러 플러그인을 사용할 수 있습니다:

* **[`all-open`](all-open-plugin.md)** 플러그인은 특정 어노테이션과 함께 사용할 때 클래스와 그 멤버를 자동으로 `open`으로 만듭니다. 이는 클래스가 final이 아니어야 하는 Spring과 같은 프레임워크에서 특히 유용합니다.

  Spring의 경우, `all-open`을 기반으로 하는 전용 [`kotlin-spring`](all-open-plugin.md#spring-support) 플러그인을 사용할 수 있습니다. 이 플러그인은 Spring 어노테이션을 자동으로 지정합니다.
* **[`no-arg`](no-arg-plugin.md)** 플러그인은 특정 어노테이션이 있는 클래스에 대해 추가적인 인자 없는 생성자(zero-argument constructor)를 생성합니다. 이를 통해 JPA가 기본 생성자가 없는 클래스를 인스턴스화할 수 있도록 합니다.

  또한 `no-arg`를 기반으로 하는 [`kotlin-jpa`](no-arg-plugin.md#jpa-support) 플러그인을 사용할 수도 있습니다. 이 플러그인은 no-arg 어노테이션을 자동으로 지정합니다.
* **[`power-assert`](power-assert.md)** 플러그인은 어설션(assertion)에 대한 문맥 정보를 포함한 상세한 실패 메시지를 제공하여 디버깅 경험을 개선합니다. 중간 값을 보여주어 테스트가 실패한 이유를 이해하는 데 도움을 줍니다.

## 다음 단계

Java 프로젝트에서 Kotlin을 사용하는 가장 쉬운 방법은 Kotlin 테스트를 먼저 추가하는 것입니다:

[Java 프로젝트에 첫 번째 Kotlin 테스트 추가하기](jvm-test-using-junit.md)

### 참고 항목

* [Kotlin 및 Java 상호 운용성 상세 정보](java-to-kotlin-interop.md)
* [Maven 빌드 구성 참조](maven.md)