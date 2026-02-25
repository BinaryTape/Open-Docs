[//]: # (title: JUnit을 사용하여 Compose Multiplatform UI 테스트하기)

데스크톱용 Compose Multiplatform은 JUnit 및 Jetpack Compose 테스팅 API를 기반으로 하는 테스팅 API를 제공합니다.
구현에 대한 자세한 내용은 Jetpack Compose 문서의 [Test your Compose layout](https://developer.android.com/develop/ui/compose/testing) 
가이드를 참고하세요.

> 지원되는 모든 플랫폼에서 사용 가능한 UI 테스트 기능에 대해서는 [Testing Compose Multiplatform UI](compose-test.md) 문서를 참고하세요.
>
{style="tip"}

실제로 동작하는 JUnit 기반 테스트를 확인하기 위해, [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/)로 생성된 프로젝트부터 시작해 보겠습니다. 
기존 프로젝트에 테스트를 추가하는 경우, 경로와 명령에 있는 `composeApp`을 테스트하려는 모듈 이름(예: `shared`)으로 
바꿔야 할 수도 있습니다.

테스트 소스 세트를 생성하고 필요한 의존성을 추가합니다:

1. 테스트를 위한 디렉터리를 생성합니다: `composeApp/src/desktopTest/kotlin`.
2. `composeApp/build.gradle.kts` 파일에 다음 의존성을 추가합니다:

   ```kotlin
   kotlin { 
       //...
       sourceSets { 
           //...
           val desktopTest by getting { 
               dependencies {
                   implementation(compose.desktop.uiTestJUnit4)
                   implementation(compose.desktop.currentOs)
               }
           }
       }
   }
   ```

3. `ExampleTest.kt`라는 테스트 파일을 생성하고 다음 코드를 복사해 넣습니다:

    ```kotlin
    import androidx.compose.material.*
    import androidx.compose.runtime.*
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.test.*
    import androidx.compose.ui.platform.testTag
    import androidx.compose.ui.test.junit4.createComposeRule
    import org.junit.Rule
    import org.junit.Test
    
    class ExampleTest {
        @get:Rule
        val rule = createComposeRule()
    
        @Test
        fun myTest(){
            // API 호출을 시연하기 위한 모의(mock) UI를 선언합니다
            //
            // 프로젝트의 코드를 테스트하려면 이 부분을 본인의 선언으로 바꾸세요
            rule.setContent {
                var text by remember { mutableStateOf("Hello") }
   
                Text(
                    text = text,
                    modifier = Modifier.testTag("text")
                )
                Button(
                    onClick = { text = "Compose" },
                    modifier = Modifier.testTag("button")
                ) {
                    Text("Click me")
                }
            }
    
            // JUnit 기반 테스팅 API의 어설션(assertion)과 액션을 사용하여 선언된 UI를 테스트합니다
            rule.onNodeWithTag("text").assertTextEquals("Hello")
            rule.onNodeWithTag("button").performClick()
            rule.onNodeWithTag("text").assertTextEquals("Compose")
        }
    }
    ```

4. 테스트를 실행하려면 `myTest()` 함수 옆의 거터(gutter)에 있는 실행 아이콘을 클릭하거나 터미널에서 다음 명령을 실행하세요:

   ```shell
   ./gradlew desktopTest
   ```
   
## 다음 단계는 무엇인가요?

* [멀티플랫폼 테스트를 생성하고 실행하는 방법](multiplatform-run-tests.md)을 확인해 보세요.
* Kotlin 프로젝트에서의 JUnit 기반 테스트에 대한 일반적인 개요는 [Test code using JUnit in JVM](https://kotlinlang.org/docs/jvm-test-using-junit.html) 튜토리얼을 참고하세요.