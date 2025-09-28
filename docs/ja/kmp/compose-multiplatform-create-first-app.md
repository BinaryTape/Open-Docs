[//]: # (title: Compose Multiplatformアプリを作成する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通しています。</p>
    <br/>
    <p>これは**共有ロジックとUIを持つCompose Multiplatformアプリの作成**チュートリアルの最初のパートです。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> **Compose Multiplatformアプリの作成**<br/>
        <img src="icon-2-todo.svg" width="20" alt="Second step"/> コンポーザブルコードを探索する <br/>
        <img src="icon-3-todo.svg" width="20" alt="Third step"/> プロジェクトの変更 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションを作成する <br/>
    </p>
</tldr>

ここでは、IntelliJ IDEAを使って初めてのCompose Multiplatformアプリケーションを作成し、実行する方法を学びます。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UIフレームワークを使えば、Kotlin Multiplatformのコード共有機能をアプリケーションロジックを超えて拡張できます。ユーザーインターフェースを一度実装すれば、Compose Multiplatformがサポートするすべてのプラットフォームでそれを使用できます。

このチュートリアルでは、Android、iOS、デスクトップ、およびウェブで動作するサンプルアプリケーションを構築します。ユーザーインターフェースを作成するにはCompose Multiplatformフレームワークを使用し、その基本であるコンポーザブル関数、テーマ、レイアウト、イベント、モディファイアについて学びます。

このチュートリアルを進める上での注意点：
*   Compose Multiplatform、Android、iOSに関する事前の経験は不要です。開始する前に[Kotlinの基礎](https://kotlinlang.org/docs/getting-started.html)に慣れておくことをお勧めします。
*   このチュートリアルを完了するには、IntelliJ IDEAのみが必要です。IntelliJ IDEAを使用すると、Androidおよびデスクトップでのマルチプラットフォーム開発を試すことができます。iOSの場合、XcodeがインストールされたmacOSマシンが必要です。これはiOS開発全般の制限事項です。
*   必要に応じて、興味のある特定のプラットフォームに選択を限定し、他のプラットフォームを省略することも可能です。

## プロジェクトの作成

1.  [クイックスタート](quickstart.md)に記載されている[Kotlin Multiplatform開発の環境設定](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。

    > Kotlin Multiplatform IDEプラグインを使用していない場合でも、[KMP Webウィザード](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)を使用して同じプロジェクトを生成できます。
    >
    {style="note"}

4.  **New Project**ウィンドウで以下のフィールドを指定します。

    *   **Name**: ComposeDemo
    *   **Group**: compose.project
    *   **Artifact**: demo

    > Webウィザードを使用している場合は、**Project Name**を「ComposeDemo」、**Project ID**を「compose.project.demo」と指定します。
    >
    {style="note"}

5.  **Android**、**iOS**、**Desktop**、および**Web**ターゲットを選択します。
    iOSとWebの**Share UI**オプションが選択されていることを確認してください。
6.  すべてのフィールドとターゲットを指定したら、**Create**（Webウィザードの場合は**Download**）をクリックします。

   ![Create Compose Multiplatform project](create-compose-multiplatform-project.png){width=800}

## プロジェクト構造の確認

IntelliJ IDEAで`ComposeDemo`フォルダに移動します。
ウィザードでiOSを選択しなかった場合、「ios」または「apple」で始まる名前のフォルダはありません。

> IntelliJ IDEAは、プロジェクト内のAndroid Gradleプラグインを最新バージョンにアップグレードすることを自動的に提案する場合があります。
> しかし、Kotlin Multiplatformは最新のAGPバージョンと互換性がないため（[互換性テーブル](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)を参照）、アップグレードはお勧めしません。
>
{style="note"}

このプロジェクトには2つのモジュールが含まれています。

*   _composeApp_ は、Android、デスクトップ、iOS、ウェブアプリケーション間で共有されるロジック（すべてのプラットフォームで使用するコード）を含むKotlinモジュールです。ビルドプロセスを自動化するのに役立つビルドシステムとして[Gradle](https://kotlinlang.org/docs/gradle.html)を使用しています。
*   _iosApp_ は、iOSアプリケーションにビルドされるXcodeプロジェクトです。共有モジュールに依存し、それをiOSフレームワークとして使用します。

  ![Compose Multiplatform project structure](compose-project-structure.png)

**composeApp**モジュールは、`androidMain`、`commonMain`、`iosMain`、`jsMain`、`jvmMain`、`wasmJsMain`、および`webMain`のソースセットで構成されています（テストを含めることを選択した場合は`commonTest`も）。
_ソースセット_ とは、Gradleの概念で、論理的にグループ化された複数のファイルの集まりであり、各グループは独自の依存関係を持ちます。Kotlin Multiplatformでは、異なるソースセットが異なるプラットフォームをターゲットにすることができます。

`commonMain`ソースセットは共通のKotlinコードを使用し、プラットフォームソースセットは各ターゲットに固有のKotlinコードを使用します。

*   `jvmMain` はデスクトップのソースファイルで、Kotlin/JVMを使用します。
*   `androidMain` もKotlin/JVMを使用します。
*   `iosMain` はKotlin/Nativeを使用します。
*   `jsMain` はKotlin/JSを使用します。
*   `wasmJsMain` はKotlin/Wasmを使用します。
*   `webMain` は、`jsMain`と`wasmJsMain`を含むウェブの[中間ソースセット](multiplatform-hierarchy.md#manual-configuration)です。

共有モジュールがAndroidライブラリにビルドされるとき、共通のKotlinコードはKotlin/JVMとして扱われます。iOSフレームワークにビルドされるとき、共通のKotlinコードはKotlin/Nativeとして扱われます。共有モジュールがWebアプリにビルドされるとき、共通のKotlinコードはKotlin/WasmおよびKotlin/JSとして扱われます。

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](module-structure.svg){width=700}

一般的に、プラットフォーム固有のソースセットで機能を重複させるのではなく、可能な限り実装を共通コードとして記述してください。

`composeApp/src/commonMain/kotlin`ディレクトリにある`App.kt`ファイルを開きます。このファイルには、最小限ながら完全なCompose Multiplatform UIを実装する`App()`関数が含まれています。

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="fun App()"}

サポートされているすべてのプラットフォームでアプリケーションを実行してみましょう。

## アプリケーションの実行

アプリケーションはAndroid、iOS、デスクトップ、およびウェブで実行できます。特定の順序で実行する必要はないため、最も慣れているプラットフォームから始めてください。

> Gradleビルドタスクを使用する必要はありません。マルチプラットフォームアプリケーションでは、これはサポートされているすべてのターゲットのデバッグ版とリリース版をビルドします。Multiplatformウィザードで選択されたプラットフォームによっては、時間がかかる場合があります。
> 実行構成を使用する方がはるかに高速です。この場合、選択されたターゲットのみがビルドされます。
>
{style="tip"}

### Androidでアプリケーションを実行する

1.  実行構成のリストから**composeApp**を選択します。
2.  Android仮想デバイスを選択し、**Run**をクリックします。IDEが選択された仮想デバイスの電源が入っていない場合は起動し、アプリを実行します。

![Run the Compose Multiplatform app on Android](compose-run-android.png){width=350}

![First Compose Multiplatform app on Android](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 別のAndroidシミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[Android Emulatorを設定し、別のシミュレートデバイスでアプリケーションを実行する方法](https://developer.android.com/studio/run/emulator#runningapp)を学びましょう。

#### 実際のAndroidデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[ハードウェアデバイスを設定して接続し、そのデバイスでアプリケーションを実行する方法](https://developer.android.com/studio/run/device)を学びましょう。

</snippet>

### iOSでアプリケーションを実行する

初期設定の一環としてXcodeを起動していない場合は、iOSアプリを実行する前にXcodeを起動してください。

IntelliJ IDEAで、実行構成のリストから**iosApp**を選択し、実行構成の横にあるシミュレートデバイスを選択して、**Run**をクリックします。
リストに利用可能なiOS構成がない場合は、[新しい実行構成を追加](#run-on-a-new-ios-simulated-device)します。

![Run the Compose Multiplatform app on iOS](compose-run-ios.png){width=350}

![First Compose Multiplatform app on iOS](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 新しいiOSシミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

アプリケーションをシミュレートデバイスで実行したい場合は、新しい実行構成を追加できます。

1.  実行構成のリストで、**Edit Configurations**をクリックします。

   ![Edit run configurations](ios-edit-configurations.png){width=450}

2.  構成リストの上にある**+**ボタンをクリックし、**Xcode Application**を選択します。

   ![New run configuration for iOS application](ios-new-configuration.png)

3.  構成に名前を付けます。
4.  **Working directory**を選択します。そのためには、プロジェクト（例：**KotlinMultiplatformSandbox**）の`iosApp`フォルダに移動します。

5.  **Run**をクリックして、新しいシミュレートデバイスでアプリケーションを実行します。

#### 実際のiOSデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

マルチプラットフォームアプリケーションを実際のiOSデバイスで実行できます。開始する前に、[Apple ID](https://support.apple.com/en-us/HT204316)に関連付けられたTeam IDを設定する必要があります。

##### Team IDの設定

プロジェクトでTeam IDを設定するには、IntelliJ IDEAでKDoctorツールを使用するか、Xcodeでチームを選択することができます。

KDoctorの場合：

1.  IntelliJ IDEAで、ターミナルで以下のコマンドを実行します。

   ```none
   kdoctor --team-ids 
   ```

   KDoctorは、現在システムに設定されているすべてのTeam IDをリストします。例：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2.  IntelliJ IDEAで、`iosApp/Configuration/Config.xcconfig`を開き、Team IDを指定します。

あるいは、Xcodeでチームを選択する方法：

1.  Xcodeを起動し、**Open a project or file**を選択します。
2.  プロジェクトの`iosApp/iosApp.xcworkspace`ファイルに移動します。
3.  左側のメニューで`iosApp`を選択します。
4.  **Signing & Capabilities**に移動します。
5.  **Team**リストで、自分のチームを選択します。

   まだチームを設定していない場合は、**Team**リストの**Add an Account**オプションを使用して、Xcodeの指示に従ってください。

6.  Bundle Identifierがユニークであり、Signing Certificateが正常に割り当てられていることを確認してください。

##### アプリケーションの実行

iPhoneをケーブルで接続します。Xcodeにデバイスがすでに登録されている場合、IntelliJ IDEAはそれを実行構成のリストに表示します。対応する`iosApp`構成を実行してください。

まだiPhoneをXcodeに登録していない場合は、[Appleの推奨事項](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)に従ってください。
手短に言えば、以下の手順を実行する必要があります。

1.  iPhoneをケーブルで接続します。
2.  iPhoneで、**設定** | **プライバシーとセキュリティ**から開発者モードを有効にします。
3.  Xcodeで、上部メニューから**Window** | **Devices and Simulators**を選択します。
4.  プラス記号をクリックします。接続されているiPhoneを選択し、**Add**をクリックします。
5.  Apple IDでサインインして、デバイスでの開発機能を有効にします。
6.  画面の指示に従ってペアリングプロセスを完了します。

XcodeでiPhoneを登録したら、IntelliJ IDEAで[新しい実行構成を作成](#run-on-a-new-ios-simulated-device)し、**Execution target**リストでデバイスを選択します。対応する`iosApp`構成を実行します。

</snippet>

### デスクトップでアプリケーションを実行する

実行構成のリストから**composeApp [desktop]**を選択し、**Run**をクリックします。デフォルトでは、実行構成はデスクトップアプリを独自のOSウィンドウで起動します。

![Run the Compose Multiplatform app on desktop](compose-run-desktop.png){width=350}

![First Compose Multiplatform app on desktop](first-compose-project-on-desktop-1.png){width=500}

### ウェブアプリケーションを実行する

1.  実行構成のリストから以下を選択します。

    *   **composeApp[js]**: Kotlin/JSアプリケーションを実行します。
    *   **composeApp[wasmJs]**: Kotlin/Wasmアプリケーションを実行します。

   ![Run the Compose Multiplatform app on web](web-run-configuration.png){width=400}

2.  **Run**をクリックします。

ウェブアプリケーションはブラウザで自動的に開きます。あるいは、実行が完了したらブラウザに以下のURLを入力することもできます。

```shell
   http://localhost:8080/
```
> ポート番号は、8080番ポートが利用できない場合があるため、異なる場合があります。
> 実際のポート番号はGradleビルドコンソールで確認できます。
>
{style="tip"}

![Compose web application](first-compose-project-on-web.png){width=600}

#### ウェブターゲットの互換モード

ウェブアプリケーションで互換モードを有効にすることで、すべてのブラウザで追加設定なしで動作するようにできます。
このモードでは、モダンなブラウザはWasmバージョンを使用し、古いブラウザはJSバージョンにフォールバックします。
このモードは、`js`と`wasmJs`の両ターゲットに対するクロスコンパイルによって実現されます。

ウェブアプリケーションの互換モードを有効にするには：

1.  **View | Tool Windows | Gradle**を選択してGradleツールウィンドウを開きます。
2.  **composedemo | Tasks | compose**で、**composeCompatibilityBrowserDistribution**タスクを選択して実行します。

    > タスクが正常にロードされるためには、Gradle JVMとしてJava 11以上が必要です。また、Compose Multiplatformプロジェクト全般では、JetBrains Runtime 17以上を推奨します。
    >
    {style="note"}

   ![Run compatibility task](web-compatibility-gradle-task.png){width=500}

   あるいは、`ComposeDemo`のルートディレクトリからターミナルで以下のコマンドを実行することもできます。

    ```bash
    ./gradlew composeCompatibilityBrowserDistribution
    ```

Gradleタスクが完了すると、互換性のあるアーティファクトが`composeApp/build/dist/composeWebCompatibility/productionExecutable`ディレクトリに生成されます。
これらのアーティファクトを使用して、`js`と`wasmJs`の両ターゲットで動作する[アプリケーションを公開](https://kotlinlang.org/docs/wasm-get-started.html#publish-the-application)できます。

## 次のステップ

チュートリアルの次のパートでは、コンポーザブル関数の実装方法と、各プラットフォームでアプリケーションを起動する方法を学びます。

**[次のパートに進む](compose-multiplatform-explore-composables.md)**

## ヘルプ

*   **Kotlin Slack**。[招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)し、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。[新しい課題を報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。