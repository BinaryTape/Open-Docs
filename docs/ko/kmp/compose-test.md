[//]: # (title: Compose Multiplatform UI 테스트하기)

Compose Multiplatform에서 UI 테스트는 Jetpack Compose 테스트 API와 동일한 찾기 도구(finders), 단언(assertions), 액션(actions), 매처(matchers)를 사용하여 구현됩니다. 이들에 익숙하지 않다면, 이 글을 계속하기 전에 [Jetpack Compose 가이드](https://developer.android.com/jetpack/compose/testing)를 읽어보세요.

> 이 API는 [실험적(Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다.
> 향후 변경될 수 있습니다.
>
{style="warning"}

## Compose Multiplatform 테스트가 Jetpack Compose와 다른 점

Compose Multiplatform 공통 테스트 API는 JUnit의 `TestRule` 클래스에 의존하지 않습니다. 대신, `runComposeUiTest` 함수를 호출하고 `ComposeUiTest` 리시버(receiver)에서 테스트 함수를 호출합니다.

하지만 JUnit 기반 API는 [데스크톱 타겟](compose-desktop-ui-testing.md)에서 사용할 수 있습니다.

## Compose Multiplatform로 테스트 작성 및 실행

먼저, 테스트를 위한 소스 세트(source set)와 필요한 의존성(dependencies)을 모듈에 추가합니다. 그런 다음, 예제 테스트를 작성하고 실행한 후 직접 커스터마이징해 보세요.

### 테스트 소스 세트를 생성하고 테스트 라이브러리를 의존성에 추가

구체적인 예시를 제공하기 위해, 이 페이지의 지침은 [Kotlin Multiplatform 위자드](https://kmp.jetbrains.com/)가 생성하는 프로젝트 구조를 따릅니다. 기존 프로젝트에 테스트를 추가하는 경우, 경로 및 명령어에서 `composeApp`을 테스트하려는 모듈 이름(`shared` 등)으로 바꿔야 할 수도 있습니다.

공통 테스트 소스 세트를 생성하고 필요한 의존성을 추가합니다:

1. 공통 테스트 소스 세트 디렉터리를 생성합니다: `composeApp/src/commonTest/kotlin`.
2. `composeApp/build.gradle.kts` 파일에 다음 의존성을 추가합니다:

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val desktopTest by getting
   
            // Adds common test dependencies
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // Adds the desktop test dependency
            desktopTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3. Android용 계측(instrumented) (에뮬레이터) 테스트를 실행해야 하는 경우, Gradle 설정을 다음과 같이 수정합니다:
   1. `androidTarget {}` 블록에 다음 코드를 추가하여 계측 테스트 소스 세트가 공통 테스트 소스 세트에 의존하도록 구성합니다. 그런 다음, IDE의 제안에 따라 누락된 import를 추가합니다.

      ```kotlin
      kotlin {
          //...
          androidTarget { 
              @OptIn(ExperimentalKotlinGradlePluginApi::class)
              instrumentedTestVariant.sourceSetTree.set(KotlinSourceSetTree.test)
              //...
          }
          //... 
      }
      ```

   2. `android.defaultConfig {}` 블록에 다음 코드를 추가하여 Android 테스트 계측 러너(instrumentation runner)를 구성합니다:

      ```kotlin
      android {
          //...
          defaultConfig {
              //...
              testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
          }
      }
      ```

   3. `androidTarget`에 필요한 의존성을 추가합니다:

       ```kotlin
       kotlin {
            // ...
            androidTarget {
                // ...
                dependencies { 
                    androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
                    debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
                }
            }
        }
       ```

이제 Compose Multiplatform UI를 위한 공통 테스트를 작성하고 실행할 준비가 되었습니다.

### 공통 테스트 작성 및 실행

`composeApp/src/commonTest/kotlin` 디렉터리에 `ExampleTest.kt`라는 파일을 생성하고 다음 코드를 복사합니다:

```kotlin
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.*
import kotlin.test.Test

class ExampleTest {

    @OptIn(ExperimentalTestApi::class)
    @Test
    fun myTest() = runComposeUiTest {
        // Declares a mock UI to demonstrate API calls
        //
        // Replace with your own declarations to test the code of your project
        setContent {
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

        // Tests the declared UI with assertions and actions of the Compose Multiplatform testing API
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

테스트를 실행하려면:

<Tabs>
<TabItem title="iOS 시뮬레이터">

두 가지 옵션이 있습니다:
* Android Studio에서 `myTest()` 함수 옆의 거터(gutter)에 있는 녹색 실행 아이콘을 클릭하고, **Run**을 선택한 후 테스트를 위한 iOS 타겟을 선택할 수 있습니다.
* 터미널에서 다음 명령어를 실행합니다:

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</TabItem>
<TabItem title="Android 에뮬레이터">

터미널에서 다음 명령어를 실행합니다:

```shell
./gradlew :composeApp:connectedAndroidTest
```

현재는 `android (local)` 테스트 구성을 사용하여 공통 Compose Multiplatform 테스트를 실행할 수 없으므로, 예를 들어 Android Studio의 거터 아이콘은 유용하지 않습니다.

</TabItem>
<TabItem title="데스크톱">

두 가지 옵션이 있습니다:
* `myTest()` 함수 옆의 거터(gutter)에 있는 녹색 실행 아이콘을 클릭하고, **Run&nbsp;|&nbsp;desktop**을 선택합니다.
* 터미널에서 다음 명령어를 실행합니다:

   ```shell
   ./gradlew :composeApp:desktopTest
   ```

</TabItem>
<TabItem title="Wasm (헤드리스 브라우저)">

터미널에서 다음 명령어를 실행합니다:

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 다음 단계

이제 Compose Multiplatform UI 테스트에 익숙해졌으니, 테스트 관련 자료를 더 확인해 볼 수 있습니다:
* Kotlin Multiplatform 프로젝트에서 테스트에 대한 일반적인 개요는 [기본 프로젝트 구조 이해하기](multiplatform-discover-project.md#integration-with-tests) 및 [멀티플랫폼 앱 테스트](multiplatform-run-tests.md) 튜토리얼을 참조하세요.
* 데스크톱 타겟을 위한 JUnit 기반 테스트 설정 및 실행에 대한 자세한 내용은 [JUnit으로 Compose Multiplatform UI 테스트하기](compose-desktop-ui-testing.md)를 참조하세요.
* 지역화(localization) 테스트에 대해서는 [undefined](compose-localization-tests.md#testing-locales-on-different-platforms)를 참조하세요.
* 자동화를 포함한 Android Studio의 고급 테스트에 대해서는 Android Studio 문서의 [앱 테스트](https://developer.android.com/studio/test) 아티클에서 다룹니다.