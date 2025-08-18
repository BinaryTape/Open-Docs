[//]: # (title: iOSとAndroidでより多くのロジックを共有する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同じように進めることができます。どちらのIDEも同じコア機能とKotlin Multiplatformサポートを共有しています。</p>
    <br/>
    <p>これは、「<strong>共有ロジックとネイティブUIを備えたKotlin Multiplatformアプリを作成する</strong>」チュートリアルの第4部です。先に進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/multiplatform-create-first-app" summary="このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同じように進めることができます。どちらのIDEも同じコア機能とKotlin Multiplatformサポートを共有しています。これは、共有ロジックとネイティブUIを備えたKotlin Multiplatformアプリを作成するチュートリアルの第1部です。Kotlin Multiplatformアプリを作成する、ユーザーインターフェースを更新する、依存関係を追加する、より多くのロジックを共有する、プロジェクトを締めくくる">Kotlin Multiplatformアプリを作成する</Links><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/multiplatform-update-ui" summary="このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同じように進めることができます。どちらのIDEも同じコア機能とKotlin Multiplatformサポートを共有しています。これは、「共有ロジックとネイティブUIを備えたKotlin Multiplatformアプリを作成する」チュートリアルの第2部です。先に進む前に、前のステップを完了していることを確認してください。Kotlin Multiplatformアプリを作成する、ユーザーインターフェースを更新する、依存関係を追加する、より多くのロジックを共有する、プロジェクトを締めくくる">ユーザーインターフェースを更新する</Links><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <Links href="/kmp/multiplatform-dependencies" summary="このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同じように進めることができます。どちらのIDEも同じコア機能とKotlin Multiplatformサポートを共有しています。これは、「共有ロジックとネイティブUIを備えたKotlin Multiplatformアプリを作成する」チュートリアルの第3部です。先に進む前に、前のステップを完了していることを確認してください。Kotlin Multiplatformアプリを作成する、ユーザーインターフェースを更新する、依存関係を追加する、より多くのロジックを共有する、プロジェクトを締めくくる">依存関係を追加する</Links><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>より多くのロジックを共有する</strong><br/>
      <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> プロジェクトを締めくくる<br/>
    </p>
</tldr>

外部依存関係を使用して共通ロジックを実装したので、より複雑なロジックを追加し始めることができます。ネットワークリクエストとデータシリアライズは、Kotlin Multiplatformを使用してコードを共有する[最も一般的なユースケース](https://kotlinlang.org/lp/multiplatform/)です。このオンボーディングジャーニーを完了した後に将来のプロジェクトでそれらを使用できるように、最初のアプリケーションでそれらを実装する方法を学びましょう。

更新されたアプリは、[SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)からインターネット経由でデータを取得し、SpaceXロケットの最後の成功した打ち上げ日を表示します。

> プロジェクトの最終状態は、異なるコルーチンソリューションを持つGitHubリポジトリの2つのブランチで確認できます。
> * [`main`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main)ブランチにはKMP-NativeCoroutinesの実装が含まれています。
> * [`main-skie`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie)ブランチにはSKIEの実装が含まれています。
>
{style="note"}

## 依存関係を追加する

プロジェクトに以下のマルチプラットフォームライブラリを追加する必要があります。

*   [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)：同時操作を可能にする非同期コードにコルーチンを使用するため。
*   [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)：JSONレスポンスを、ネットワーク操作の処理に使用されるエンティティクラスのオブジェクトにデシリアライズするため。
*   [Ktor](https://ktor.io/)：インターネット経由でデータを取得するためのHTTPクライアントを作成するためのフレームワーク。

### kotlinx.coroutines

`kotlinx.coroutines`をプロジェクトに追加するには、共通ソースセットで依存関係を指定します。これを行うには、共有モジュールの`build.gradle.kts`ファイルに次の行を追加します。

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

Multiplatform Gradleプラグインは、`kotlinx.coroutines`のプラットフォーム固有（iOSおよびAndroid）の部分に自動的に依存関係を追加します。

### kotlinx.serialization

`kotlinx.serialization`ライブラリを使用するには、対応するGradleプラグインを設定します。
これを行うには、共有モジュールの`build.gradle.kts`ファイルの冒頭にある既存の`plugins {}`ブロックに次の行を追加します。

```kotlin
plugins {
    // ...
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

### Ktor

共有モジュールの共通ソースセットにコア依存関係（`ktor-client-core`）を追加する必要があります。
さらに、サポートする依存関係も追加する必要があります。

*   特定の形式でコンテンツをシリアライズおよびデシリアライズできる`ContentNegotiation`機能（`ktor-client-content-negotiation`）を追加します。
*   KtorにJSON形式と`kotlinx.serialization`をシリアライズライブラリとして使用するように指示するために、`ktor-serialization-kotlinx-json`依存関係を追加します。KtorはJSONデータを期待し、応答を受信したときにそれをデータクラスにデシリアライズします。
*   プラットフォームソースセット（`ktor-client-android`、`ktor-client-darwin`）の対応するアーティファクトに依存関係を追加することで、プラットフォームエンジンを提供します。

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

データを取得するために[SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)を使用し、**v4/launches**エンドポイントからすべての打ち上げのリストを取得するための単一のメソッドを使用します。

### データモデルを追加する

`shared/src/commonMain/kotlin/.../greetingkmp`ディレクトリに新しい`RocketLaunch.kt`ファイルを作成し、SpaceX APIからデータを格納するデータクラスを追加します。

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

*   `RocketLaunch`クラスには`@Serializable`アノテーションが付けられているため、`kotlinx.serialization`プラグインは自動的にデフォルトのシリアライザーを生成できます。
*   `@SerialName`アノテーションを使用すると、フィールド名を再定義できるため、データクラスでプロパティをより読みやすい名前で宣言できます。

### HTTPクライアントを接続する

1.  `shared/src/commonMain/kotlin/.../greetingkmp`ディレクトリに新しい`RocketComponent`クラスを作成します。
2.  HTTP GETリクエストを通じてロケット打ち上げ情報を取得するための`httpClient`プロパティを追加します。

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
    *   ここでのJSONシリアライザーは、`prettyPrint`プロパティによりJSONをより読みやすい形式で出力するように設定されています。`isLenient`により不正な形式のJSONを読み取る際に柔軟性が高まり、`ignoreUnknownKeys`によりロケット打ち上げモデルで宣言されていないキーを無視します。

3.  `RocketComponent`に`getDateOfLastSuccessfulLaunch()`サスペンド関数を追加します。

    ```kotlin
    class RocketComponent {
        // ...
        
        private suspend fun getDateOfLastSuccessfulLaunch(): String {
        
        }
    }
    ```

4.  `httpClient.get()`関数を呼び出して、ロケット打ち上げ情報を取得します。

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

    *   `httpClient.get()`もサスペンド関数です。これは、スレッドをブロックせずにネットワーク経由で非同期にデータを取得する必要があるためです。
    *   サスペンド関数は、コルーチンまたは他のサスペンド関数からのみ呼び出すことができます。これが`getDateOfLastSuccessfulLaunch()`が`suspend`キーワードでマークされた理由です。ネットワークリクエストはHTTPクライアントのスレッドプールで実行されます。

5.  関数を再度更新して、リスト内の最後の成功した打ち上げを見つけます。

    ```kotlin
    class RocketComponent {
        // ...
        
        private suspend fun getDateOfLastSuccessfulLaunch(): String {
            val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
            val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
        }
    }
    ```

    ロケット打ち上げのリストは、古いものから新しいものへと日付順にソートされています。

6.  打ち上げ日をUTCからローカル日時に変換し、出力をフォーマットします。

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

    日付は「MMMM DD, YYYY」形式になります（例：OCTOBER 5, 2022）。

7.  `getDateOfLastSuccessfulLaunch()`関数を使用してメッセージを作成する、もう1つのサスペンド関数`launchPhrase()`を追加します。

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

### Flowを作成する

サスペンド関数の代わりにFlowを使用できます。これらは、サスペンド関数が返す単一の値ではなく、値のシーケンスを発行します。

1.  `shared/src/commonMain/kotlin`ディレクトリにある`Greeting.kt`ファイルを開きます。
2.  `Greeting`クラスに`rocketComponent`プロパティを追加します。このプロパティには、最後の成功した打ち上げ日を含むメッセージが格納されます。

    ```kotlin
    private val rocketComponent = RocketComponent()
    ```

3.  `greet()`関数が`Flow`を返すように変更します。

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

    *   `Flow`は、すべてのステートメントをラップする`flow()`ビルダー関数でここに作成されます。
    *   `Flow`は、各発行間に1秒の遅延を伴って文字列を発行します。最後の要素は、ネットワーク応答が返された後にのみ発行されるため、正確な遅延はネットワークによって異なります。

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

`greet()`関数の戻り値の型を`Flow`に変更することで、共有モジュールのAPIはすでに更新されています。
次に、`greet()`関数呼び出しの結果を適切に処理できるように、プロジェクトのネイティブ部分を更新する必要があります。

## ネイティブAndroid UIを更新する

共有モジュールとAndroidアプリケーションの両方がKotlinで記述されているため、Androidから共有コードを使用するのは簡単です。

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

    このクラスはAndroidの`ViewModel`クラスを拡張しており、ライフサイクルと設定変更に関して正しい動作を保証します。

3.  [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/)型の`greetingList`値と、そのバッキングプロパティを作成します。

    ```kotlin
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    
    class MainViewModel : ViewModel() {
        private val _greetingList = MutableStateFlow<List<String>>(listOf())
        val greetingList: StateFlow<List<String>> get() = _greetingList
    }
    ```

    *   ここでの`StateFlow`は`Flow`インターフェースを拡張していますが、単一の値または状態を持ちます。
    *   プライベートなバッキングプロパティ`_greetingList`は、このクラスのクライアントのみが読み取り専用の`greetingList`プロパティにアクセスできることを保証します。

4.  View Modelの`init`関数で、`Greeting().greet()`フローからすべての文字列を収集します。

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

    `collect()`関数はサスペンドされるため、ビューモデルのスコープ内で`launch`コルーチンが使用されます。
    これは、`launch`コルーチンがビューモデルのライフサイクルの正しいフェーズ中のみ実行されることを意味します。

5.  `collect`の後続ラムダ内で、収集された`phrase`を`list`内のフレーズのリストに追加するように`_greetingList`の値を更新します。

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

### ビューモデルのFlowを使用する

1.  `composeApp/src/androidMain/kotlin`にある`App.kt`ファイルを開き、以前の実装を置き換えるように更新します。

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

    *   `greetingList`に対する`collectAsStateWithLifecycle()`関数呼び出しは、ViewModelのFlowから値を収集し、ライフサイクルを意識した方法でそれをコンポーザブルステートとして表現します。
    *   新しいFlowが作成されると、コンポーズの状態が変更され、区切り線で区切られたグリーティングフレーズが垂直に配置されたスクロール可能な`Column`が表示されます。

2.  結果を確認するには、**composeApp**構成を再実行します。

   ![Final results](multiplatform-mobile-upgrade-android.png){width=300}

## ネイティブiOS UIを更新する

プロジェクトのiOS部分では、ビジネスロジックをすべて含む共有モジュールにUIを接続するために、[Model–View–ViewModel (MVVM)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)パターンを再び利用します。

モジュールは`ContentView.swift`ファイルに`import Shared`宣言で既にインポートされています。

### ViewModelを導入する

`iosApp/ContentView.swift`で、`ContentView`の`ViewModel`クラスを作成し、それのためのデータを準備および管理します。
並行処理をサポートするために、`startObserving()`関数を`task()`呼び出し内で呼び出します。

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
*   `ViewModel`には、`String`フレーズの配列である`greetings`プロパティがあります。
    SwiftUIはViewModel（`ContentView.ViewModel`）をビュー（`ContentView`）に接続します。
*   `ContentView.ViewModel`は`ObservableObject`として宣言されています。
*   `@Published`ラッパーは`greetings`プロパティに使用されます。
*   `@ObservedObject`プロパティラッパーはViewModelを購読するために使用されます。

このViewModelは、このプロパティが変更されるたびにシグナルを発行します。
次に、Flowを消費するために`startObserving()`関数を実装する必要があります。

### iOSからFlowを消費するためのライブラリを選択する

このチュートリアルでは、iOSでFlowを操作するのに役立つ[SKIE](https://skie.touchlab.co/)または[KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)ライブラリを使用できます。
どちらもオープンソースソリューションであり、Kotlin/Nativeコンパイラがまだデフォルトで提供していないFlowによるキャンセルとジェネリクスをサポートしています。

*   SKIEライブラリは、Kotlinコンパイラによって生成されたObjective-C APIを拡張します。SKIEはFlowをSwiftの`AsyncSequence`と同等のものに変換します。SKIEは、スレッド制限なしで、自動的な双方向キャンセルを伴うSwiftの`async`/`await`を直接サポートします（CombineとRxSwiftにはアダプターが必要です）。SKIEは、さまざまなKotlin型をSwiftの同等型にブリッジすることを含め、KotlinからSwiftフレンドリーなAPIを生成するための他の機能も提供します。また、iOSプロジェクトに追加の依存関係を追加する必要もありません。
*   KMP-NativeCoroutinesライブラリは、必要なラッパーを生成することで、iOSからサスペンド関数とFlowを消費するのに役立ちます。
    KMP-NativeCoroutinesは、Swiftの`async`/`await`機能、Combine、RxSwiftをサポートしています。
    KMP-NativeCoroutinesを使用するには、iOSプロジェクトにSPMまたはCocoaPodの依存関係を追加する必要があります。

### オプション1. KMP-NativeCoroutinesを構成する {initial-collapse-state="collapsed" collapsible="true"}

> ライブラリの最新バージョンを使用することをお勧めします。
> プラグインの新しいバージョンが利用可能かどうかは、[KMP-NativeCoroutinesリポジトリ](https://github.com/rickclephas/KMP-NativeCoroutines/releases)で確認してください。
>
{style="note"}

1.  プロジェクトのルート`build.gradle.kts`ファイル（**`shared/build.gradle.kts`ファイルではない**）の`plugins {}`ブロックにKSP (Kotlin Symbol Processor)とKMP-NativeCoroutinesプラグインを追加します。

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp").version("%kspVersion%").apply(false)
        id("com.rickclephas.kmp.nativecoroutines").version("%kmpncVersion%").apply(false)
    }
    ```

2.  `shared/build.gradle.kts`ファイルにKMP-NativeCoroutinesプラグインを追加します。

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

4.  **Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します。

#### KMP-NativeCoroutinesでFlowをマークする

1.  `shared/src/commonMain/kotlin`ディレクトリの`Greeting.kt`ファイルを開きます。
2.  `greet()`関数に`@NativeCoroutines`アノテーションを追加します。これにより、プラグインがiOSでの正しいFlow処理をサポートするための適切なコードを生成することを保証します。

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

4.  **Dependency Rule**ドロップダウンで**Exact Version**項目を選択し、隣接するフィールドに`%kmpncVersion%`バージョンを入力します。
5.  **Add Package**ボタンをクリックします。XcodeはGitHubからパッケージをフェッチし、別のウィンドウを開いてパッケージプロダクトを選択します。
6.  表示されているように、「KMPNativeCoroutinesAsync」と「KMPNativeCoroutinesCore」をアプリに追加し、**Add Package**をクリックします。

   ![Add KMP-NativeCoroutines packages](multiplatform-add-package.png){width=500}

これにより、`async/await`メカニズムを操作するために必要なKMP-NativeCoroutinesパッケージの一部がインストールされます。

#### KMP-NativeCoroutinesライブラリを使用してFlowを消費する

1.  `iosApp/ContentView.swift`で、KMP-NativeCoroutinesの`asyncSequence()`関数を使用して`Greeting().greet()`関数にFlowを消費するように`startObserving()`関数を更新します。

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

    ここでのループと`await`メカニズムは、Flowを反復処理し、Flowが値を放出するたびに`greetings`プロパティを更新するために使用されます。

2.  `ViewModel`が`@MainActor`アノテーションでマークされていることを確認します。このアノテーションは、`ViewModel`内のすべての非同期操作がKotlin/Nativeの要件に準拠するためにメインスレッドで実行されることを保証します。

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

### オプション2. SKIEを構成する {initial-collapse-state="collapsed" collapsible="true"}

ライブラリを設定するには、`shared/build.gradle.kts`にSKIEプラグインを指定し、**Sync Gradle Changes**ボタンをクリックします。

```kotlin
plugins {
   id("co.touchlab.skie") version "%skieVersion%"
}
```

#### SKIEを使用してFlowを消費する

`Greeting().greet()` Flowを反復処理し、Flowが値を放出するたびに`greetings`プロパティを更新するために、ループと`await`メカニズムを使用します。

`ViewModel`が`@MainActor`アノテーションでマークされていることを確認します。
このアノテーションは、`ViewModel`内のすべての非同期操作がKotlin/Nativeの要件に準拠するためにメインスレッドで実行されることを保証します。

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

IntelliJ IDEAから**iosApp**構成を実行して、アプリのロジックが同期されていることを確認します。

![Final results](multiplatform-mobile-upgrade-ios.png){width=300}

> プロジェクトの最終状態は、異なるコルーチンソリューションを持つGitHubリポジトリの2つのブランチで確認できます。
> * [`main`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main)ブランチにはKMP-NativeCoroutinesの実装が含まれています。
> * [`main-skie`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie)ブランチにはSKIEの実装が含まれています。
>
{style="note"}

## 次のステップ

チュートリアルの最終部では、プロジェクトを締めくくり、次に取るべきステップを確認します。

**[次のパートに進む](multiplatform-wrap-up.md)**

### 参照

*   [サスペンド関数の構成](https://kotlinlang.org/docs/composing-suspending-functions.html)の様々なアプローチを探る。
*   [Objective-Cフレームワークとライブラリとの相互運用性](https://kotlinlang.org/docs/native-objc-interop.html)について詳しく学ぶ。
*   [ネットワークとデータストレージ](multiplatform-ktor-sqldelight.md)に関するこのチュートリアルを完了する。

## ヘルプを得る

*   **Kotlin Slack**。[招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)には、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。[新しい課題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。