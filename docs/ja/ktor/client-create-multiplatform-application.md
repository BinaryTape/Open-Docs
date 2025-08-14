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

Ktor HTTPクライアントはマルチプラットフォームプロジェクトで使用できます。このチュートリアルでは、リクエストを送信し、プレーンなHTMLテキストとしてレスポンスボディを受信するシンプルなKotlin Multiplatform Mobileアプリケーションを作成します。

> 初めてのKotlin Multiplatform Mobileアプリケーションの作成方法については、[初めてのクロスプラットフォームモバイルアプリの作成](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)を参照してください。

## 前提条件 {id="prerequisites"}

まず、適切なオペレーティングシステムに必要なツールをインストールして、クロスプラットフォームモバイル開発の環境をセットアップする必要があります。これを行う方法については、[環境のセットアップ](https://kotlinlang.org/docs/multiplatform-mobile-setup.html)セクションを参照してください。

> このチュートリアルの特定のステップ（iOS固有のコードの記述やiOSアプリケーションの実行など）を完了するには、macOSを搭載したMacが必要です。
>
{style="note"}

## 新規プロジェクトの作成 {id="new-project"}

新しいKotlin Multiplatformプロジェクトを開始するには、2つのアプローチがあります。

- Android Studio内でテンプレートからプロジェクトを作成できます。
- あるいは、[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/)を使用して新しいプロジェクトを生成することもできます。ウィザードは、Androidサポートを除外したり、Ktor Serverを含めたりするなど、プロジェクト設定をカスタマイズするオプションを提供します。

このチュートリアルでは、テンプレートからプロジェクトを作成するプロセスを説明します。

1.  Android Studioで、**File | New | New Project**を選択します。
2.  プロジェクトテンプレートのリストから**Kotlin Multiplatform App**を選択し、**Next**をクリックします。
3.  アプリケーションの名前を指定し、**Next**をクリックします。このチュートリアルでは、アプリケーション名は`KmmKtor`です。
4.  次のページで、デフォルト設定のまま**Finish**をクリックして新しいプロジェクトを作成します。
    これで、プロジェクトがセットアップされるのを待ちます。初めてこの操作を行う場合、必要なコンポーネントのダウンロードとセットアップに時間がかかる場合があります。
    > 生成されたマルチプラットフォームプロジェクトの完全な構造を表示するには、[プロジェクトビュー](https://developer.android.com/studio/projects#ProjectView)で**Android**から**Project**に切り替えます。

## ビルドスクリプトの設定 {id="build-script"}

### Kotlin Gradleプラグインの更新 {id="update_gradle_plugins"}

`gradle/libs.versions.toml`ファイルを開き、Kotlinのバージョンを最新に更新します。

[object Promise]

undefined

### Ktorの依存関係の追加 {id="ktor-dependencies"}

プロジェクトでKtor HTTPクライアントを使用するには、少なくとも2つの依存関係（クライアント依存関係とエンジン依存関係）を追加する必要があります。

`gradle/libs.versions.toml`ファイルにKtorのバージョンを追加します。

[object Promise]

undefined

次に、Ktorクライアントとエンジンライブラリを定義します。

[object Promise]

依存関係を追加するには、`shared/build.gradle.kts`ファイルを開き、以下の手順に従います。

1.  共通コードでKtorクライアントを使用するには、`ktor-client-core`の依存関係を`commonMain`ソースセットに追加します。
    [object Promise]

2.  各プラットフォームに必要な[エンジン依存関係](client-engines.md)を対応するソースセットに追加します。
    -   Androidの場合、`ktor-client-okhttp`の依存関係を`androidMain`ソースセットに追加します。
      [object Promise]

      Androidの場合、[他のエンジンタイプ](client-engines.md#jvm-android)も使用できます。
    -   iOSの場合、`ktor-client-darwin`の依存関係を`iosMain`に追加します。
      [object Promise]

### コルーチンの追加 {id="coroutines"}

[Androidコード](#android-activity)でコルーチンを使用するには、`kotlinx.coroutines`をプロジェクトに追加する必要があります。

1.  `gradle/libs.versions.toml`ファイルを開き、コルーチンのバージョンとライブラリを指定します。

    [object Promise]

2.  `build.gradle.kts`ファイルを開き、`kotlinx-coroutines-core`の依存関係を`commonMain`ソースセットに追加します。

    [object Promise]

3.  次に、`androidApp/build.gradle.kts`を開き、`kotlinx-coroutines-android`の依存関係を追加します。

[object Promise]

`gradle.properties`ファイルの右上隅にある**Sync Now**をクリックして、追加された依存関係をインストールします。

## アプリケーションの更新 {id="code"}

### 共有コード {id="shared-code"}

AndroidとiOS間で共有されるコードを更新するには、`shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt`ファイルを開き、`Greeting`クラスに以下のコードを追加します。

[object Promise]

-   HTTPクライアントを作成するには、`HttpClient`コンストラクタが呼び出されます。
-   サスペンド関数である`greeting`は、[リクエスト](client-requests.md)を行い、[レスポンス](client-responses.md)のボディを文字列値として受け取るために使用されます。

### Androidコード {id="android-activity"}

Androidコードからサスペンド関数`greeting`を呼び出すには、[rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))を使用します。

`androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt`ファイルを開き、`MainActivity`コードを以下のように更新します。

[object Promise]

作成されたスコープ内で、共有の`greeting`関数を呼び出し、発生しうる例外を処理できます。

### iOSコード {id="ios-view"}

1.  `iosApp/iosApp/iOSApp.swift`ファイルを開き、アプリケーションのエントリポイントを更新します。
    [object Promise]

2.  `iosApp/iosApp/ContentView.swift`ファイルを開き、`ContentView`コードを次のように更新します。
    [object Promise]

    iOSでは、`greeting`サスペンド関数はコールバック付きの関数として利用できます。

## Androidでのインターネットアクセスを有効にする {id="android-internet"}

最後に、Androidアプリケーションのインターネットアクセスを有効にする必要があります。
`androidApp/src/main/AndroidManifest.xml`ファイルを開き、`uses-permission`要素を使用して必要なパーミッションを有効にします。

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## アプリケーションの実行 {id="run"}

作成したマルチプラットフォームアプリケーションをAndroidまたはiOSシミュレーターで実行するには、**androidApp**または**iosApp**を選択し、**Run**をクリックします。
シミュレーターには、受信したHTMLドキュメントがプレーンテキストとして表示されるはずです。

<tabs>
<tab title="Android">

![Android simulator](tutorial_client_kmm_android.png){width="381"}

</tab>
<tab title="iOS">

![iOS simulator](tutorial_client_kmm_ios.png){width="351"}

</tab>
</tabs>