[//]: # (title: Compose Multiplatform UI 테스트)

Compose Multiplatform의 UI 테스트는 Jetpack Compose 테스트 API와 동일한 파인더(finder), 어설션(assertion), 액션(action) 및 매처(matcher)를 사용하여 구현됩니다. 이러한 개념이 익숙하지 않다면 이 문서를 계속 읽기 전에 [Jetpack Compose 가이드](https://developer.android.com/jetpack/compose/testing)를 먼저 읽어보시기 바랍니다.

> 이 API는 [실험적(Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 단계입니다.
> 향후 변경될 수 있습니다.
>
{style="warning"}

## Compose Multiplatform 테스트와 Jetpack Compose의 차이점

Compose Multiplatform의 공통 테스트 API는 JUnit의 `TestRule` 클래스에 의존하지 않습니다. 대신 `runComposeUiTest` 함수를 호출하고 `ComposeUiTest` 수신 객체(receiver)에서 테스트 함수를 호출합니다.

하지만 [데스크톱 타겟](compose-desktop-ui-testing.md)의 경우 JUnit 기반 API를 사용할 수 있습니다.

## Compose Multiplatform에서 테스트 작성 및 실행하기

먼저, 모듈에 테스트를 위한 소스 세트와 필요한 의존성을 추가합니다. 그런 다음 예제 테스트를 작성 및 실행하고 필요에 맞게 수정해 보십시오.

### 테스트 소스 세트 생성 및 테스트 라이브러리 의존성 추가

구체적인 예를 제공하기 위해, 이 페이지의 지침은 [Kotlin Multiplatform 마법사](https://kmp.jetbrains.com/)에서 생성된 프로젝트 구조를 따릅니다. 기존 프로젝트에 테스트를 추가하는 경우, 경로와 명령에서 `composeApp`을 테스트하려는 모듈 이름(예: `shared`)으로 바꿔야 할 수도 있습니다.

공통 테스트 소스 세트를 생성하고 필요한 의존성을 추가합니다:

1. 공통 테스트 소스 세트를 위한 디렉토리를 생성합니다: `composeApp/src/commonTest/kotlin`.
2. `composeApp/build.gradle.kts` 파일에 다음 구성을 추가합니다:

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val jvmTest by getting
   
            // 공통 테스트 의존성 추가
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // 데스크톱 테스트 의존성 추가
            jvmTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3. Android용 인스트루먼티드(에뮬레이터) 테스트를 실행해야 하는 경우, 다음과 같이 Gradle 구성을 수정합니다:
   1. `androidTarget {}` 블록에 다음 코드를 추가하여 인스트루먼티드 테스트 소스 세트가 공통 테스트 소스 세트에 의존하도록 구성합니다.

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
   2. IDE의 제안에 따라 누락된 import를 추가합니다.
   3. `android.defaultConfig {}` 블록에 다음 코드를 추가하여 Android 테스트 인스트루먼테이션 러너를 구성합니다:

      ```kotlin
      android {
          //...
          defaultConfig {
              //...
              testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
          }
      }
      ```

   4. 루트 `dependencies {}` 블록에 필요한 의존성을 추가합니다:

       ```kotlin
       dependencies { 
           androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
           debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
       }
       ```
4. 메인 메뉴에서 **Build | Sync Project with Gradle Files**를 선택하거나 빌드 스크립트 편집기에서 Gradle 새로고침 버튼을 클릭합니다.

이제 Compose Multiplatform UI를 위한 공통 테스트를 작성하고 실행할 준비가 되었습니다.

### 공통 테스트 작성 및 실행

`composeApp/src/commonTest/kotlin` 디렉토리에 `ExampleTest.kt`라는 이름의 파일을 생성하고 다음 코드를 복사해 넣습니다:

```kotlin
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertTextEquals
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.runComposeUiTest
import kotlin.test.Test

class ExampleTest {

    @OptIn(ExperimentalTestApi::class)
    @Test
    fun myTest() = runComposeUiTest {
        // API 호출을 시연하기 위한 모의(mock) UI 선언
        //
        // 프로젝트의 코드를 테스트하려면 이 부분을 본인의 선언으로 교체하세요
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

        // Compose Multiplatform 테스트 API의 어설션과 액션으로 선언된 UI 테스트
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

테스트 실행 방법:

<Tabs>
<TabItem title="iOS Simulator">

두 가지 옵션이 있습니다:
* Android Studio에서 `myTest()` 함수 옆의 거터(gutter)에 있는 초록색 실행 아이콘을 클릭하고, **Run | ExampleTest.myTest**를 선택한 다음 테스트를 위한 iOS 타겟을 선택합니다.
* 터미널에서 다음 명령을 실행합니다:

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</TabItem>
<TabItem title="Android Emulator">

터미널에서 다음 명령을 실행합니다:

```shell
./gradlew :composeApp:connectedAndroidTest
```

현재 `android (local)` 테스트 구성을 사용해서는 공통 Compose Multiplatform 테스트를 실행할 수 없으므로, Android Studio의 거터 아이콘 등은 도움이 되지 않습니다.

</TabItem>
<TabItem title="Desktop">

두 가지 옵션이 있습니다:
* `myTest()` 함수 옆의 거터에 있는 초록색 실행 아이콘을 클릭하고 **Run | ExampleTest.myTest**를 선택한 다음 JVM 타겟을 선택합니다.
* 터미널에서 다음 명령을 실행합니다:

   ```shell
   ./gradlew :composeApp:jvmTest
   ```

</TabItem>
<TabItem title="Wasm (headless browser)">

터미널에서 다음 명령을 실행합니다:

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 다음 단계

이제 Compose Multiplatform UI 테스트를 익혔으니, 더 많은 테스트 관련 리소스를 확인해 보시기 바랍니다:
* Kotlin Multiplatform 프로젝트의 테스트에 대한 일반적인 개요는 [기본 프로젝트 구조 이해하기](multiplatform-discover-project.md#integration-with-tests) 및 [멀티플랫폼 앱 테스트](multiplatform-run-tests.md) 튜토리얼을 참조하세요.
* 데스크톱 타겟을 위한 JUnit 기반 테스트 설정 및 실행에 대한 자세한 내용은 [JUnit으로 Compose Multiplatform UI 테스트하기](compose-desktop-ui-testing.md)를 참조하세요.
* 로컬라이제이션(현지화) 테스트는 [다른 플랫폼에서 로케일 테스트하기](compose-localization-tests.md#testing-locales-on-different-platforms)를 참조하세요.
* 자동화를 포함한 Android Studio에서의 고급 테스트는 Android Studio 문서의 [앱 테스트](https://developer.android.com/studio/test) 문서를 참조하세요.