[//]: # (title: Gradle 및 Kotlin/JVM 시작하기)

이 튜토리얼은 IntelliJ IDEA와 Gradle을 사용하여 JVM 콘솔 애플리케이션을 생성하는 방법을 시연합니다.

시작하려면 먼저 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치하세요.

## 프로젝트 생성

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2. 왼쪽 패널에서 **Kotlin**을 선택합니다.
3. 새 프로젝트의 이름을 지정하고, 필요한 경우 위치를 변경합니다.

   > 새 프로젝트를 버전 관리 하에 두려면 **Create Git repository** 체크박스를 선택하세요. 이 작업은 나중에 언제든지 수행할 수 있습니다.
   >
   {style="tip"}

   ![콘솔 애플리케이션 생성](jvm-new-gradle-project.png){width=700}

4. **Gradle** 빌드 시스템을 선택합니다.
5. **JDK** 목록에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
    * JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되어 있지 않은 경우, **Add JDK**를 선택하고 JDK 홈 디렉터리 경로를 지정합니다.
    * 컴퓨터에 필요한 JDK가 없는 경우, **Download JDK**를 선택합니다.

6. Gradle용 **Kotlin** DSL을 선택합니다.
7. `"Hello World!"` 샘플 애플리케이션 파일과 함께 생성하려면 **Add sample code** 체크박스를 선택합니다.

   > 샘플 코드에 유용한 주석을 추가하려면 **Generate code with onboarding tips** 옵션을 활성화할 수도 있습니다.
   >
   {style="tip"}

8. **Create**를 클릭합니다.

Gradle로 프로젝트를 성공적으로 생성했습니다!

#### 프로젝트의 Gradle 버전 지정 {initial-collapse-state="collapsed" collapsible="true"}

**Advanced Settings** 섹션에서 Gradle Wrapper 또는 로컬 Gradle 설치를 사용하여 프로젝트의 Gradle 버전을 명시적으로 지정할 수 있습니다.

* **Gradle Wrapper:**
   1. **Gradle distribution** 목록에서 **Wrapper**를 선택합니다.
   2. **Auto-select** 체크박스를 비활성화합니다.
   3. **Gradle version** 목록에서 사용할 Gradle 버전을 선택합니다.
* **Local installation:**
   1. **Gradle distribution** 목록에서 **Local installation**을 선택합니다.
   2. **Gradle location**에 대해 로컬 Gradle 버전의 경로를 지정합니다.

   ![고급 설정](jvm-new-gradle-project-advanced.png){width=700}

## 빌드 스크립트 살펴보기

`build.gradle.kts` 파일을 엽니다. 이 파일은 Kotlin 관련 아티팩트와 애플리케이션에 필요한 기타 부분을 포함하는 Gradle Kotlin 빌드 스크립트입니다.

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // 사용할 Kotlin 버전
}

group = "org.example" // 예를 들어 `org.jetbrains`와 같은 회사 이름
version = "1.0-SNAPSHOT" // 빌드된 아티팩트에 할당할 버전

repositories { // 종속성 소스. 1️⃣ 참고
    mavenCentral() // Maven 중앙 저장소. 2️⃣ 참고
}

dependencies { // 사용할 모든 라이브러리. 3️⃣ 참고
    // 저장소에서 종속성 이름을 찾은 후 복사
    testImplementation(kotlin("test")) // Kotlin 테스트 라이브러리
}

tasks.test { // 4️⃣ 참고
    useJUnitPlatform() // 테스트용 JUnitPlatform. 5️⃣ 참고
}
```

* 1️⃣ [종속성 소스](https://docs.gradle.org/current/userguide/declaring_repositories.html)에 대해 자세히 알아보세요.
* 2️⃣ [Maven Central Repository](https://central.sonatype.com/)입니다. [Google의 Maven 저장소](https://maven.google.com/) 또는 회사 내부 저장소일 수도 있습니다.
* 3️⃣ [종속성 선언](https://docs.gradle.org/current/userguide/declaring_dependencies.html)에 대해 자세히 알아보세요.
* 4️⃣ [태스크](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)에 대해 자세히 알아보세요.
* 5️⃣ [테스트용 JUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform).

보시다시피, Gradle 빌드 파일에 몇 가지 Kotlin 관련 아티팩트가 추가되었습니다.

1. `plugins {}` 블록에는 `kotlin("jvm")` 아티팩트가 있습니다. 이 플러그인은 프로젝트에서 사용할 Kotlin 버전을 정의합니다.

2. `dependencies {}` 블록에는 `testImplementation(kotlin("test"))`가 있습니다.
   [테스트 라이브러리에 종속성 설정](gradle-configure-project.md#set-dependencies-on-test-libraries)에 대해 자세히 알아보세요.

## 애플리케이션 실행

1. Gradle 창을 열려면 **View** | **Tool Windows** | **Gradle**을 선택합니다.

   ![main 함수가 있는 Main.kt](jvm-gradle-view-build.png){width=700}

2. `Tasks\build\`에서 **build** Gradle 태스크를 실행합니다. **Build** 창에 `BUILD SUCCESSFUL`이 나타납니다. 이는 Gradle이 애플리케이션을 성공적으로 빌드했음을 의미합니다.

3. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.
   * `src` 디렉터리에는 Kotlin 소스 파일과 리소스가 포함되어 있습니다.
   * `Main.kt` 파일에는 `Hello World!`를 출력하는 샘플 코드가 포함되어 있습니다.

4. 거터(gutter)의 녹색 **Run** 아이콘을 클릭하고 **Run 'MainKt'**를 선택하여 애플리케이션을 실행합니다.

   ![콘솔 앱 실행 중](jvm-run-app-gradle.png){width=350}

**Run** 도구 창에서 결과를 볼 수 있습니다.

![Kotlin 실행 결과](jvm-output-gradle.png){width=600}

축하합니다! 첫 번째 Kotlin 애플리케이션을 성공적으로 실행했습니다.

## 다음 단계는?

다음 내용에 대해 자세히 알아보세요.
* [Gradle 빌드 파일 속성](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A).
* [다른 플랫폼 대상으로 지정 및 라이브러리 종속성 설정](gradle-configure-project.md).
* [컴파일러 옵션 및 전달 방법](gradle-compiler-options.md).
* [증분 컴파일, 캐시 지원, 빌드 보고서 및 Kotlin 데몬](gradle-compilation-and-caches.md).