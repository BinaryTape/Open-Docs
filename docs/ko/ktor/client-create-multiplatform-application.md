[//]: # (title: 크로스 플랫폼 모바일 애플리케이션 생성)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>비디오</b>: <a href="https://youtu.be/_Q62iJoNOfg">Kotlin Multiplatform Mobile 프로젝트에서 네트워킹을 위한 Ktor</a> 
</p>
</tldr>

<link-summary>
Kotlin Multiplatform Mobile 애플리케이션을 생성하는 방법을 알아보세요.
</link-summary>

Ktor HTTP 클라이언트는 멀티플랫폼 프로젝트에서 사용할 수 있습니다. 이 튜토리얼에서는 요청을 보내고 응답 본문을 일반 HTML 텍스트로 받는 간단한 Kotlin Multiplatform Mobile 애플리케이션을 만들 것입니다.

> 첫 번째 Kotlin Multiplatform Mobile 애플리케이션을 만드는 방법을 알아보려면, [첫 번째 크로스 플랫폼 모바일 앱 만들기](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)를 참조하세요.

## 필수 구성 요소 {id="prerequisites"}

먼저, 적합한 운영 체제에 필요한 도구를 설치하여 크로스 플랫폼 모바일 개발 환경을 설정해야 합니다. 이 방법은 [환경 설정](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 섹션에서 알아보세요.

> 이 튜토리얼의 특정 단계(iOS 전용 코드 작성 및 iOS 애플리케이션 실행 포함)를 완료하려면 macOS가 설치된 Mac이 필요합니다.
>
{style="note"}

## 새 프로젝트 생성 {id="new-project"}

새 Kotlin Multiplatform 프로젝트를 시작하는 데는 두 가지 방법이 있습니다:

- Android Studio 내의 템플릿에서 프로젝트를 생성할 수 있습니다.
- 또는 [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/)를 사용하여 새 프로젝트를 생성할 수 있습니다. 이 마법사는 프로젝트 설정을 사용자 지정할 수 있는 옵션을 제공하여, 예를 들어 Android 지원을 제외하거나 Ktor Server를 포함할 수 있도록 합니다.

이 튜토리얼에서는 템플릿에서 프로젝트를 생성하는 과정을 시연합니다:

1. Android Studio에서 **File | New | New Project**를 선택합니다.
2. 프로젝트 템플릿 목록에서 **Kotlin Multiplatform App**을 선택하고 **Next**를 클릭합니다.
3. 애플리케이션 이름을 지정하고 **Next**를 클릭합니다. 이 튜토리얼에서 애플리케이션 이름은 `KmmKtor`입니다.
4. 다음 페이지에서 기본 설정을 그대로 두고 **Finish**를 클릭하여 새 프로젝트를 생성합니다.
   이제 프로젝트가 설정될 때까지 기다립니다. 처음으로 이 작업을 수행할 때는 필요한 구성 요소를 다운로드하고 설정하는 데 시간이 걸릴 수 있습니다.
   > 생성된 멀티플랫폼 프로젝트의 전체 구조를 보려면, [프로젝트 뷰](https://developer.android.com/studio/projects#ProjectView)에서 **Android**를 **Project**로 전환합니다.

## 빌드 스크립트 구성 {id="build-script"}

### Kotlin Gradle 플러그인 업데이트 {id="update_gradle_plugins"}

`gradle/libs.versions.toml` 파일을 열고 Kotlin 버전을 최신으로 업데이트합니다:

```kotlin
kotlin = "2.1.20"
```

### Ktor 종속성 추가 {id="ktor-dependencies"}

프로젝트에서 Ktor HTTP 클라이언트를 사용하려면 클라이언트 종속성과 엔진 종속성이라는 최소 두 가지 종속성을 추가해야 합니다.

`gradle/libs.versions.toml` 파일에 Ktor 버전을 추가합니다:

```kotlin
[versions]
ktor = "3.2.3"
```

<p>
    Ktor EAP 버전을 사용하려면 <a href="#repositories">Space 저장소</a>를 추가해야 합니다.
</p>

그런 다음, Ktor 클라이언트 및 엔진 라이브러리를 정의합니다:

```kotlin
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
```

종속성을 추가하려면 `shared/build.gradle.kts` 파일을 열고 다음 단계를 따릅니다:

1. 공통 코드에서 Ktor 클라이언트를 사용하려면 `ktor-client-core` 종속성을 `commonMain` 소스 세트에 추가합니다:
   ```kotlin
   sourceSets {
       commonMain.dependencies {
           implementation(libs.ktor.client.core)
       }
   }
   ```

2. 각 필수 플랫폼에 대해 [엔진 종속성](client-engines.md)을 해당 소스 세트에 추가합니다:
    - Android의 경우, `ktor-client-okhttp` 종속성을 `androidMain` 소스 세트에 추가합니다:
      ```kotlin
      androidMain.dependencies {
          implementation(libs.ktor.client.okhttp)
      }
      ```

      Android의 경우, [다른 엔진 유형](client-engines.md#jvm-android)을 사용할 수도 있습니다.
    - iOS의 경우, `ktor-client-darwin` 종속성을 `iosMain`에 추가합니다:
      ```kotlin
      iosMain.dependencies {
          implementation(libs.ktor.client.darwin)
      }
      ```

### 코루틴 추가 {id="coroutines"}

[Android 코드](#android-activity)에서 코루틴을 사용하려면 프로젝트에 `kotlinx.coroutines`를 추가해야 합니다:

1. `gradle/libs.versions.toml` 파일을 열고 코루틴 버전과 라이브러리를 지정합니다:

    ```kotlin
    [versions]
    coroutines = "1.9.0"
    [libraries]
    kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
    kotlinx-coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version.ref = "coroutines" }
    
    ```

2. `build.gradle.kts` 파일을 열고 `kotlinx-coroutines-core` 종속성을 `commonMain` 소스 세트에 추가합니다:

    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
            implementation(libs.kotlinx.coroutines.core)
        }
    }
    ```

3. 그런 다음, `androidApp/build.gradle.kts`를 열고 `kotlinx-coroutines-android` 종속성을 추가합니다:

```kotlin
dependencies {
    implementation(libs.kotlinx.coroutines.android)
}
```

`gradle.properties` 파일의 오른쪽 상단 모서리에 있는 **Sync Now**를 클릭하여 추가된 종속성을 설치합니다.

## 애플리케이션 업데이트 {id="code"}

### 공유 코드 {id="shared-code"}

Android와 iOS 간에 공유되는 코드를 업데이트하려면 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 파일을 열고 다음 코드를 `Greeting` 클래스에 추가합니다:

```kotlin
package com.example.kmmktor

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

class Greeting {
    private val client = HttpClient()

    suspend fun greeting(): String {
        val response = client.get("https://ktor.io/docs/")
        return response.bodyAsText()
    }
}
```

- HTTP 클라이언트를 생성하려면 `HttpClient` 생성자가 호출됩니다.
- 정지 함수 `greeting`은 [요청](client-requests.md)을 보내고 [응답](client-responses.md) 본문을 문자열 값으로 받는 데 사용됩니다.

### Android 코드 {id="android-activity"}

Android 코드에서 정지 함수 `greeting`을 호출하려면 [rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))를 사용합니다.

`androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` 파일을 열고 `MainActivity` 코드를 다음과 같이 업데이트합니다:

```kotlin
package com.example.kmmktor.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.kmmktor.Greeting
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val scope = rememberCoroutineScope()
                    var text by remember { mutableStateOf("Loading") }
                    LaunchedEffect(true) {
                        scope.launch {
                            text = try {
                                Greeting().greeting()
                            } catch (e: Exception) {
                                e.localizedMessage ?: "error"
                            }
                        }
                    }
                    GreetingView(text)
                }
            }
        }
    }
}

@Composable
fun GreetingView(text: String) {
    Text(text = text)
}

@Preview
@Composable
fun DefaultPreview() {
    MyApplicationTheme {
        GreetingView("Hello, Android!")
    }
}

```

생성된 스코프 내에서 공유 `greeting` 함수를 호출하고 가능한 예외를 처리할 수 있습니다.

### iOS 코드 {id="ios-view"}

1. `iosApp/iosApp/iOSApp.swift` 파일을 열고 애플리케이션의 진입점을 업데이트합니다:
   ```Swift
   import SwiftUI
   
   @main
   struct iOSApp: App {
   	var body: some Scene {
   		WindowGroup {
   			ContentView(viewModel: ContentView.ViewModel())
   		}
   	}
   }
   ```

2. `iosApp/iosApp/ContentView.swift` 파일을 열고 `ContentView` 코드를 다음과 같이 업데이트합니다:
   ```Swift
   import SwiftUI
   import shared
   
   struct ContentView: View {
       @ObservedObject private(set) var viewModel: ViewModel
   
       var body: some View {
           Text(viewModel.text)
       }
   }
   
   extension ContentView {
       class ViewModel: ObservableObject {
           @Published var text = "Loading..."
           init() {
               Greeting().greeting { greeting, error in
                   DispatchQueue.main.async {
                       if let greeting = greeting {
                           self.text = greeting
                       } else {
                           self.text = error?.localizedDescription ?? "error"
                       }
                   }
               }
           }
       }
   }
   ```

   iOS에서는 `greeting` 정지 함수가 콜백이 있는 함수로 제공됩니다.

## Android에서 인터넷 액세스 활성화 {id="android-internet"}

마지막으로 Android 애플리케이션에 대한 인터넷 액세스를 활성화해야 합니다.
`androidApp/src/main/AndroidManifest.xml` 파일을 열고 `uses-permission` 요소를 사용하여 필요한 권한을 활성화합니다:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## 애플리케이션 실행 {id="run"}

생성된 멀티플랫폼 애플리케이션을 Android 또는 iOS 시뮬레이터에서 실행하려면 **androidApp** 또는 **iosApp**을 선택하고 **Run**을 클릭합니다.
시뮬레이터는 수신된 HTML 문서를 일반 텍스트로 표시해야 합니다.

<Tabs>
<TabItem title="Android">

![Android 시뮬레이터](tutorial_client_kmm_android.png){width="381"}

</TabItem>
<TabItem title="iOS">

![iOS 시뮬레이터](tutorial_client_kmm_ios.png){width="351"}

</TabItem>
</Tabs>