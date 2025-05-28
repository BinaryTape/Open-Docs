[//]: # (title: クロスプラットフォームモバイルアプリケーションの作成)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>ビデオ</b>: <a href="https://youtu.be/_Q62iJoNOfg">Kotlin Multiplatform MobileプロジェクトにおけるKtorでのネットワーク</a> 
</p>
</tldr>

<link-summary>
Kotlin Multiplatform Mobileアプリケーションの作成方法を学びます。
</link-summary>

Ktor HTTPクライアントはマルチプラットフォームプロジェクトで利用できます。このチュートリアルでは、リクエストを送信し、プレーンなHTMLテキストとしてレスポンスボディを受信するシンプルなKotlin Multiplatform Mobileアプリケーションを作成します。

> 最初のKotlin Multiplatform Mobileアプリケーションの作成方法については、「[最初のクロスプラットフォームモバイルアプリを作成する](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)」を参照してください。

## 前提条件 {id="prerequisites"}

まず、クロスプラットフォームモバイル開発の環境をセットアップするために、適切なオペレーティングシステムに必要なツールをインストールする必要があります。これを行う方法については、「[環境をセットアップする](https://kotlinlang.org/docs/multiplatform-mobile-setup.html)」セクションを参照してください。

> このチュートリアルの一部の手順（iOS固有のコードの記述やiOSアプリケーションの実行など）を完了するには、macOSを搭載したMacが必要です。
>
{style="note"}

## 新規プロジェクトの作成 {id="new-project"}

新しいKotlin Multiplatformプロジェクトを開始するには、2つのアプローチがあります。

- Android Studio内でテンプレートからプロジェクトを作成する。
- あるいは、[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/)を使用して新しいプロジェクトを生成することもできます。このウィザードでは、プロジェクトのセットアップをカスタマイズするオプションが提供されており、例えばAndroidサポートを除外したり、Ktorサーバーを含めたりすることができます。

このチュートリアルでは、テンプレートからプロジェクトを作成する手順を説明します。

1. Android Studioで、**File | New | New Project** を選択します。
2. プロジェクトテンプレートのリストから **Kotlin Multiplatform App** を選択し、**Next** をクリックします。
3. アプリケーションの名前を指定し、**Next** をクリックします。このチュートリアルでは、アプリケーション名は `KmmKtor` です。
4. 次のページで、デフォルト設定のまま **Finish** をクリックして新しいプロジェクトを作成します。プロジェクトがセットアップされるまでお待ちください。初めてこの作業を行う場合、必要なコンポーネントのダウンロードとセットアップに時間がかかることがあります。
   > 生成されたマルチプラットフォームプロジェクトの完全な構造を表示するには、[プロジェクトビュー](https://developer.android.com/studio/projects#ProjectView)で**Android**から**Project**に切り替えます。

## ビルドスクリプトの設定 {id="build-script"}

### Kotlin Gradleプラグインの更新 {id="update_gradle_plugins"}

`gradle/libs.versions.toml` ファイルを開き、Kotlinのバージョンを最新に更新します。

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="3"}

<include from="client-engines.md" element-id="newmm-note"/>

### Ktor依存関係の追加 {id="ktor-dependencies"}

プロジェクトでKtor HTTPクライアントを使用するには、少なくとも2つの依存関係（クライアント依存関係とエンジン依存関係）を追加する必要があります。

`gradle/libs.versions.toml` ファイルにKtorのバージョンを追加します。

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5"}

<include from="client-create-new-application.topic" element-id="eap-note"/>

次に、Ktorクライアントとエンジンライブラリを定義します。

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="11,19-21"}

依存関係を追加するには、`shared/build.gradle.kts` ファイルを開き、以下の手順に従ってください。

1. 共通コードでKtorクライアントを使用するには、`commonMain` ソースセットに `ktor-client-core` 依存関係を追加します。
   ```kotlin
   ```
   {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

2. 各必須プラットフォームに対応するソースセットに、[エンジン依存関係](client-engines.md)を追加します。
    - Androidの場合、`androidMain` ソースセットに `ktor-client-okhttp` 依存関係を追加します。
      ```kotlin
      ```
      {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="34-36"}

      Androidの場合、[他のエンジンタイプ](client-engines.md#jvm-android)も使用できます。
    - iOSの場合、`iosMain` に `ktor-client-darwin` 依存関係を追加します。
      ```kotlin
      ```
      {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="37-39"}

### コルーチンの追加 {id="coroutines"}

[Androidコード](#android-activity)でコルーチンを使用するには、プロジェクトに `kotlinx.coroutines` を追加する必要があります。

1. `gradle/libs.versions.toml` ファイルを開き、コルーチンのバージョンとライブラリを指定します。

    ```kotlin
    ```
   {src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,4,10-11,22-23"}

2. `build.gradle.kts` ファイルを開き、`commonMain` ソースセットに `kotlinx-coroutines-core` 依存関係を追加します。

    ```kotlin
    ```
   {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-30,40"}

3. 次に、`androidApp/build.gradle.kts` を開き、`kotlinx-coroutines-android` 依存関係を追加します。

```kotlin
```

{src="snippets/tutorial-client-kmm/androidApp/build.gradle.kts" include-lines="41,47,49"}

追加された依存関係をインストールするために、`gradle.properties` ファイルの右上にある **Sync Now** をクリックします。

## アプリケーションの更新 {id="code"}

### 共有コード {id="shared-code"}

AndroidとiOSで共有されるコードを更新するには、`shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` ファイルを開き、`Greeting` クラスに以下のコードを追加します。

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt"}

- HTTPクライアントを作成するには、`HttpClient` コンストラクタが呼び出されます。
- suspend `greeting` 関数は、[リクエスト](client-requests.md)を行い、[レスポンス](client-responses.md)のボディを文字列値として受け取るために使用されます。

### Androidコード {id="android-activity"}

Androidコードからsuspend `greeting` 関数を呼び出すには、[rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))を使用します。

`androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` ファイルを開き、`MainActivity` のコードを次のように更新します。

```kotlin
```

{src="snippets/tutorial-client-kmm/androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt"}

作成されたスコープ内で、共有の `greeting` 関数を呼び出し、発生する可能性のある例外を処理できます。

### iOSコード {id="ios-view"}

1. `iosApp/iosApp/iOSApp.swift` ファイルを開き、アプリケーションのエントリポイントを更新します。
   ```Swift
   ```
   {src="snippets/tutorial-client-kmm/iosApp/iosApp/iOSApp.swift"}

2. `iosApp/iosApp/ContentView.swift` ファイルを開き、`ContentView` のコードを次のように更新します。
   ```Swift
   ```
   {src="snippets/tutorial-client-kmm/iosApp/iosApp/ContentView.swift"}

   iOSでは、`greeting` suspend関数はコールバックを伴う関数として利用できます。

## Androidでのインターネットアクセスを有効にする {id="android-internet"}

最後に行う必要があるのは、Androidアプリケーションのインターネットアクセスを有効にすることです。`androidApp/src/main/AndroidManifest.xml` ファイルを開き、`uses-permission` 要素を使用して必要なパーミッションを有効にします。

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## アプリケーションの実行 {id="run"}

作成したマルチプラットフォームアプリケーションをAndroidまたはiOSシミュレーターで実行するには、**androidApp** または **iosApp** を選択し、**Run** をクリックします。
シミュレーターには、受信したHTMLドキュメントがプレーンテキストとして表示されるはずです。

<tabs>
<tab title="Android">

![Android simulator](tutorial_client_kmm_android.png){width="381"}

</tab>
<tab title="iOS">

![iOS simulator](tutorial_client_kmm_ios.png){width="351"}

</tab>
</tabs>