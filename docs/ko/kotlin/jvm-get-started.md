[//]: # (title: Kotlin/JVM 시작하기)

이 튜토리얼에서는 IntelliJ IDEA를 사용하여 콘솔 애플리케이션을 만드는 방법을 보여줍니다.

시작하려면 먼저 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 최신 버전을 다운로드하여 설치하세요.

## 프로젝트 생성하기

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2. 왼쪽 목록에서 **Kotlin**을 선택합니다.
3. 새 프로젝트의 이름을 지정하고 필요한 경우 위치를 변경합니다.

   > 새 프로젝트를 버전 관리에 두려면 **Create Git repository** 체크박스를 선택합니다. 이 작업은 나중에 언제든지 수행할 수 있습니다.
   >
   {style="tip"}
   
   ![Create a console application](jvm-new-project.png){width=700}

4. **IntelliJ** 빌드 시스템을 선택합니다. 추가 아티팩트(artifacts) 다운로드가 필요 없는 네이티브 빌더입니다.

   추가 구성이 필요한 더 복잡한 프로젝트를 생성하려면 Maven 또는 Gradle을 선택합니다. Gradle의 경우 빌드 스크립트 언어로 Kotlin 또는 Groovy를 선택하세요.
5. **JDK** 목록에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
   * JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되어 있지 않은 경우, **Add JDK**를 선택하고 JDK 홈 디렉터리 경로를 지정합니다. 
   * 필요한 JDK가 컴퓨터에 없는 경우, **Download JDK**를 선택합니다.

6. 샘플 `"Hello World!"` 애플리케이션 파일 생성을 위해 **Add sample code** 옵션을 활성화합니다.

    > 샘플 코드에 유용한 주석을 추가하려면 **Generate code with onboarding tips** 옵션도 활성화할 수 있습니다.
    >
    {style="tip"}

7. **Create**를 클릭합니다.

    > Gradle 빌드 시스템을 선택했다면, 프로젝트에 빌드 스크립트 파일 `build.gradle(.kts)`이 있습니다. 이 파일에는 콘솔 애플리케이션에 필요한 `kotlin("jvm")` 플러그인과 종속성(dependencies)이 포함되어 있습니다. 플러그인의 최신 버전을 사용하는지 확인하세요:
    > 
    > <tabs group="build-script">
    > <tab title="Kotlin" group-key="kotlin">
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "%kotlinVersion%"
    >     application
    > }
    > ```
    > 
    > </tab>
    > <tab title="Groovy" group-key="groovy">
    > 
    > ```groovy
    > plugins {
    >     id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    >     id 'application'
    > }
    > ```
    > 
    > </tab>
    > </tabs>
    > 
    {style="note"}

## 애플리케이션 생성하기

1. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.  
   `src` 디렉터리에는 Kotlin 소스 파일과 리소스가 포함되어 있습니다. `Main.kt` 파일에는 `Hello, Kotlin!`을 출력하는 샘플 코드와 사이클 반복자(cycle iterator) 값의 여러 줄이 포함되어 있습니다.

   ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2. 코드를 수정하여 이름을 요청하고 `"Hello"`라고 말하도록 만드세요:

   * 입력 프롬프트(input prompt)를 생성하고 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수가 반환하는 값을 `name` 변수에 할당합니다.
   * 문자열 연결 대신 문자열 템플릿을 사용하여 텍스트 출력에서 변수 이름 앞에 `$name`처럼 달러 기호(`$`)를 직접 추가해 보세요.
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 애플리케이션 실행하기

이제 애플리케이션을 실행할 준비가 되었습니다. 가장 쉬운 방법은 거터(gutter)에 있는 녹색 **Run** 아이콘을 클릭하고 **Run 'MainKt'**를 선택하는 것입니다.

![Running a console app](jvm-run-app.png){width=350}

결과는 **Run** 도구 창에서 확인할 수 있습니다.

![Kotlin run output](jvm-output-1.png){width=600}
   
이름을 입력하고 애플리케이션의 환영 인사를 받아보세요! 

![Kotlin run output](jvm-output-2.png){width=600}

축하합니다! 첫 번째 Kotlin 애플리케이션을 성공적으로 실행했습니다.

## 다음 단계는?

이 애플리케이션을 생성했다면, 이제 Kotlin 문법을 더 깊이 탐구할 수 있습니다:

* [Kotlin 예제](https://play.kotlinlang.org/byExample/overview)에서 샘플 코드를 추가하세요. 
* IDEA용 [JetBrains Academy 플러그인](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)을 설치하고 [Kotlin Koans 코스](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans)의 연습 문제를 완료하세요.