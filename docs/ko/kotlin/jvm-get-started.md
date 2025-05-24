---
title: "Kotlin/JVM 시작하기"
---
이 튜토리얼에서는 IntelliJ IDEA를 사용하여 콘솔 애플리케이션을 만드는 방법을 보여줍니다.

시작하려면 먼저 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)를 다운로드하여 설치합니다.

## 프로젝트 생성

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2. 왼쪽 목록에서 **Kotlin**을 선택합니다.
3. 새 프로젝트 이름을 지정하고 필요한 경우 위치를 변경합니다.

   > 새 프로젝트를 버전 관리하에 두려면 **Create Git repository** 확인란을 선택합니다. 언제든지 나중에 수행할 수 있습니다.
   >
   
   
   <img src="/img/jvm-new-project.png" alt="Create a console application" width="700" style={{verticalAlign: 'middle'}}/>

4. **IntelliJ** 빌드 시스템을 선택합니다. 추가 아티팩트를 다운로드할 필요가 없는 기본 빌더입니다.

   추가 구성이 필요한 더 복잡한 프로젝트를 만들려면 Maven 또는 Gradle을 선택합니다. Gradle의 경우 빌드 스크립트의 언어(Kotlin 또는 Groovy)를 선택합니다.
5. **JDK list**에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
   * JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되어 있지 않은 경우 **Add JDK**를 선택하고 JDK 홈 디렉터리의 경로를 지정합니다.
   * 컴퓨터에 필요한 JDK가 없는 경우 **Download JDK**를 선택합니다.

6. **Add sample code** 옵션을 활성화하여 샘플 `"Hello World!"` 애플리케이션이 있는 파일을 만듭니다.

    > **Generate code with onboarding tips** 옵션을 활성화하여 샘플 코드에 유용한 주석을 추가할 수도 있습니다.
    >
    

7. **Create**를 클릭합니다.

    > Gradle 빌드 시스템을 선택한 경우 프로젝트에 빌드 스크립트 파일 `build.gradle(.kts)`가 있습니다. 여기에는 `kotlin("jvm")` 플러그인과 콘솔 애플리케이션에 필요한 종속성이 포함되어 있습니다. 최신 버전의 플러그인을 사용하고 있는지 확인하십시오.
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "2.1.20"
    >     application
    > }
    > ```
    > 
    

## 애플리케이션 생성

1. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.
   `src` 디렉터리에는 Kotlin 소스 파일과 리소스가 포함되어 있습니다. `Main.kt` 파일에는 `Hello, Kotlin!`을 출력하는 샘플 코드와 사이클 반복기의 값이 있는 여러 줄이 포함되어 있습니다.

   <img src="/img/jvm-main-kt-initial.png" alt="Main.kt with main fun" width="700" style={{verticalAlign: 'middle'}}/>

2. 이름을 요청하고 사용자에게 `Hello`라고 말하도록 코드를 수정합니다.

   * 입력 프롬프트를 만들고 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수에서 반환된 값을 `name` 변수에 할당합니다.
   * 문자열 연결 대신 텍스트 출력에서 변수 이름 바로 앞에 달러 기호 `$`를 추가하여 문자열 템플릿을 사용해 보겠습니다.
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 애플리케이션 실행

이제 애플리케이션을 실행할 준비가 되었습니다. 가장 쉬운 방법은 여백에서 녹색 **Run** 아이콘을 클릭하고 **Run 'MainKt'**를 선택하는 것입니다.

<img src="/img/jvm-run-app.png" alt="Running a console app" width="350" style={{verticalAlign: 'middle'}}/>

**Run** 도구 창에서 결과를 볼 수 있습니다.

<img src="/img/jvm-output-1.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>
   
이름을 입력하고 애플리케이션에서 보내는 인사를 받아보세요!

<img src="/img/jvm-output-2.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>

축하합니다! 첫 번째 Kotlin 애플리케이션을 실행했습니다.

## 다음은 무엇일까요?

이 애플리케이션을 만들었으면 이제 Kotlin 구문을 더 자세히 살펴볼 수 있습니다.

* [Kotlin 예제](https://play.kotlinlang.org/byExample/overview)에서 샘플 코드를 추가합니다.
* IDEA용 [JetBrains Academy 플러그인](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)을 설치하고 [Kotlin Koans 과정](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans)에서 연습 문제를 완료합니다.