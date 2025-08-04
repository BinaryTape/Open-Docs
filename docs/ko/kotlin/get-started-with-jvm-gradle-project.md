[//]: # (title: Gradle 및 Kotlin/JVM 시작하기)

이 튜토리얼에서는 IntelliJ IDEA와 Gradle을 사용하여 JVM 콘솔 애플리케이션을 생성하는 방법을 설명합니다.

시작하려면 먼저 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치하세요.

## 프로젝트 생성

1. IntelliJ IDEA에서 **파일** | **새로 만들기** | **프로젝트**를 선택합니다.
2. 왼쪽 패널에서 **Kotlin**을 선택합니다.
3. 새 프로젝트의 이름을 지정하고 필요한 경우 위치를 변경합니다.

   > **Git 저장소 생성** 확인란을 선택하여 새 프로젝트를 버전 제어 하에 둘 수 있습니다. 이 작업은 나중에 언제든지 수행할 수 있습니다.
   >
   {style="tip"}

   ![Create a console application](jvm-new-gradle-project.png){width=700}

4. **Gradle** 빌드 시스템을 선택합니다.
5. **JDK** 목록에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
    * JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되어 있지 않은 경우, **JDK 추가**를 선택하고 JDK 홈 디렉터리의 경로를 지정합니다.
    * 필요한 JDK가 컴퓨터에 없는 경우, **JDK 다운로드**를 선택합니다.

6. Gradle용 **Kotlin** DSL을 선택합니다.
7. **샘플 코드 추가** 확인란을 선택하여 `"Hello World!"` 샘플 애플리케이션 파일을 생성합니다.

   > **온보딩 팁과 함께 코드 생성** 옵션을 활성화하여 샘플 코드에 유용한 추가 주석을 추가할 수도 있습니다.
   >
   {style="tip"}

8. **생성**을 클릭합니다.

Gradle로 프로젝트를 성공적으로 생성했습니다!

#### 프로젝트의 Gradle 버전 지정 {initial-collapse-state="collapsed" collapsible="true"}

**고급 설정** 섹션에서 Gradle Wrapper를 사용하거나 Gradle의 로컬 설치를 통해 프로젝트의 Gradle 버전을 명시적으로 지정할 수 있습니다.

* **Gradle Wrapper:**
   1. **Gradle 배포** 목록에서 **Wrapper**를 선택합니다.
   2. **자동 선택** 확인란을 비활성화합니다.
   3. **Gradle 버전** 목록에서 사용할 Gradle 버전을 선택합니다.
* **로컬 설치:**
   1. **Gradle 배포** 목록에서 **로컬 설치**를 선택합니다.
   2. **Gradle 위치**에 대해 로컬 Gradle 버전의 경로를 지정합니다.

   ![Advanced settings](jvm-new-gradle-project-advanced.png){width=700}

## 빌드 스크립트 살펴보기

`build.gradle.kts` 파일을 엽니다. 이 파일은 Gradle Kotlin 빌드 스크립트이며, 애플리케이션에 필요한 Kotlin 관련 아티팩트 및 기타 부분을 포함합니다.

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // 사용할 Kotlin 버전
}

group = "org.example" // 회사 이름, 예: `org.jetbrains`
version = "1.0-SNAPSHOT" // 빌드된 아티팩트에 할당할 버전

repositories { // 종속성 소스입니다. 1️⃣ 참고
    mavenCentral() // Maven Central 저장소입니다. 2️⃣ 참고
}

dependencies { // 사용할 모든 라이브러리입니다. 3️⃣ 참고
    // 저장소에서 종속성을 찾은 후 이름을 복사하세요.
    testImplementation(kotlin("test")) // Kotlin 테스트 라이브러리
}

tasks.test { // 4️⃣ 참고
    useJUnitPlatform() // 테스트용 JUnitPlatform입니다. 5️⃣ 참고
}
```

* 1️⃣ [종속성 소스](https://docs.gradle.org/current/userguide/declaring_repositories.html)에 대해 자세히 알아보세요.
* 2️⃣ [Maven Central 저장소](https://central.sonatype.com/)입니다. [Google의 Maven 저장소](https://maven.google.com/) 또는 회사 비공개 저장소일 수도 있습니다.
* 3️⃣ [종속성 선언](https://docs.gradle.org/current/userguide/declaring_dependencies.html)에 대해 자세히 알아보세요.
* 4️⃣ [태스크](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)에 대해 자세히 알아보세요.
* 5️⃣ [테스트용 JUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform).

보시다시피, Gradle 빌드 파일에 몇 가지 Kotlin 관련 아티팩트가 추가되었습니다.

1. `plugins {}` 블록에는 `kotlin("jvm")` 아티팩트가 있습니다. 이 플러그인은 프로젝트에서 사용할 Kotlin 버전을 정의합니다.

2. `dependencies {}` 블록에는 `testImplementation(kotlin("test"))`가 있습니다.
   [테스트 라이브러리에 종속성 설정](gradle-configure-project.md#set-dependencies-on-test-libraries)에 대해 자세히 알아보세요.

## 애플리케이션 실행

1. **보기** | **도구 창** | **Gradle**을 선택하여 Gradle 창을 엽니다.

   ![Main.kt with main fun](jvm-gradle-view-build.png){width=700}

2. `Tasks\build\`에서 **build** Gradle 태스크를 실행합니다. **빌드** 창에 `BUILD SUCCESSFUL`이 나타납니다.
   이는 Gradle이 애플리케이션을 성공적으로 빌드했음을 의미합니다.

3. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.
   * `src` 디렉터리에는 Kotlin 소스 파일 및 리소스가 포함되어 있습니다.
   * `Main.kt` 파일에는 `Hello World!`를 출력할 샘플 코드가 포함되어 있습니다.

4. 거터(gutter)에 있는 녹색 **실행** 아이콘을 클릭하고 **'MainKt' 실행**을 선택하여 애플리케이션을 실행합니다.

   ![Running a console app](jvm-run-app-gradle.png){width=350}

**실행** 도구 창에서 결과를 확인할 수 있습니다.

![Kotlin run output](jvm-output-gradle.png){width=600}

축하합니다! 첫 Kotlin 애플리케이션을 성공적으로 실행했습니다.

## 다음 단계는?

다음 사항에 대해 자세히 알아보세요.
* [Gradle 빌드 파일 속성](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A).
* [다른 플랫폼 타겟팅 및 라이브러리 종속성 설정](gradle-configure-project.md).
* [컴파일러 옵션 및 전달 방법](gradle-compiler-options.md).
* [증분 컴파일, 캐시 지원, 빌드 보고서 및 Kotlin 데몬](gradle-compilation-and-caches.md).