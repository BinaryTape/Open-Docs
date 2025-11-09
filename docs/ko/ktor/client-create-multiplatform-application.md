[//]: # (title: 크로스 플랫폼 모바일 애플리케이션 생성)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmp"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Kotlin Multiplatform Mobile 애플리케이션에서 Ktor 클라이언트를 사용하는 방법을 알아보세요.
</link-summary>

Ktor HTTP 클라이언트는 멀티플랫폼 프로젝트에서 사용할 수 있습니다. 이 튜토리얼에서는 요청을 보내고 응답 본문을 일반 HTML 텍스트로 받는 간단한 Kotlin Multiplatform Mobile 애플리케이션을 만들 것입니다.

## 필수 구성 요소 {id="prerequisites"}

먼저, 적합한 운영 체제에 필요한 도구를 설치하여 크로스 플랫폼 모바일 개발 환경을 설정해야 합니다. 이 방법은 [환경 설정](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 섹션에서 알아보세요.

> 이 튜토리얼의 특정 단계(iOS 전용 코드 작성 및 iOS 애플리케이션 실행 포함)를 완료하려면 macOS가 설치된 Mac이 필요합니다.
>
{style="note"}

## 새 프로젝트 생성 {id="new-project"}

새 프로젝트를 생성하려면 IntelliJ IDEA에서 Kotlin Multiplatform 프로젝트 마법사를 사용할 수 있습니다. 이 마법사는 클라이언트 및 서비스로 확장할 수 있는 기본적인 멀티플랫폼 프로젝트를 생성합니다.

<procedure>

1.  IntelliJ IDEA를 실행합니다.
2.  IntelliJ IDEA에서 **File | New | Project**를 선택합니다.
3.  왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.
4.  **New Project** 창에서 다음 필드를 지정합니다:
    *   **이름**: KmpKtor
    *   **그룹**: com.example.ktor
      ![Kotlin Multiplatform wizard settings](tutorial_client_kmp_create_project.png){ width="450" width="706" border-effect="rounded" style="block" }
5.  **Android** 및 **iOS** 타겟을 선택합니다.
6.  iOS의 경우, UI를 네이티브로 유지하려면 **UI 공유 안 함** 옵션을 선택합니다.
7.  **Create** 버튼을 클릭하고 IDE가 프로젝트를 생성하고 임포트할 때까지 기다립니다.

</procedure>

## 빌드 스크립트 구성 {id="build-script"}

### Ktor 종속성 추가 {id="ktor-dependencies"}

프로젝트에서 Ktor HTTP 클라이언트를 사용하려면 최소 두 가지 종속성을 추가해야 합니다: 클라이언트 종속성과 [엔진](client-engines.md) 종속성입니다.

1.  <Path>gradle/libs.versions.toml</Path> 파일을 열고 Ktor 버전을 추가합니다:

    ```kotlin
    [versions]
    ktor = "3.3.2"
    ```

2.  동일한 <Path>gradle/libs.versions.toml</Path> 파일에서 Ktor 클라이언트 및 엔진 라이브러리를 정의합니다:

    ```kotlin
    [libraries]
    ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
    ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
    ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
    ```

3.  <Path>shared/build.gradle.kts</Path> 파일을 열고 다음 종속성을 추가합니다:

    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
        }
        androidMain.dependencies {
            implementation(libs.ktor.client.okhttp)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
    }
    ```

    -   `ktor-client-core`를 `commonMain` 소스 세트에 추가하여 공유 코드에서 Ktor 클라이언트 기능을 활성화합니다.
    -   `androidMain` 소스 세트에 `ktor-client-okhttp` 종속성을 포함하여 Android에서 `OkHttp` 엔진을 사용합니다. 또는 [다른 사용 가능한 Android/JVM 엔진](client-engines.md#jvm-android) 중에서 선택할 수 있습니다.
    -   `iosMain` 소스 세트에 `ktor-client-darwin` 종속성을 추가하여 iOS에서 Darwin 엔진을 사용합니다.

### 코루틴 추가 {id="coroutines"}

[Android 코드](#android-activity)에서 코루틴을 사용하려면 프로젝트에 `kotlinx.coroutines`를 추가해야 합니다:

1.  <Path>gradle/libs.versions.toml</Path> 파일을 열고 코루틴 버전과 라이브러리를 지정합니다:

    ```kotlin
    [versions]
    kotlinx-coroutines = "1.10.2"
    
    [libraries]
    kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinx-coroutines" }
    kotlinx-coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version.ref = "kotlinx-coroutines" }
    ```

2.  <Path>shared/build.gradle.kts</Path> 파일을 열고 `kotlinx-coroutines-core` 종속성을 `commonMain` 소스 세트에 추가합니다:

    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
            implementation(libs.kotlinx.coroutines.core)
        }
    }
    ```

3.  그런 다음, <Path>composeApp/build.gradle.kts</Path> 파일을 열고 `kotlinx-coroutines-android` 종속성을 `androidMain` 소스 세트에 추가합니다:

    ```kotlin
    sourceSets {
        androidMain.dependencies {
            // ...
            implementation(libs.kotlinx.coroutines.android)
        }
    }
    ```

4.  추가된 종속성을 설치하려면 **Build | Sync Project with Gradle Files**를 선택합니다.

## 애플리케이션 업데이트 {id="code"}

### 공유 코드 {id="shared-code"}

Android와 iOS 간에 공유되는 코드를 업데이트하려면 <Path>shared/src/commonMain/kotlin/com/example/ktor/kmpktor/Greeting.kt</Path> 파일을 열고 `Greeting` 클래스에 다음 코드를 추가합니다:

```kotlin
package com.example.ktor.kmpktor

import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText

class Greeting {
    private val client = HttpClient()

    suspend fun greet(): String {
        val response = client.get("https://ktor.io/docs/")
        return response.bodyAsText()
    }
}
```

-   `HttpClient` 생성자가 HTTP 클라이언트를 생성합니다.
-   정지 함수 `greet()`는 [요청](client-requests.md)을 보내고 [응답](client-responses.md) 본문을 문자열 값으로 받습니다.

### Android 코드 {id="android-activity"}

<Path>composeApp/src/androidMain/kotlin/com/example/ktor/kmpktor/App.kt</Path> 파일을 열고 코드를 다음과 같이 업데이트합니다:

```kotlin
package com.example.ktor.kmpktor

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.MaterialTheme
import androidx.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
@Preview
fun App() {
    MaterialTheme {
        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            var text by remember { mutableStateOf("Loading") }
            LaunchedEffect(true) {
                text = try {
                    Greeting().greet()
                } catch (e: Exception) {
                    e.message ?: "error"
                }
            }
            GreetingView(text)
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
    MaterialTheme {
        GreetingView("Hello, Android!")
    }
}
```

`LaunchedEffect()`는 컴포저블의 수명 주기에 연결된 코루틴을 시작합니다. 이 코루틴 내에서 공유 `greet()` 함수가 호출되고, 그 결과가 `text`에 할당되며, 발생할 수 있는 모든 예외는 포착되어 처리됩니다.

### iOS 코드 {id="ios-view"}

<Path>iosApp/iosApp/ContentView.swift</Path> 파일을 열고 코드를 다음과 같이 업데이트합니다:

```Swift
import SwiftUI
import Shared

struct ContentView: View {
    @StateObject private var viewModel = ViewModel()

    var body: some View {
        Text(viewModel.text)
    }
}

extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var text = "Loading..."
        init() {
            Greeting().greet { greeting, error in
                if let greeting = greeting {
                    self.text = greeting
                } else {
                    self.text = error?.localizedDescription ?? "error"
                }
            }
        }
    }
}
```

iOS에서는 `greet()` 정지 함수가 콜백이 있는 함수로 제공됩니다.

## Android에서 인터넷 액세스 활성화 {id="android-internet"}

마지막 단계는 Android 애플리케이션에 대한 인터넷 액세스를 활성화하는 것입니다.
<Path>composeApp/src/androidMain/AndroidManifest.xml</Path> 파일을 열고 `&lt;uses-permission&gt;` 요소를 사용하여 필요한 권한을 활성화합니다:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## Android에서 애플리케이션 실행 {id="run-android"}

1.  IntelliJ IDEA에서 실행 구성 목록에서 **composeApp**을 선택합니다.
2.  구성 목록 옆에 있는 Android 가상 기기를 선택하고 **Run**을 클릭합니다.
    ![composeApp selected with a Pixel 8 API device](tutorial_client_kmp_run_android.png){width="381" style="block"}

    목록에 기기가 없는 경우, [새 Android 가상 기기](https://developer.android.com/studio/run/managing-avds#createavd)를 생성합니다.
3.  로드되면 시뮬레이터는 수신된 HTML 문서를 일반 텍스트로 표시해야 합니다.
    ![Android simulator](tutorial_client_kmp_android.png){width="381" style="block"}

> Android 에뮬레이터가 인터넷에 연결할 수 없는 경우, 콜드 부트를 시도해 보세요.
> **기기 관리자** 도구 창에서 중지된 기기 옆에 있는 **⋮** (점 3개)를 클릭하고 메뉴에서 **Cold Boot**를 선택합니다. 이는 연결 문제를 일으킬 수 있는 손상된 에뮬레이터 캐시를 지우는 데 종종 도움이 됩니다.
>
{style="tip"}

## iOS에서 애플리케이션 실행 {id="run-ios"}

1.  IntelliJ IDEA에서 실행 구성 목록에서 **iosApp**을 선택합니다.
2.  구성 목록 옆에 있는 iOS 시뮬레이션 기기를 선택하고 **Run**을 클릭합니다.
    ![iOsApp selected with iPhone 16 device](tutorial_client_kmp_run_ios.png){width="381" style="block"}

    목록에 사용 가능한 iOS 구성이 없는 경우, [새 실행 구성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html#run-on-a-new-ios-simulated-device)을 추가합니다.
3.  로드되면 시뮬레이터는 수신된 HTML 문서를 일반 텍스트로 표시해야 합니다.
    ![iOS simulator](tutorial_client_kmp_ios.png){width="381" style="block"}