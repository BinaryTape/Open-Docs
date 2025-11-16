[//]: # (title: Java 프로젝트에 Kotlin 추가하기 – 튜토리얼)

Kotlin은 Java와 완벽하게 상호 운용되므로, 모든 것을 다시 작성할 필요 없이 기존 Java 프로젝트에 점진적으로 도입할 수 있습니다.

이 튜토리얼에서는 다음 방법을 배웁니다:

*   Maven 또는 Gradle 빌드 도구를 설정하여 Java 및 Kotlin 코드를 모두 컴파일하는 방법.
*   프로젝트 디렉터리에 Java 및 Kotlin 소스 파일을 구성하는 방법.
*   IntelliJ IDEA를 사용하여 Java 파일을 Kotlin으로 변환하는 방법.

> 이 튜토리얼에서는 기존 Java 프로젝트를 사용하거나, Maven 및 Gradle 빌드 파일이 이미 설정된 공개 [샘플 프로젝트](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)를 복제하여 사용할 수 있습니다.
>
{style="tip"}

## 프로젝트 구성

Java 프로젝트에 Kotlin을 추가하려면 사용하는 빌드 도구에 따라 Kotlin과 Java를 모두 사용하도록 프로젝트를 구성해야 합니다.

프로젝트 구성은 Kotlin 및 Java 코드가 모두 올바르게 컴파일되고 서로 원활하게 참조할 수 있도록 보장합니다.

### Maven

> **IntelliJ IDEA 2025.3**부터 Maven 기반 Java 프로젝트에 첫 Kotlin 파일을 추가하면, IDE가 자동으로 `pom.xml` 파일을 업데이트하여 Kotlin Maven 플러그인과 표준 의존성을 포함시킵니다.
> 버전 또는 빌드 단계를 사용자 지정하려면 수동으로 구성할 수도 있습니다.
>
{style="note"}

Maven 프로젝트에서 Kotlin과 Java를 함께 사용하려면 `pom.xml` 파일에 Kotlin Maven 플러그인을 적용하고 Kotlin 의존성을 추가하세요:

1.  `<properties>` 섹션에 Kotlin 버전 속성을 추가합니다:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2.  `<dependencies>` 섹션에 필요한 의존성을 `<plugins>` 섹션에 추가합니다:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,62"}

3.  `<build><plugins>` 섹션에 Kotlin 플러그인을 추가합니다:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="64-66,102-104,105-137"}

   이 구성에서:

    *   `<extensions>true</extensions>`는 Maven이 Kotlin 플러그인을 빌드 라이프사이클에 통합하도록 합니다.
    *   사용자 지정 실행 단계는 Kotlin 플러그인이 Kotlin을 먼저 컴파일한 다음 Java를 컴파일하도록 허용합니다.
    *   Kotlin 및 Java 코드는 구성된 `sourceDirs` 디렉터리를 통해 서로를 참조할 수 있습니다.
    *   Kotlin Maven 플러그인을 확장 기능과 함께 사용할 때는 `<build><pluginManagement>` 섹션에 별도의 `maven-compiler-plugin`이 필요하지 않습니다.

4.  IDE에서 Maven 프로젝트를 다시 로드합니다.
5.  구성을 확인하기 위해 테스트를 실행하세요:

    ```bash
    ./mvnw clean test
    ```

### Gradle

Gradle 프로젝트에서 Kotlin과 Java를 함께 사용하려면 `build.gradle.kts` 파일에 Kotlin JVM 플러그인을 적용하고 Kotlin 의존성을 추가하세요:

1.  `plugins {}` 블록에 Kotlin JVM 플러그인을 추가합니다:

    ```kotlin
    plugins {
        // Other plugins
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2.  JVM 툴체인 버전을 Java 버전에 맞게 설정합니다:

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   이는 Kotlin이 Java 코드와 동일한 JDK 버전을 사용하도록 보장합니다.

3.  `dependencies {}` 블록에 Kotlin 테스트 유틸리티를 제공하고 JUnit과 통합되는 `kotlin("test")` 라이브러리를 추가합니다:

    ```kotlin
    dependencies {
        // Other dependencies
    
        testImplementation(kotlin("test"))
        // Other test dependencies
    }
    ```

4.  IDE에서 Gradle 프로젝트를 다시 로드합니다.
5.  구성을 확인하기 위해 테스트를 실행하세요:

    ```bash
    ./gradlew clean test
    ```

## 프로젝트 구조

이 구성으로 동일한 소스 디렉터리에 Java 및 Kotlin 파일을 혼합할 수 있습니다:

```none
src/
  ├── main/
  │    ├── java/          # Java and Kotlin production code
  │    └── kotlin/        # Additional Kotlin production code (optional)
  └── test/
       ├── java/          # Java and Kotlin test code
       └── kotlin/        # Additional Kotlin test code (optional)
```

이 디렉터리들을 수동으로 생성하거나 첫 Kotlin 파일을 추가할 때 IntelliJ IDEA가 생성하도록 할 수 있습니다.

Kotlin 플러그인은 `src/main/java` 및 `src/test/java` 디렉터리 모두를 자동으로 인식하므로 `.kt` 및 `.java` 파일을 동일한 디렉터리에 유지할 수 있습니다.

## Java 파일을 Kotlin으로 변환

Kotlin 플러그인은 또한 Java 파일을 Kotlin으로 자동으로 변환하는 Java-Kotlin 변환기(_J2K_)를 번들로 제공합니다.
파일에서 J2K를 사용하려면 해당 파일의 컨텍스트 메뉴 또는 IntelliJ IDEA의 **코드** 메뉴에서 **Java 파일을 Kotlin 파일로 변환**을 클릭하세요.

![Java를 Kotlin으로 변환](convert-java-to-kotlin.png){width=500}

변환기가 완벽하지는 않지만, 대부분의 상용구(boilerplate) 코드를 Java에서 Kotlin으로 꽤 잘 변환합니다.
하지만 때로는 수동 조정이 필요할 수도 있습니다.

## 다음 단계

Java 프로젝트에서 Kotlin을 사용하기 시작하는 가장 쉬운 방법은 Kotlin 테스트를 먼저 추가하는 것입니다:

[Java 프로젝트에 첫 Kotlin 테스트 추가하기](jvm-test-using-junit.md)

### 함께 보기

*   [Kotlin 및 Java 상호 운용성 세부 정보](java-to-kotlin-interop.md)
*   [Maven 빌드 구성 참조](maven.md)