[//]: # (title: クロスプラットフォームモバイルアプリケーションの作成)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmp"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Kotlin Multiplatform MobileアプリケーションでKtorクライアントを使用する方法を学びます。
</link-summary>

Ktor HTTPクライアントはマルチプラットフォームプロジェクトで使用できます。このチュートリアルでは、リクエストを送信し、レスポンスボディをプレーンなHTMLテキストとして受け取るシンプルなKotlin Multiplatform Mobileアプリケーションを作成します。

## 前提条件 {id="prerequisites"}

まず、適切なオペレーティングシステムに必要なツールをインストールして、クロスプラットフォームモバイル開発のための環境をセットアップする必要があります。これを行う方法については、[環境をセットアップする](https://kotlinlang.org/docs/multiplatform-mobile-setup.html)セクションを参照してください。

> このチュートリアルの一部の手順（iOS固有のコード記述やiOSアプリケーションの実行など）を完了するには、macOSを搭載したMacが必要です。
>
{style="note"}

## 新しいプロジェクトを作成する {id="new-project"}

新しいプロジェクトを作成するには、IntelliJ IDEAのKotlin Multiplatformプロジェクトウィザードを使用できます。これにより、クライアントとサービスを拡張できる基本的なマルチプラットフォームプロジェクトが作成されます。

<procedure>

1.  IntelliJ IDEAを起動します。
2.  IntelliJ IDEAで、**File | New | Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。
4.  **New Project**ウィンドウで、以下のフィールドを指定します。
    *   **名前**: KmpKtor
    *   **グループ**: com.example.ktor
      ![Kotlin Multiplatform wizard settings](tutorial_client_kmp_create_project.png){ width="450" width="706" border-effect="rounded" style="block" }
5.  **Android**と**iOS**ターゲットを選択します。
6.  iOSの場合、UIをネイティブに保つために、**Do not share UI**オプションを選択します。
7.  **Create**ボタンをクリックし、IDEがプロジェクトを生成してインポートするのを待ちます。

</procedure>

## ビルドスクリプトを構成する {id="build-script"}

### Ktorの依存関係を追加する {id="ktor-dependencies"}

プロジェクトでKtor HTTPクライアントを使用するには、少なくとも2つの依存関係、つまりクライアント依存関係と[エンジン](client-engines.md)依存関係を追加する必要があります。

1.  <Path>gradle/libs.versions.toml</Path>ファイルを開き、Ktorのバージョンを追加します。

    ```kotlin
    [versions]
    ktor = "3.3.1"
    ```

2.  同じ<Path>gradle/libs.versions.toml</Path>ファイルで、Ktorクライアントとエンジンライブラリを定義します。

    ```kotlin
    [libraries]
    ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
    ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
    ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
    ```

3.  <Path>shared/build.gradle.kts</Path>ファイルを開き、以下の依存関係を追加します。

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

    -   `ktor-client-core`を`commonMain`ソースセットに追加して、共有コードでKtorクライアント機能を有効にします。
    -   `androidMain`ソースセットに、Androidで`OkHttp`エンジンを使用するための`ktor-client-okhttp`依存関係を含めます。代替として、[他の利用可能なAndroid/JVMエンジン](client-engines.md#jvm-android)から選択することもできます。
    -   `iosMain`ソースセットに、iOSでDarwinエンジンを使用するための`ktor-client-darwin`依存関係を追加します。

### コルーチンを追加する {id="coroutines"}

[Androidコード](#android-activity)でコルーチンを使用するには、`kotlinx.coroutines`をプロジェクトに追加する必要があります。

1.  <Path>gradle/libs.versions.toml</Path>ファイルを開き、コルーチンのバージョンとライブラリを指定します。

    ```kotlin
    [versions]
    kotlinx-coroutines = "1.10.2"
    
    [libraries]
    kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinx-coroutines" }
    kotlinx-coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version.ref = "kotlinx-coroutines" }
    ```

2.  <Path>shared/build.gradle.kts</Path>ファイルを開き、`kotlinx-coroutines-core`依存関係を`commonMain`ソースセットに追加します。

    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
            implementation(libs.kotlinx.coroutines.core)
        }
    }
    ```

3.  次に、<Path>composeApp/build.gradle.kts</Path>ファイルを開き、`kotlinx-coroutines-android`依存関係を`androidMain`ソースセットに追加します。

    ```kotlin
    sourceSets {
        androidMain.dependencies {
            // ...
            implementation(libs.kotlinx.coroutines.android)
        }
    }
    ```

4.  追加した依存関係をインストールするために、**Build | Sync Project with Gradle Files**を選択します。

## アプリケーションを更新する {id="code"}

### 共有コード {id="shared-code"}

AndroidとiOS間で共有されるコードを更新するには、<Path>shared/src/commonMain/kotlin/com/example/ktor/kmmktor/Greeting.kt</Path>ファイルを開き、`Greeting`クラスに以下のコードを追加します。

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

-   `HttpClient`コンストラクタはHTTPクライアントを作成します。
-   サスペンド関数`greet()`は[リクエスト](client-requests.md)を行い、[レスポンス](client-responses.md)のボディを文字列値として受け取ります。

### Androidコード {id="android-activity"}

<Path>composeApp/src/androidMain/kotlin/com/example/ktor/kmmktor/App.kt</Path>ファイルを開き、コードを次のように更新します。

```kotlin
package com.example.ktor.kmpktor

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
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

`LaunchedEffect()`は、コンポーザブルのライフサイクルに関連付けられたコルーチンを起動します。このコルーチン内で、共有の`greet()`関数が呼び出され、その結果が`text`に割り当てられ、発生した例外はキャッチされて処理されます。

### iOSコード {id="ios-view"}

<Path>iosApp/iosApp/ContentView.swift</Path>ファイルを開き、コードを次のように更新します。

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

iOSでは、サスペンド関数`greet()`はコールバックを持つ関数として利用できます。

## Androidでインターネットアクセスを有効にする {id="android-internet"}

最後に行う必要があるのは、Androidアプリケーションのインターネットアクセスを有効にすることです。
<Path>composeApp/src/androidMain/AndroidManifest.xml</Path>ファイルを開き、`&lt;uses-permission&gt;`要素を使用して必要なパーミッションを有効にします。

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## Androidでアプリケーションを実行する {id="run-android"}

1.  IntelliJ IDEAで、実行構成のリストから**composeApp**を選択します。
2.  構成リストの横にあるAndroid仮想デバイスを選択し、**Run**をクリックします。
    ![composeApp selected with a Pixel 8 API device](tutorial_client_kmp_run_android.png){width="381" style="block"}

    リストにデバイスがない場合は、[新しいAndroid仮想デバイス](https://developer.android.com/studio/run/managing-avds#createavd)を作成します。
3.  ロードされると、シミュレーターは受信したHTMLドキュメントをプレーンテキストで表示するはずです。
    ![Android simulator](tutorial_client_kmp_android.png){width="381" style="block"}

> Androidエミュレーターがインターネットに接続できない場合は、コールドブートを試してください。**Device Manager**ツールウィンドウで、停止しているデバイスの横にある**⋮**（3つの点）をクリックし、メニューから**Cold Boot**を選択します。これは、接続の問題を引き起こす可能性のある破損したエミュレーターキャッシュをクリアするのに役立つことがよくあります。
>
{style="tip"}

## iOSでアプリケーションを実行する {id="run-ios"}

1.  IntelliJ IDEAで、実行構成のリストから**iosApp**を選択します。
2.  構成リストの横にあるiOSシミュレートされたデバイスを選択し、**Run**をクリックします。
    ![iOsApp selected with iPhone 16 device](tutorial_client_kmp_run_ios.png){width="381" style="block"}

    リストに利用可能なiOS構成がない場合は、[新しい実行構成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html#run-on-a-new-ios-simulated-device)を追加してください。
3.  ロードされると、シミュレーターは受信したHTMLドキュメントをプレーンテキストで表示するはずです。
    ![iOS simulator](tutorial_client_kmp_ios.png){width="381" style="block"}