[//]: # (title: iOSとAndroid間でさらにロジックを共有する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも進めることができます。どちらのIDEも同じコア機能とKotlin Multiplatformサポートを共有しています。</p>
    <br/>
    <p>これは、<strong>共有ロジックとネイティブUIを備えたKotlin Multiplatformアプリの作成</strong>チュートリアルの4番目のパートです。続行する前に、以前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">Kotlin Multiplatformアプリを作成する</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">ユーザーインターフェースを更新する</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-dependencies.md">依存関係を追加する</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>ロジックをさらに共有する</strong><br/>
      <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> プロジェクトを仕上げる<br/>
    </p>
</tldr>

外部依存関係を使用して共通ロジックを実装したので、より複雑なロジックを追加し始めることができます。ネットワークリクエストとデータシリアル化は、Kotlin Multiplatformを使用してコードを共有するための[最も一般的なユースケース](https://kotlinlang.org/lp/multiplatform/)です。このオンボーディングジャーニーを完了した後、今後のプロジェクトでそれらを使用できるように、最初のアプリケーションでそれらを実装する方法を学びましょう。

更新されたアプリは、[SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)からインターネット経由でデータを取得し、SpaceXロケットの最後の成功した打ち上げ日を表示します。

> プロジェクトの最終状態は、異なるコルーチンソリューションを含むGitHubリポジトリの2つのブランチで見つけることができます。
> * [`main`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main)ブランチにはKMP-NativeCoroutines実装が含まれます。
> * [`main-skie`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie)ブランチにはSKIE実装が含まれます。
>
{style="note"}

## 依存関係をさらに追加する

プロジェクトに以下のマルチプラットフォームライブラリを追加する必要があります。

*   [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)：非同期コードでコルーチンを使用し、同時操作を可能にするため。
*   [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)：JSONレスポンスを、ネットワーク操作の処理に使用されるエンティティクラスのオブジェクトにデシリアライズするため。
*   [Ktor](https://ktor.io/)：インターネット経由でデータを取得するためのHTTPクライアントを作成するフレームワーク。

### kotlinx.coroutines

`kotlinx.coroutines`をプロジェクトに追加するには、共通ソースセットに依存関係を指定します。これを行うには、共有モジュールの`build.gradle.kts`ファイルに以下の行を追加します。

```kotlin
kotlin {
    // ... 
    sourceSets {
        commonMain.dependencies {
           // ...
           implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

Multiplatform Gradleプラグインは、`kotlinx.coroutines`のプラットフォーム固有の（iOSおよびAndroid）部分に依存関係を自動的に追加します。

### kotlinx.serialization

`kotlinx.serialization`ライブラリを使用するには、対応するGradleプラグインを設定します。
これを行うには、共有モジュールの`build.gradle.kts`ファイルの冒頭にある既存の`plugins {}`ブロックに以下の行を追加します。

```kotlin
plugins {
    // ...
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

### Ktor

コア依存関係（`ktor-client-core`）を共有モジュールの共通ソースセットに追加する必要があります。
また、サポートする依存関係も追加する必要があります。

*   `ContentNegotiation`機能（`ktor-client-content-negotiation`）を追加します。これにより、特定の形式でコンテンツをシリアライズおよびデシリアライズできます。
*   `ktor-serialization-kotlinx-json`依存関係を追加して、KtorがJSON形式と`kotlinx.serialization`をシリアライズライブラリとして使用するように指示します。KtorはJSONデータを期待し、レスポンスを受信したときにそれをデータクラスにデシリアライズします。
*   対応する成果物への依存関係をプラットフォームソースセット（`ktor-client-android`、`ktor-client-darwin`）に追加することで、プラットフォームエンジンを提供します。

```kotlin
kotlin {
    // ...
    val ktorVersion = "%ktorVersion%"

    sourceSets {
        commonMain.dependencies {
            // ...

            implementation("io.ktor:ktor-client-core:$ktorVersion")
            implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
            implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        }
        androidMain.dependencies {
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

**Sync Gradle Changes**ボタンをクリックして、Gradleファイルを同期します。

## APIリクエストを作成する

データを取得するには[SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)が必要で、`v4/launches`エンドポイントからすべての打ち上げのリストを取得するために単一のメソッドを使用します。

### データモデルを追加する

`shared/src/commonMain/kotlin/.../greetingkmp`ディレクトリに新しい`RocketLaunch.kt`ファイルを作成し、SpaceX APIからデータを保存するデータクラスを追加します。

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    @SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("name")
    val missionName: String,
    @SerialName("date_utc")
    val launchDateUTC: String,
    @SerialName("success")
    val launchSuccess: Boolean?,
)
```

*   `RocketLaunch`クラスは`@Serializable`アノテーションでマークされており、`kotlinx.serialization`プラグインが自動的にデフォルトのシリアライザーを生成できるようにします。
*   `@SerialName`アノテーションを使用すると、フィールド名を再定義できるため、データクラスでより読みやすい名前でプロパティを宣言できます。

### HTTPクライアントを接続する

1.  `shared/src/commonMain/kotlin/.../greetingkmp`ディレクトリに新しい`RocketComponent`クラスを作成します。
2.  HTTP GETリクエストを通じてロケット打ち上げ情報を取得するために`httpClient`プロパティを追加します。

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class RocketComponent {
        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }
    ```

   *   [ContentNegotiation Ktorプラグイン](https://ktor.io/docs/serialization-client.html#register_json)とJSONシリアライザーは、GETリクエストの結果をデシリアライズします。
   *   ここでJSONシリアライザーは、`prettyPrint`プロパティでJSONをより読みやすい形式で出力するように設定されています。`isLenient`により、不正な形式のJSONを読み取る際に柔軟性が高く、`ignoreUnknownKeys`により、ロケット打ち上げモデルで宣言されていないキーを無視します。

3.  `RocketComponent`に`getDateOfLastSuccessfulLaunch()`中断関数を追加します。

   ```kotlin
   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
       
       }
   }
   ```

4.  `httpClient.get()`関数を呼び出して、ロケット打ち上げに関する情報を取得します。

   ```kotlin
   import io.ktor.client.request.*
   import io.ktor.client.call.*

   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
       }
   }
   ```

   *   `httpClient.get()`も中断関数です。スレッドをブロックせずにネットワーク経由でデータを非同期に取得する必要があるためです。
   *   中断関数は、コルーチンまたは他の中断関数からのみ呼び出すことができます。そのため、`getDateOfLastSuccessfulLaunch()`は`suspend`キーワードでマークされています。ネットワークリクエストはHTTPクライアントのスレッドプールで実行されます。

5.  リストから最後の成功した打ち上げを見つけるために、関数を再度更新します。

   ```kotlin
   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
           val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
       }
   }
   ```

   ロケット打ち上げのリストは、古いものから新しいものへと日付でソートされています。

6.  打ち上げ日をUTCからローカルの日付に変換し、出力をフォーマットします。

   ```kotlin
   import kotlinx.datetime.TimeZone
   import kotlinx.datetime.toLocalDateTime
   import kotlin.time.Instant

   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> =
               httpClient.get("https://api.spacexdata.com/v4/launches").body()
           val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
           val date = Instant.parse(lastSuccessLaunch.launchDateUTC)
               .toLocalDateTime(TimeZone.currentSystemDefault())
       
           return "${date.month} ${date.day}, ${date.year}"
       }
   }
   ```

   日付は「MMMM DD, YYYY」形式、例えば「OCTOBER 5, 2022」になります。

7.  `getDateOfLastSuccessfulLaunch()`関数を使用してメッセージを作成する、もう1つの中断関数`launchPhrase()`を追加します。

    ```kotlin
    class RocketComponent {
        // ...
    
        suspend fun launchPhrase(): String =
            try {
                "The last successful launch was on ${getDateOfLastSuccessfulLaunch()} 🚀"
            } catch (e: Exception) {
                println("Exception during getting the date of the last successful launch $e")
                "Error occurred"
            }
    }
    ```

### フローを作成する

中断関数の代わりにフローを使用できます。これらは、中断関数が返す単一の値ではなく、値のシーケンスを発行します。

1.  `shared/src/commonMain/kotlin`ディレクトリにある`Greeting.kt`ファイルを開きます。
2.  `Greeting`クラスに`rocketComponent`プロパティを追加します。このプロパティは、最後の成功した打ち上げ日を含むメッセージを格納します。

   ```kotlin
   private val rocketComponent = RocketComponent()
   ```

3.  `greet()`関数を`Flow`を返すように変更します。

    ```kotlin
    import kotlinx.coroutines.delay
    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.flow
    import kotlin.time.Duration.Companion.seconds
    
    class Greeting {
        // ...
        fun greet(): Flow<String> = flow {
            emit(if (Random.nextBoolean()) "Hi!" else "Hello!")
            delay(1.seconds)
            emit("Guess what this is! > ${platform.name.reversed()}")
            delay(1.seconds)
            emit(daysPhrase())
            emit(rocketComponent.launchPhrase())
        }
    }
    ```

   *   ここでは、`flow()`ビルダー関数を使用して`Flow`が作成されており、すべてのステートメントをラップしています。
   *   `Flow`は各発行の間に1秒の遅延を伴って文字列を発行します。最後の要素はネットワークレスポンスが返された後にのみ発行されるため、正確な遅延はネットワークに依存します。

### インターネットアクセス権限を追加する

インターネットにアクセスするには、Androidアプリケーションに適切な権限が必要です。すべてのネットワークリクエストは共有モジュールから行われるため、そのマニフェストにインターネットアクセス権限を追加するのが理にかなっています。

`composeApp/src/androidMain/AndroidManifest.xml`ファイルをアクセス権限で更新します。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    ...
</manifest>
```

`greet()`関数の戻り値を`Flow`に変更することで、共有モジュールのAPIは既に更新されています。
次に、`greet()`関数の呼び出し結果を適切に処理できるように、プロジェクトのネイティブ部分を更新する必要があります。

## ネイティブAndroid UIを更新する

共有モジュールとAndroidアプリケーションの両方がKotlinで書かれているため、Androidから共有コードを使用するのは簡単です。

### ビューモデルを導入する

アプリケーションがより複雑になるにつれて、UIを実装する`App()`関数を呼び出す[Androidアクティビティ](https://developer.android.com/guide/components/activities/intro-activities)である`MainActivity`にビューモデルを導入する時が来ました。
ビューモデルはアクティビティからのデータを管理し、アクティビティがライフサイクル変更を受けても消滅しません。

1.  `composeApp/build.gradle.kts`ファイルに以下の依存関係を追加します。

    ```kotlin
    androidMain.dependencies {
        // ...
        implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
        implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.2")
        implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.2")
    }
    ```

2.  `composeApp/src/androidMain/kotlin/com/jetbrains/greeting/greetingkmp`ディレクトリに、新しい`MainViewModel` Kotlinクラスを作成します。

    ```kotlin
    import androidx.lifecycle.ViewModel
    
    class MainViewModel : ViewModel() {
        // ...
    }
    ```

   このクラスはAndroidの`ViewModel`クラスを拡張しており、ライフサイクルと設定変更に関する正しい動作を保証します。

3.  [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/)型の`greetingList`値と、そのバッキングプロパティを作成します。

    ```kotlin
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    
    class MainViewModel : ViewModel() {
        private val _greetingList = MutableStateFlow<List<String>>(listOf())
        val greetingList: StateFlow<List<String>> get() = _greetingList
    }
    ```

   *   ここで`StateFlow`は`Flow`インターフェースを拡張していますが、単一の値または状態を持ちます。
   *   プライベートなバッキングプロパティ`_greetingList`は、このクラスのクライアントのみが読み取り専用の`greetingList`プロパティにアクセスできることを保証します。

4.  ビューモデルの`init`関数で、`Greeting().greet()`フローからすべての文字列を収集します。

    ```kotlin
   import androidx.lifecycle.viewModelScope
   import kotlinx.coroutines.launch
   
   class MainViewModel : ViewModel() {
       private val _greetingList = MutableStateFlow<List<String>>(listOf())
       val greetingList: StateFlow<List<String>> get() = _greetingList
       
       init {
           viewModelScope.launch {
               Greeting().greet().collect { phrase ->
                    //...
               }
           }
       }
    }
    ```

   `collect()`関数は中断されるため、ビューモデルのスコープ内で`launch`コルーチンが使用されます。
   これは、`launch`コルーチンがビューモデルのライフサイクルの正しいフェーズでのみ実行されることを意味します。

5.  `collect`トレーリングラムダ内で、`_greetingList`の値を更新して、収集した`phrase`を`list`内のフレーズのリストに追加します。

    ```kotlin
    import kotlinx.coroutines.flow.update
   
    class MainViewModel : ViewModel() {
        //...
   
        init {
            viewModelScope.launch {
                Greeting().greet().collect { phrase ->
                    _greetingList.update { list -> list + phrase }
                }
            }
        }
    }
    ```

   `update()`関数は値を自動的に更新します。

### ビューモデルのフローを使用する

1.  `composeApp/src/androidMain/kotlin`にある`App.kt`ファイルを開き、以前の実装を置き換えて更新します。

    ```kotlin
    import androidx.lifecycle.compose.collectAsStateWithLifecycle
    import androidx.compose.runtime.getValue
    import androidx.lifecycle.viewmodel.compose.viewModel
    
    @Composable
    fun App(mainViewModel: MainViewModel = viewModel()) {
        MaterialTheme {
            val greetings by mainViewModel.greetingList.collectAsStateWithLifecycle()
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                greetings.forEach { greeting ->
                    Text(greeting)
                    HorizontalDivider()
                }
            }
        }
    }
    ```

   *   `collectAsStateWithLifecycle()`関数は`greetingList`に対して呼び出され、ViewModelのフローから値を収集し、ライフサイクルに対応した方法でコンポーザブルな状態として表現します。
   *   新しいフローが作成されると、コンポーズの状態が変更され、挨拶のフレーズが垂直に配置され、区切り線で区切られたスクロール可能な`Column`が表示されます。

2.  結果を見るには、**composeApp**設定を再実行します。

   ![Final results](multiplatform-mobile-upgrade-android.png){width=300}

## ネイティブiOS UIを更新する

プロジェクトのiOS部分では、すべてのビジネスロジックを含む共有モジュールにUIを接続するために、再び[モデル-ビュー-ビューモデル（MVVM）](https://ja.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)パターンを利用します。

このモジュールは既に`ContentView.swift`ファイルに`import Shared`宣言でインポートされています。

### ViewModelの導入

`iosApp/ContentView.swift`で、`ContentView`の`ViewModel`クラスを作成します。これは、データの準備と管理を行います。
コンカレンシーをサポートするために、`task()`呼び出し内で`startObserving()`関数を呼び出します。

```swift
import SwiftUI
import Shared

struct ContentView: View {
    @ObservedObject private(set) var viewModel: ViewModel

    var body: some View {
        ListView(phrases: viewModel.greetings)
            .task { await self.viewModel.startObserving() }
    }
}

extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: Array<String> = []
        
        func startObserving() {
            // ...
        }
    }
}

struct ListView: View {
    let phrases: Array<String>

    var body: some View {
        List(phrases, id: \.self) {
            Text($0)
        }
    }
}
```

*   `ViewModel`は`ContentView`の拡張として宣言されており、密接に関連しています。
*   `ViewModel`には`String`フレーズの配列である`greetings`プロパティがあります。
    SwiftUIはViewModel（`ContentView.ViewModel`）をビュー（`ContentView`）に接続します。
*   `ContentView.ViewModel`は`ObservableObject`として宣言されています。
*   `@Published`ラッパーは`greetings`プロパティに使用されます。
*   `@ObservedObject`プロパティラッパーはViewModelを購読するために使用されます。

このViewModelは、このプロパティが変更されるたびにシグナルを発します。
次に、フローを消費するために`startObserving()`関数を実装する必要があります。

### iOSからフローを消費するライブラリを選択する

このチュートリアルでは、iOSでフローを扱うのに役立つ[SKIE](https://skie.touchlab.co/)または[KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)ライブラリを使用できます。
どちらも、Kotlin/Nativeコンパイラがまだデフォルトで提供していないフローによるキャンセルとジェネリックスをサポートするオープンソースソリューションです。

*   SKIEライブラリは、Kotlinコンパイラによって生成されるObjective-C APIを拡張します。SKIEはフローをSwiftの`AsyncSequence`に相当するものに変換します。SKIEはスレッドの制限なしでSwiftの`async`/`await`を直接サポートし、双方向の自動キャンセル機能を備えています（CombineとRxSwiftにはアダプターが必要です）。SKIEは、さまざまなKotlin型をSwiftの同等物にブリッジするなど、KotlinからSwiftフレンドリーなAPIを生成するための他の機能も提供します。また、iOSプロジェクトに追加の依存関係を追加する必要もありません。
*   KMP-NativeCoroutinesライブラリは、iOSから中断関数やフローを消費するために必要なラッパーを生成するのに役立ちます。
    KMP-NativeCoroutinesはSwiftの`async`/`await`機能だけでなく、CombineとRxSwiftもサポートしています。
    KMP-NativeCoroutinesを使用するには、iOSプロジェクトにSPMまたはCocoaPodの依存関係を追加する必要があります。

### オプション 1. KMP-NativeCoroutinesを設定する {initial-collapse-state="collapsed" collapsible="true"}

> ライブラリの最新バージョンを使用することをお勧めします。
> より新しいバージョンのプラグインが利用可能かどうかは、[KMP-NativeCoroutinesリポジトリ](https://github.com/rickclephas/KMP-NativeCoroutines/releases)で確認してください。
>
{style="note"}

1.  プロジェクトのルート`build.gradle.kts`ファイル（**shared/build.gradle.kts`ファイルではありません**）で、KSP (Kotlin Symbol Processor) とKMP-NativeCoroutinesプラグインを`plugins {}`ブロックに追加します。

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp").version("%kspVersion%").apply(false)
        id("com.rickclephas.kmp.nativecoroutines").version("%kmpncVersion%").apply(false)
    }
    ```

2.  `shared/build.gradle.kts`ファイルに、KMP-NativeCoroutinesプラグインを追加します。

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp")
        id("com.rickclephas.kmp.nativecoroutines")
    }
    ```

3.  同じく`shared/build.gradle.kts`ファイルで、実験的な`@ObjCName`アノテーションをオプトインします。

    ```kotlin
    kotlin {
        // ...
        sourceSets{
            all {
                languageSettings {
                    optIn("kotlin.experimental.ExperimentalObjCName")
                    optIn("kotlin.time.ExperimentalTime")
                }
            }
            // ...
        }
    }
    ```

4.  **Sync Gradle Changes**ボタンをクリックして、Gradleファイルを同期します。

#### KMP-NativeCoroutinesでフローをマークする

1.  `shared/src/commonMain/kotlin`ディレクトリの`Greeting.kt`ファイルを開きます。
2.  `greet()`関数に`@NativeCoroutines`アノテーションを追加します。これにより、プラグインがiOSでの正しいフロー処理をサポートするための適切なコードを生成するようになります。

   ```kotlin
    import com.rickclephas.kmp.nativecoroutines.NativeCoroutines
    
    class Greeting {
        // ...
       
        @NativeCoroutines
        fun greet(): Flow<String> = flow {
            // ...
        }
    }
    ```

#### XcodeでSPMを使用してライブラリをインポートする

1.  **File** | **Open Project in Xcode** に移動します。
2.  Xcodeで、左側のメニューにある`iosApp`プロジェクトを右クリックし、**Add Package Dependencies**を選択します。
3.  検索バーにパッケージ名を入力します。

     ```none
    https://github.com/rickclephas/KMP-NativeCoroutines.git
    ```

   ![Importing KMP-NativeCoroutines](multiplatform-import-kmp-nativecoroutines.png){width=700}

4.  **Dependency Rule**ドロップダウンで**Exact Version**を選択し、隣接するフィールドに`%kmpncVersion%`バージョンを入力します。
5.  **Add Package**ボタンをクリックします。XcodeはGitHubからパッケージをフェッチし、パッケージ製品を選択するための別のウィンドウを開きます。
6.  「KMPNativeCoroutinesAsync」と「KMPNativeCoroutinesCore」をアプリに追加し、**Add Package**をクリックします。

   ![Add KMP-NativeCoroutines packages](multiplatform-add-package.png){width=500}

これにより、`async/await`メカニズムで動作するために必要なKMP-NativeCoroutinesパッケージの一部がインストールされるはずです。

#### KMP-NativeCoroutinesライブラリを使用してフローを消費する

1.  `iosApp/ContentView.swift`で、`startObserving()`関数を更新し、KMP-NativeCoroutineの`asyncSequence()`関数を使用して`Greeting().greet()`関数のフローを消費するようにします。

    ```Swift
    func startObserving() async {
        do {
            let sequence = asyncSequence(for: Greeting().greet())
            for try await phrase in sequence {
                self.greetings.append(phrase)
            }
        } catch {
            print("Failed with error: \(error)")
        }
    }
    ```

   ここでループと`await`メカニズムが使用され、フローを繰り返し処理し、フローが値を放出するたびに`greetings`プロパティを更新します。

2.  `ViewModel`が`@MainActor`アノテーションでマークされていることを確認してください。このアノテーションは、Kotlin/Nativeの要件に準拠するために、`ViewModel`内のすべての非同期操作がメインスレッドで実行されることを保証します。

    ```Swift
    // ...
    import KMPNativeCoroutinesAsync
    import KMPNativeCoroutinesCore
    
    // ...
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
    
            func startObserving() async {
                do {
                    let sequence = asyncSequence(for: Greeting().greet())
                    for try await phrase in sequence {
                        self.greetings.append(phrase)
                    }
                } catch {
                    print("Failed with error: \(error)")
                }
            }
        }
    }
    ```

### オプション 2. SKIEを設定する {initial-collapse-state="collapsed" collapsible="true"}

ライブラリを設定するには、`shared/build.gradle.kts`でSKIEプラグインを指定し、**Sync Gradle Changes**ボタンをクリックします。

```kotlin
plugins {
   id("co.touchlab.skie") version "%skieVersion%"
}
```

#### SKIEを使用してフローを消費する

ループと`await`メカニズムを使用して、`Greeting().greet()`フローを反復処理し、フローが値を放出するたびに`greetings`プロパティを更新します。

`ViewModel`が`@MainActor`アノテーションでマークされていることを確認してください。
このアノテーションは、Kotlin/Nativeの要件に準拠するために、`ViewModel`内のすべての非同期操作がメインスレッドで実行されることを保証します。

```Swift
// ...
extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: [String] = []

        func startObserving() async {
            for await phrase in Greeting().greet() {
                self.greetings.append(phrase)
            }
        }
    }
}
```

### ViewModelを消費し、iOSアプリを実行する

`iosApp/iOSApp.swift`で、アプリのエントリポイントを更新します。

```swift
@main
struct iOSApp: App {
   var body: some Scene {
       WindowGroup {
           ContentView(viewModel: ContentView.ViewModel())
       }
   }
}
```

IntelliJ IDEAから**iosApp**設定を実行して、アプリのロジックが同期されていることを確認します。

![Final results](multiplatform-mobile-upgrade-ios.png){width=300}

> プロジェクトの最終状態は、異なるコルーチンソリューションを含むGitHubリポジトリの2つのブランチで見つけることができます。
> * [`main`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main)ブランチにはKMP-NativeCoroutines実装が含まれます。
> * [`main-skie`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie)ブランチにはSKIE実装が含まれます。
>
{style="note"}

## 次のステップ

チュートリアルの最終パートでは、プロジェクトを仕上げ、次に取るべきステップを確認します。

**[次のパートに進む](multiplatform-wrap-up.md)**

### 参照

*   [中断関数の構成](https://kotlinlang.org/docs/composing-suspending-functions.html)のさまざまなアプローチを探る。
*   [Objective-Cフレームワークとライブラリとの相互運用性](https://kotlinlang.org/docs/native-objc-interop.html)について詳しく学ぶ。
*   [ネットワーキングとデータストレージ](multiplatform-ktor-sqldelight.md)に関するこのチュートリアルを完了する。

## ヘルプを得る

*   **Kotlin Slack**。[招待を受け](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。[新しい課題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。