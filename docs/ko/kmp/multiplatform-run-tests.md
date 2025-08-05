[//]: # (title: 멀티플랫폼 앱 테스트하기 − 튜토리얼)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>이 튜토리얼에서는 IntelliJ IDEA를 사용하지만 Android Studio에서도 동일하게 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
</tldr>

이 튜토리얼에서는 Kotlin 멀티플랫폼 애플리케이션에서 테스트를 생성, 구성 및 실행하는 방법을 배웁니다.

멀티플랫폼 프로젝트의 테스트는 두 가지 범주로 나눌 수 있습니다:

*   공통 코드에 대한 테스트. 이 테스트는 지원되는 모든 프레임워크를 사용하여 어떤 플랫폼에서도 실행할 수 있습니다.
*   플랫폼별 코드에 대한 테스트. 이 테스트는 플랫폼별 로직을 테스트하는 데 필수적입니다. 플랫폼별 프레임워크를 사용하며, 더 풍부한 API 및 더 넓은 범위의 어설션과 같은 추가 기능의 이점을 누릴 수 있습니다.

두 범주 모두 멀티플랫폼 프로젝트에서 지원됩니다. 이 튜토리얼에서는 먼저 간단한 Kotlin 멀티플랫폼 프로젝트에서 공통 코드에 대한 단위 테스트를 설정, 생성 및 실행하는 방법을 보여줍니다. 그런 다음, 공통 및 플랫폼별 코드 모두에 대한 테스트가 필요한 더 복잡한 예제를 다룰 것입니다.

> 이 튜토리얼은 다음 사항에 익숙하다고 가정합니다:
> *   Kotlin 멀티플랫폼 프로젝트의 레이아웃. 그렇지 않다면 시작하기 전에 [이 튜토리얼](multiplatform-create-first-app.md)을 완료하십시오.
> *   [JUnit](https://junit.org/junit5/)과 같은 인기 있는 단위 테스트 프레임워크의 기본.
>
{style="tip"}

## 간단한 멀티플랫폼 프로젝트 테스트하기

### 프로젝트 생성

1.  [퀵스타트](quickstart.md)에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 지침을 완료합니다.
2.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3.  왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.
4.  **New Project** 창에서 다음 필드를 지정합니다:

    *   **Name**: KotlinProject
    *   **Group**: kmp.project.demo
    *   **Artifact**: kotlinproject
    *   **JDK**: Amazon Corretto version 17
        > 이 JDK 버전은 나중에 추가하는 테스트 중 하나가 성공적으로 실행되려면 필요합니다.
        >
        {style="note"}

5.  **Android** 타겟을 선택합니다.
    *   Mac을 사용하는 경우, **iOS**도 선택합니다. **Do not share UI** 옵션이 선택되어 있는지 확인합니다.
6.  **Include tests**를 선택 해제하고 **Create**를 클릭합니다.

    ![Create simple multiplatform project](create-test-multiplatform-project.png){width=800}

### 코드 작성

`shared/src/commonMain/kotlin` 디렉토리에 새 `common.example.search` 디렉토리를 생성합니다.
이 디렉토리에 다음 함수를 포함하는 Kotlin 파일 `Grep.kt`를 생성합니다:

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

이 함수는 [UNIX `grep` 명령어](https://en.wikipedia.org/wiki/Grep)와 유사하게 설계되었습니다. 여기에서 함수는 텍스트 줄, 정규 표현식으로 사용되는 패턴, 그리고 줄이 패턴과 일치할 때마다 호출되는 함수를 인자로 받습니다.

### 테스트 추가

이제 공통 코드를 테스트해 보겠습니다. 핵심 부분은 `kotlin.test` API 라이브러리를 종속성으로 갖는 공통 테스트용 소스 세트입니다.

1.  `shared/build.gradle.kts` 파일에서 `kotlin.test` 라이브러리에 대한 종속성이 있는지 확인합니다:

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2.  `commonTest` 소스 세트에는 모든 공통 테스트가 저장됩니다. 프로젝트에 동일한 이름의 디렉토리를 생성해야 합니다:

    1.  `shared/src` 디렉토리를 마우스 오른쪽 버튼으로 클릭하고 **New | Directory**를 선택합니다. IDE에 옵션 목록이 표시됩니다.
    2.  `commonTest/kotlin` 경로를 입력하여 선택 항목을 좁힌 다음 목록에서 선택합니다:

      ![Creating common test directory](create-common-test-dir.png){width=350}

3.  `commonTest/kotlin` 디렉토리에 새 `common.example.search` 패키지를 생성합니다.
4.  이 패키지에 `Grep.kt` 파일을 생성하고 다음 단위 테스트로 업데이트합니다:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class GrepTest {
        companion object {
            val sampleData = listOf(
                "123 abc",
                "abc 123",
                "123 ABC",
                "ABC 123"
            )
        }
    
        @Test
        fun shouldFindMatches() {
            val results = mutableListOf<String>()
            grep(sampleData, "[a-z]+") {
                results.add(it)
            }
    
            assertEquals(2, results.size)
            for (result in results) {
                assertContains(result, "abc")
            }
        }
    }
    ```

보시다시피, 가져온 어노테이션과 어설션은 플랫폼이나 프레임워크에 특화되지 않습니다.
이 테스트를 나중에 실행하면 플랫폼별 프레임워크가 테스트 러너를 제공할 것입니다.

#### `kotlin.test` API 살펴보기 {initial-collapse-state="collapsed" collapsible="true"}

`kotlin.test` 라이브러리는 테스트에서 사용할 수 있는 플랫폼 독립적인 어노테이션과 어설션을 제공합니다. `Test`와 같은 어노테이션은 선택된 프레임워크에서 제공하는 어노테이션 또는 그에 가장 가까운 등가 어노테이션에 매핑됩니다.

어설션은 `Asserter` 인터페이스의 구현을 통해 실행됩니다.
이 인터페이스는 테스트에서 일반적으로 수행되는 다양한 검사를 정의합니다. API에는 기본 구현이 있지만, 일반적으로 프레임워크별 구현을 사용하게 됩니다.

예를 들어, JUnit 4, JUnit 5 및 TestNG 프레임워크는 모두 JVM에서 지원됩니다. Android에서는 `assertEquals()` 호출이 `asserter.assertEquals()` 호출로 이어질 수 있으며, 여기서 `asserter` 객체는 `JUnit4Asserter`의 인스턴스입니다. iOS에서는 `Asserter` 타입의 기본 구현이 Kotlin/Native 테스트 러너와 함께 사용됩니다.

### 테스트 실행

다음 방법으로 테스트를 실행할 수 있습니다:

*   **Run** 아이콘을 사용하여 `shouldFindMatches()` 테스트 함수를 실행합니다.
*   컨텍스트 메뉴를 사용하여 테스트 파일을 실행합니다.
*   **Run** 아이콘을 사용하여 `GrepTest` 테스트 클래스를 실행합니다.

또한 편리한 <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut> 단축키도 있습니다.
어떤 옵션을 선택하든, 테스트를 실행할 타겟 목록이 표시됩니다:

![Run test task](run-test-tasks.png){width=300}

`android` 옵션의 경우, 테스트는 JUnit 4를 사용하여 실행됩니다. `iosSimulatorArm64`의 경우, Kotlin 컴파일러는 테스트 어노테이션을 감지하고 Kotlin/Native 자체 테스트 러너에 의해 실행되는 _테스트 바이너리_를 생성합니다.

성공적인 테스트 실행으로 생성된 출력의 예시는 다음과 같습니다:

![Test output](run-test-results.png){width=700}

## 더 복잡한 프로젝트 작업하기

### 공통 코드용 테스트 작성

`grep()` 함수를 사용하여 공통 코드에 대한 테스트를 이미 생성했습니다. 이제 `CurrentRuntime` 클래스를 사용하여 더 고급 공통 코드 테스트를 살펴보겠습니다. 이 클래스에는 코드가 실행되는 플랫폼에 대한 세부 정보가 포함됩니다. 예를 들어, 로컬 JVM에서 실행되는 Android 단위 테스트의 경우 "OpenJDK" 및 "17.0" 값이 있을 수 있습니다.

`CurrentRuntime` 인스턴스는 플랫폼의 이름과 버전을 문자열로 생성해야 하며, 버전은 선택 사항입니다. 버전이 있는 경우, 문자열 시작 부분에 숫자가 있다면 해당 숫자만 필요합니다.

1.  `commonMain/kotlin` 디렉토리에 새 `org.kmp.testing` 디렉토리를 생성합니다.
2.  이 디렉토리에 `CurrentRuntime.kt` 파일을 생성하고 다음 구현으로 업데이트합니다:

    ```kotlin
    class CurrentRuntime(val name: String, rawVersion: String?) {
        companion object {
            val versionRegex = Regex("^[0-9]+(\\.[0-9]+)?")
        }
    
        val version = parseVersion(rawVersion)
    
        override fun toString() = "$name version $version"
    
        private fun parseVersion(rawVersion: String?): String {
            val result = rawVersion?.let { versionRegex.find(it) }
            return result?.value ?: "unknown"
        }
    }
    ```

3.  `commonTest/kotlin` 디렉토리에 새 `org.kmp.testing` 패키지를 생성합니다.
4.  이 패키지에 `CurrentRuntimeTest.kt` 파일을 생성하고 다음 플랫폼 및 프레임워크 독립적인 테스트로 업데이트합니다:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals

    class CurrentRuntimeTest {
        @Test
        fun shouldDisplayDetails() {
            val runtime = CurrentRuntime("MyRuntime", "1.1")
            assertEquals("MyRuntime version 1.1", runtime.toString())
        }
    
        @Test
        fun shouldHandleNullVersion() {
            val runtime = CurrentRuntime("MyRuntime", null)
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    
        @Test
        fun shouldParseNumberFromVersionString() {
            val runtime = CurrentRuntime("MyRuntime", "1.2 Alpha Experimental")
            assertEquals("MyRuntime version 1.2", runtime.toString())
        }
    
        @Test
        fun shouldHandleMissingVersion() {
            val runtime = CurrentRuntime("MyRuntime", "Alpha Experimental")
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    }
    ```

[IDE에서 사용 가능한](#run-tests) 방법 중 하나를 사용하여 이 테스트를 실행할 수 있습니다.

### 플랫폼별 테스트 추가

> 여기서는 간결성과 단순성을 위해 [expected 및 actual 선언 메커니즘](multiplatform-connect-to-apis.md)이 사용됩니다. 더 복잡한 코드에서는 인터페이스와 팩토리 함수를 사용하는 것이 더 좋은 접근 방식입니다.
>
{style="note"}

이제 공통 코드에 대한 테스트 작성 경험이 있으니, Android 및 iOS용 플랫폼별 테스트 작성에 대해 살펴보겠습니다.

`CurrentRuntime` 인스턴스를 생성하려면, 공통 `CurrentRuntime.kt` 파일에 다음과 같이 함수를 선언합니다:

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

이 함수는 지원되는 각 플랫폼에 대해 별도의 구현을 가져야 합니다. 그렇지 않으면 빌드가 실패합니다.
각 플랫폼에서 이 함수를 구현하는 것 외에도, 테스트를 제공해야 합니다. Android 및 iOS용 테스트를 생성해 봅시다.

#### Android용

1.  `androidMain/kotlin` 디렉토리에 새 `org.kmp.testing` 패키지를 생성합니다.
2.  이 패키지에 `AndroidRuntime.kt` 파일을 생성하고 예상되는 `determineCurrentRuntime()` 함수의 실제 구현으로 업데이트합니다:

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3.  `shared/src` 디렉토리 내에 테스트용 디렉토리를 생성합니다:
 
    1.  `shared/src` 디렉토리를 마우스 오른쪽 버튼으로 클릭하고 **New | Directory**를 선택합니다. IDE에 옵션 목록이 표시됩니다.
    2.  `androidUnitTest/kotlin` 경로를 입력하여 선택 항목을 좁힌 다음 목록에서 선택합니다:

    ![Creating Android test directory](create-android-test-dir.png){width=350}

4.  `kotlin` 디렉토리에 새 `org.kmp.testing` 패키지를 생성합니다.
5.  이 패키지에 `AndroidRuntimeTest.kt` 파일을 생성하고 다음 Android 테스트로 업데이트합니다:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "17.0")
        }
    }
    ```
   
    > 튜토리얼 초반에 다른 JDK 버전을 선택했다면, 테스트가 성공적으로 실행되려면 `name`과 `version`을 변경해야 할 수도 있습니다.
    > 
    {style="note"}

Android 특정 테스트가 로컬 JVM에서 실행되는 것이 이상하게 보일 수 있습니다. 이는 이러한 테스트가 현재 머신에서 로컬 단위 테스트로 실행되기 때문입니다. [Android Studio 문서](https://developer.android.com/studio/test/test-in-android-studio)에 설명된 대로, 이러한 테스트는 기기 또는 에뮬레이터에서 실행되는 계측 테스트와 다릅니다.

프로젝트에 다른 유형의 테스트를 추가할 수 있습니다. 계측 테스트에 대해 알아보려면 이 [Touchlab 가이드](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)를 참조하십시오.

#### iOS용

1.  `iosMain/kotlin` 디렉토리에 새 `org.kmp.testing` 디렉토리를 생성합니다.
2.  이 디렉토리에 `IOSRuntime.kt` 파일을 생성하고 예상되는 `determineCurrentRuntime()` 함수의 실제 구현으로 업데이트합니다:

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3.  `shared/src` 디렉토리에 새 디렉토리를 생성합니다:
   
    1.  `shared/src` 디렉토리를 마우스 오른쪽 버튼으로 클릭하고 **New | Directory**를 선택합니다. IDE에 옵션 목록이 표시됩니다.
    2.  `iosTest/kotlin` 경로를 입력하여 선택 항목을 좁힌 다음 목록에서 선택합니다:

    ![Creating iOS test directory](create-ios-test-dir.png){width=350}

4.  `iosTest/kotlin` 디렉토리에 새 `org.kmp.testing` 디렉토리를 생성합니다.
5.  이 디렉토리에 `IOSRuntimeTest.kt` 파일을 생성하고 다음 iOS 테스트로 업데이트합니다:

    ```kotlin 
    import kotlin.test.Test
    import kotlin.test.assertEquals
    
    class IOSRuntimeTest {
        @Test
        fun shouldDetectOS() {
            val runtime = determineCurrentRuntime()
            assertEquals(runtime.name, "ios")
            assertEquals(runtime.version, "unknown")
        }
    }
    ```

### 여러 테스트 실행 및 보고서 분석

이 단계에서는 공통, Android, iOS 구현 코드와 해당 테스트를 모두 가지고 있습니다.
프로젝트의 디렉토리 구조는 다음과 같을 것입니다:

![Whole project structure](code-and-test-structure.png){width=300}

컨텍스트 메뉴를 사용하거나 단축키를 사용하여 개별 테스트를 실행할 수 있습니다. 또 다른 옵션은 Gradle 작업을 사용하는 것입니다. 예를 들어, `allTests` Gradle 작업을 실행하면 프로젝트의 모든 테스트가 해당 테스트 러너와 함께 실행됩니다:

![Gradle test tasks](gradle-alltests.png){width=700}

테스트를 실행하면 IDE의 출력 외에도 HTML 보고서가 생성됩니다. 이 보고서는 `shared/build/reports/tests` 디렉토리에서 찾을 수 있습니다:

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

`allTests` 작업을 실행하고 생성된 보고서를 검토합니다:

*   `allTests/index.html` 파일에는 공통 및 iOS 테스트에 대한 통합 보고서가 포함되어 있습니다 (iOS 테스트는 공통 테스트에 의존하며 그 후에 실행됩니다).
*   `testDebugUnitTest` 및 `testReleaseUnitTest` 폴더에는 기본 Android 빌드 플레이버에 대한 보고서가 포함되어 있습니다. (현재 Android 테스트 보고서는 `allTests` 보고서와 자동으로 병합되지 않습니다.)

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

## 멀티플랫폼 프로젝트에서 테스트 사용 규칙

이제 Kotlin 멀티플랫폼 애플리케이션에서 테스트를 생성, 구성 및 실행했습니다.
향후 프로젝트에서 테스트를 사용할 때 다음 사항을 기억하십시오:

*   공통 코드에 대한 테스트를 작성할 때는 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)와 같은 멀티플랫폼 라이브러리만 사용하십시오. 종속성은 `commonTest` 소스 세트에 추가하십시오.
*   `kotlin.test` API의 `Asserter` 타입은 간접적으로만 사용해야 합니다.
    `Asserter` 인스턴스가 보이지만, 테스트에서 직접 사용할 필요는 없습니다.
*   항상 테스트 라이브러리 API 내에서 작업하십시오. 다행히 컴파일러와 IDE는 프레임워크별 기능을 사용하는 것을 방지합니다.
*   `commonTest`에서 테스트를 실행하는 데 어떤 프레임워크를 사용하든 상관없지만, 개발 환경이 올바르게 설정되었는지 확인하기 위해 사용할 각 프레임워크로 테스트를 실행하는 것이 좋습니다.
*   물리적 차이를 고려하십시오. 예를 들어, 스크롤 관성과 마찰 값은 플랫폼 및 장치에 따라 다르므로 동일한 스크롤 속도를 설정해도 스크롤 위치가 다를 수 있습니다. 항상 대상 플랫폼에서 구성 요소를 테스트하여 예상된 동작을 확인하십시오.
*   플랫폼별 코드에 대한 테스트를 작성할 때는 해당 프레임워크의 기능(예: 어노테이션 및 확장)을 사용할 수 있습니다.
*   IDE와 Gradle 작업을 모두 사용하여 테스트를 실행할 수 있습니다.
*   테스트를 실행하면 HTML 테스트 보고서가 자동으로 생성됩니다.

## 다음 단계

*   [멀티플랫폼 프로젝트 구조 이해하기](multiplatform-discover-project.md)에서 멀티플랫폼 프로젝트의 레이아웃을 살펴보십시오.
*   Kotlin 에코시스템에서 제공하는 또 다른 멀티플랫폼 테스팅 프레임워크인 [Kotest](https://kotest.io/)를 확인하십시오.
    Kotest는 다양한 스타일로 테스트를 작성할 수 있도록 하며, 일반적인 테스트 외에 보완적인 접근 방식을 지원합니다.
    여기에는 [데이터 기반](https://kotest.io/docs/framework/datatesting/data-driven-testing.html) 및 [속성 기반](https://kotest.io/docs/proptest/property-based-testing.html) 테스팅이 포함됩니다.