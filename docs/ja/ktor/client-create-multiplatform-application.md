[//]: # (title: クロスプラットフォームモバイルアプリケーションの作成)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>動画</b>: <a href="https://youtu.be/_Q62iJoNOfg">Ktor for Networking in Kotlin Multiplatform Mobile projects</a> 
</p>
</tldr>

<link-summary>
Kotlin Multiplatform Mobileアプリケーションの作成方法を学びます。
</link-summary>

Ktor HTTPクライアントはマルチプラットフォームプロジェクトで使用できます。このチュートリアルでは、リクエストを送信し、レスポンスボディをプレーンなHTMLテキストとして受け取るシンプルなKotlin Multiplatform Mobileアプリケーションを作成します。

> 最初のKotlin Multiplatform Mobileアプリケーションの作成方法については、[最初のクロスプラットフォームモバイルアプリを作成する](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)を参照してください。

## 前提条件 {id="prerequisites"}

まず、適切なオペレーティングシステムに必要なツールをインストールして、クロスプラットフォームモバイル開発のための環境をセットアップする必要があります。これを行う方法については、[環境をセットアップする](https://kotlinlang.org/docs/multiplatform-mobile-setup.html)セクションを参照してください。

> このチュートリアルの一部の手順（iOS固有のコード記述やiOSアプリケーションの実行など）を完了するには、macOSを搭載したMacが必要です。
>
{style="note"}

## 新しいプロジェクトを作成する {id="new-project"}

新しいKotlin Multiplatformプロジェクトを開始するには、2つのアプローチがあります。

-   Android Studio内でテンプレートからプロジェクトを作成できます。
-   あるいは、[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/)を使用して新しいプロジェクトを生成できます。このウィザードでは、プロジェクトのセットアップをカスタマイズするオプションが提供されており、例えばAndroidサポートを除外したり、Ktorサーバーを含めたりすることができます。

このチュートリアルでは、テンプレートからプロジェクトを作成するプロセスを説明します。

1.  Android Studioで、**File | New | New Project**を選択します。
2.  プロジェクトテンプレートのリストから**Kotlin Multiplatform App**を選択し、**Next**をクリックします。
3.  アプリケーションの名前を指定し、**Next**をクリックします。このチュートリアルでは、アプリケーション名は`KmmKtor`です。
4.  次のページで、デフォルト設定のまま**Finish**をクリックして新しいプロジェクトを作成します。
    これで、プロジェクトがセットアップされるのを待ちます。初回は、必要なコンポーネントのダウンロードとセットアップに時間がかかる場合があります。
    > 生成されたマルチプラットフォームプロジェクトの完全な構造を表示するには、[プロジェクトビュー](https://developer.android.com/studio/projects#ProjectView)で**Android**から**Project**に切り替えます。

## ビルドスクリプトを構成する {id="build-script"}

### Kotlin Gradleプラグインを更新する {id="update_gradle_plugins"}

`gradle/libs.versions.toml`ファイルを開き、Kotlinのバージョンを最新に更新します。

```kotlin
kotlin = "2.1.20"
```

undefined

### Ktorの依存関係を追加する {id="ktor-dependencies"}

プロジェクトでKtor HTTPクライアントを使用するには、少なくとも2つの依存関係、つまりクライアント依存関係とエンジン依存関係を追加する必要があります。

`gradle/libs.versions.toml`ファイルにKtorのバージョンを追加します。

```kotlin
[versions]
ktor = "3.2.3"
```

<p>
    KtorのEAPバージョンを使用するには、<a href="#repositories">Spaceリポジトリ</a>を追加する必要があります。
</p>

次に、Ktorクライアントとエンジンライブラリを定義します。

```kotlin
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
```

依存関係を追加するには、`shared/build.gradle.kts`ファイルを開き、以下の手順に従います。

1.  共通コードでKtorクライアントを使用するには、`commonMain`ソースセットに`ktor-client-core`の依存関係を追加します。
    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
        }
    }
    ```

2.  必要な各プラットフォームの[エンジン依存関係](client-engines.md)を対応するソースセットに追加します。
    -   Androidの場合、`androidMain`ソースセットに`ktor-client-okhttp`の依存関係を追加します。
      ```kotlin
      androidMain.dependencies {
          implementation(libs.ktor.client.okhttp)
      }
      ```

        Androidでは、[他のエンジンタイプ](client-engines.md#jvm-android)も使用できます。
    -   iOSの場合、`iosMain`に`ktor-client-darwin`の依存関係を追加します。
      ```kotlin
      iosMain.dependencies {
          implementation(libs.ktor.client.darwin)
      }
      ```

### コルーチンを追加する {id="coroutines"}

[Androidコード](#android-activity)でコルーチンを使用するには、`kotlinx.coroutines`をプロジェクトに追加する必要があります。

1.  `gradle/libs.versions.toml`ファイルを開き、コルーチンのバージョンとライブラリを指定します。

    ```kotlin
    [versions]
    coroutines = "1.9.0"
    [libraries]
    kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
    kotlinx-coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version.ref = "coroutines" }
    
    ```

2.  `build.gradle.kts`ファイルを開き、`kotlinx-coroutines-core`の依存関係を`commonMain`ソースセットに追加します。

    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
            implementation(libs.kotlinx.coroutines.core)
        }
    }
    ```

3.  次に、`androidApp/build.gradle.kts`を開き、`kotlinx-coroutines-android`の依存関係を追加します。

```kotlin
dependencies {
    implementation(libs.kotlinx.coroutines.android)
}
```

`gradle.properties`ファイルの右上隅にある**Sync Now**をクリックして、追加した依存関係をインストールします。

## アプリケーションを更新する {id="code"}

### 共有コード {id="shared-code"}

AndroidとiOSで共有されるコードを更新するには、`shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt`ファイルを開き、`Greeting`クラスに以下のコードを追加します。

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

-   HTTPクライアントを作成するために、`HttpClient`コンストラクタが呼び出されます。
-   サスペンド関数`greeting`は、[リクエスト](client-requests.md)を行い、[レスポンス](client-responses.md)のボディを文字列値として受け取るために使用されます。

### Androidコード {id="android-activity"}

Androidコードからサスペンド関数`greeting`を呼び出すには、[rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))を使用します。

`androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt`ファイルを開き、`MainActivity`のコードを次のように更新します。

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

作成されたスコープ内で、共有の`greeting`関数を呼び出し、発生しうる例外を処理できます。

### iOSコード {id="ios-view"}

1.  `iosApp/iosApp/iOSApp.swift`ファイルを開き、アプリケーションのエントリポイントを更新します。
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

2.  `iosApp/iosApp/ContentView.swift`ファイルを開き、`ContentView`のコードを次のように更新します。
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

    iOSでは、サスペンド関数`greeting`はコールバックを持つ関数として利用できます。

## Androidでインターネットアクセスを有効にする {id="android-internet"}

最後に行う必要があるのは、Androidアプリケーションのインターネットアクセスを有効にすることです。
`androidApp/src/main/AndroidManifest.xml`ファイルを開き、`uses-permission`要素を使用して必要なパーミッションを有効にします。

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## アプリケーションを実行する {id="run"}

作成したマルチプラットフォームアプリケーションをAndroidまたはiOSシミュレーターで実行するには、**androidApp**または**iosApp**を選択し、**Run**をクリックします。
シミュレーターには、受信したHTMLドキュメントがプレーンテキストで表示されるはずです。

<Tabs>
<TabItem title="Android">

![Androidシミュレーター](tutorial_client_kmm_android.png){width="381"}

</TabItem>
<TabItem title="iOS">

![iOSシミュレーター](tutorial_client_kmm_ios.png){width="351"}

</TabItem>
</Tabs>