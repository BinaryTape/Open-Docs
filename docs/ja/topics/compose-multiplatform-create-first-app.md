[//]: # (title: Compose Multiplatformアプリを作成する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通です。</p>
    <br/>
    <p>これは、『**共有ロジックとUIを持つCompose Multiplatformアプリを作成する**』チュートリアルの最初のパートです。</p>
    <p><img src="icon-1.svg" width="20" alt="最初のステップ"/> <strong>Compose Multiplatformアプリを作成する</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="次のステップ"/> コンポーザブルコードを探索する <br/>
        <img src="icon-3-todo.svg" width="20" alt="次のステップ"/> プロジェクトを変更する <br/>      
        <img src="icon-4-todo.svg" width="20" alt="次のステップ"/> 独自のアプリケーションを作成する <br/>
    </p>
</tldr>

ここでは、IntelliJ IDEAを使用して最初のCompose Multiplatformアプリケーションを作成し、実行する方法を学びます。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UIフレームワークを使用すると、Kotlin Multiplatformのコード共有機能をアプリケーションロジックを超えて拡張できます。ユーザーインターフェースを一度実装すれば、Compose Multiplatformがサポートするすべてのプラットフォームでそれを使用できます。

このチュートリアルでは、Android、iOS、デスクトップ、およびWebで動作するサンプルアプリケーションを構築します。ユーザーインターフェースを作成するために、Compose Multiplatformフレームワークを使用し、その基本であるコンポーザブル関数、テーマ、レイアウト、イベント、修飾子について学びます。

このチュートリアルで留意すべき点：
* Compose Multiplatform、Android、iOSのいずれも事前の経験は不要です。ただし、始める前に[Kotlinの基礎](https://kotlinlang.org/docs/getting-started.html)に慣れておくことをお勧めします。
* このチュートリアルを完了するには、IntelliJ IDEAのみが必要です。これにより、Androidおよびデスクトップでのマルチプラットフォーム開発を試すことができます。iOSの場合、XcodeがインストールされたmacOSマシンが必要です。これはiOS開発の一般的な制限です。
* 必要であれば、興味のある特定のプラットフォームに選択を限定し、他を省略することも可能です。

## プロジェクトを作成する

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発の環境をセットアップする](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project** を選択します。
3.  左側のパネルで、**Kotlin Multiplatform** を選択します。

    > Kotlin Multiplatform IDEプラグインを使用していない場合でも、[KMPウェブウィザード](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)を使用して同じプロジェクトを生成できます。
    >
    {style="note"}

4.  **New Project** ウィンドウで以下のフィールドを指定します。

    *   **Name**: ComposeDemo
    *   **Group**: compose.project
    *   **Artifact**: demo

    > ウェブウィザードを使用する場合、**Project Name** に"ComposeDemo"を、**Project ID** に"compose.project.demo"を指定します。
    >
    {style="note"}

5.  **Android**、**iOS**、**Desktop**、および**Web** ターゲットを選択します。
    iOSの場合は**Share UI** オプションが選択されていることを確認してください。
6.  すべてのフィールドとターゲットを指定したら、**Create** (ウェブウィザードでは**Download**) をクリックします。

   ![Compose Multiplatformプロジェクトの作成](create-compose-multiplatform-project.png){width=800}

## プロジェクト構造を確認する

IntelliJ IDEAで、「ComposeDemo」フォルダーに移動します。
ウィザードでiOSを選択しなかった場合、名前に「ios」または「apple」を含むフォルダーはありません。

> IntelliJ IDEAは、プロジェクトのAndroid Gradleプラグインを最新バージョンにアップグレードすることを自動的に提案する場合があります。Kotlin Multiplatformは最新のAGPバージョンと互換性がないため、アップグレードは推奨されません（[互換性テーブル](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)を参照）。
>
{style="note"}

プロジェクトには2つのモジュールが含まれています。

*   _composeApp_は、Android、デスクトップ、iOS、およびWebアプリケーション間で共有されるロジックを含むKotlinモジュールです。これは、すべてのプラットフォームで使用するコードです。ビルドプロセスを自動化するのに役立つビルドシステムとして[Gradle](https://kotlinlang.org/docs/gradle.html)を使用します。
*   _iosApp_は、iOSアプリケーションにビルドされるXcodeプロジェクトです。これは共有モジュールに依存し、iOSフレームワークとしてそれを使用します。

  ![Compose Multiplatformプロジェクト構造](compose-project-structure.png){width=350}

**composeApp**モジュールは、`androidMain`、`commonMain`、`desktopMain`、`iosMain`、および`wasmJsMain`のソースセットで構成されています。_ソースセット_とは、論理的にグループ化されたファイルの集合体であり、各グループには独自の依存関係があります。Kotlin Multiplatformでは、異なるソースセットが異なるプラットフォームをターゲットにできます。

`commonMain`ソースセットは共通のKotlinコードを使用し、プラットフォームソースセットは各ターゲットに固有のKotlinコードを使用します。`androidMain`と`desktopMain`にはKotlin/JVMが使用されます。`iosMain`にはKotlin/Nativeが使用されます。一方、`wasmJsMain`にはKotlin/Wasmが使用されます。

![共通Kotlin、Kotlin/JVM、およびKotlin/Native](module-structure.png){width=700}

一般的に、プラットフォーム固有のソースセットで機能を重複させるのではなく、可能な限り共通コードとして実装を記述してください。

`composeApp/src/commonMain/kotlin`ディレクトリにある`App.kt`ファイルを開きます。このファイルには、最小限ながらも完全なCompose Multiplatform UIを実装する`App()`関数が含まれています。

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
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

## アプリケーションを実行する

アプリケーションはAndroid、iOS、デスクトップ、およびWebで実行できます。特定の順序で実行する必要はないので、最も慣れているプラットフォームから始めてください。

> Gradleビルドタスクを使用する必要はありません。マルチプラットフォームアプリケーションでは、これはサポートされているすべてのターゲットのデバッグおよびリリースバージョンをビルドします。Multiplatformウィザードで選択されたプラットフォームによっては、時間がかかる場合があります。実行構成を使用する方がはるかに高速です。この場合、選択されたターゲットのみがビルドされます。
>
{style="tip"}

### Androidでアプリケーションを実行する

1.  実行構成のリストで、**composeApp** を選択します。
2.  Android仮想デバイスを選択し、**Run** をクリックします。IDEは、選択された仮想デバイスの電源がオフの場合に起動し、アプリを実行します。

![AndroidでCompose Multiplatformアプリを実行する](compose-run-android.png){width=350}

![Android上の最初のCompose Multiplatformアプリ](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 別のAndroidシミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[Androidエミュレーターを構成し、別のシミュレートデバイスでアプリケーションを実行する方法](https://developer.android.com/studio/run/emulator#runningapp)を学びましょう。

#### 実機Androidデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[ハードウェアデバイスを構成して接続し、そのデバイスでアプリケーションを実行する方法](https://developer.android.com/studio/run/device)を学びましょう。

</snippet>

### iOSでアプリケーションを実行する

初期設定の一部としてXcodeを起動していない場合は、iOSアプリを実行する前に起動してください。

IntelliJ IDEAで、実行構成のリストから**iosApp**を選択し、実行構成の隣にあるシミュレートデバイスを選択して**Run**をクリックします。
リストに利用可能なiOS構成がない場合は、[新しい実行構成を追加](#run-on-a-new-ios-simulated-device)してください。

![iOSでCompose Multiplatformアプリを実行する](compose-run-ios.png){width=350}

![iOS上の最初のCompose Multiplatformアプリ](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 新しいiOSシミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

アプリケーションをシミュレートデバイスで実行したい場合は、新しい実行構成を追加できます。

1.  実行構成のリストで、**Edit Configurations** をクリックします。

   ![実行構成を編集する](ios-edit-configurations.png){width=450}

2.  構成リストの上にある**+**ボタンをクリックし、**Xcode Application** を選択します。

   ![iOSアプリケーションの新しい実行構成](ios-new-configuration.png)

3.  構成に名前を付けます。
4.  **Working directory** を選択します。そのためには、プロジェクト（例: **KotlinMultiplatformSandbox**）の`iosApp`フォルダーに移動します。

5.  **Run** をクリックして、新しいシミュレートデバイスでアプリケーションを実行します。

#### 実機iOSデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

マルチプラットフォームアプリケーションを実機iOSデバイスで実行できます。開始する前に、[Apple ID](https://support.apple.com/en-us/HT204316)に関連付けられたチームIDを設定する必要があります。

##### チームIDを設定する

プロジェクトでチームIDを設定するには、IntelliJ IDEAでKDoctorツールを使用するか、Xcodeでチームを選択できます。

KDoctorの場合:

1.  IntelliJ IDEAで、ターミナルで次のコマンドを実行します。

    ```none
    kdoctor --team-ids 
    ```

    KDoctorは、現在システムに構成されているすべてのチームIDをリスト表示します。例えば:

    ```text
    3ABC246XYZ (Max Sample)
    ZABCW6SXYZ (SampleTech Inc.)
    ```

2.  IntelliJ IDEAで`iosApp/Configuration/Config.xcconfig`を開き、チームIDを指定します。

または、Xcodeでチームを選択します:

1.  Xcodeを開き、**Open a project or file** を選択します。
2.  プロジェクトの`iosApp/iosApp.xcworkspace`ファイルに移動します。
3.  左側のメニューで`iosApp`を選択します。
4.  **Signing & Capabilities** に移動します。
5.  **Team** リストで、ご自身のチームを選択します。

   まだチームを設定していない場合は、**Team** リストの**Add an Account** オプションを使用し、Xcodeの指示に従ってください。

6.  バンドル識別子が一意であり、署名証明書が正常に割り当てられていることを確認してください。

##### アプリを実行する

iPhoneをケーブルで接続します。Xcodeにすでにデバイスが登録されている場合、IntelliJ IDEAは実行構成のリストにそのデバイスを表示するはずです。対応する`iosApp`構成を実行します。

まだXcodeにiPhoneを登録していない場合は、[Appleの推奨事項](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)に従ってください。
簡単に言うと、以下の手順を実行します。

1.  iPhoneをケーブルで接続します。
2.  iPhoneで、**設定** | **プライバシーとセキュリティ** で開発者モードを有効にします。
3.  Xcodeで、上部メニューから**Window** | **Devices and Simulators** を選択します。
4.  プラス記号をクリックします。接続されているiPhoneを選択し、**Add** をクリックします。
5.  Apple IDでサインインし、デバイスでの開発機能を有効にします。
6.  画面の指示に従ってペアリングプロセスを完了します。

XcodeでiPhoneを登録したら、IntelliJ IDEAで[新しい実行構成を作成](#run-on-a-new-ios-simulated-device)し、**Execution target** リストでデバイスを選択します。対応する`iosApp`構成を実行します。

</snippet>

### デスクトップでアプリケーションを実行する

実行構成のリストで**composeApp [desktop]** を選択し、**Run** をクリックします。デフォルトでは、実行構成は独自のOSウィンドウでデスクトップアプリを起動します。

![デスクトップでCompose Multiplatformアプリを実行する](compose-run-desktop.png){width=350}

![デスクトップ上の最初のCompose Multiplatformアプリ](first-compose-project-on-desktop-1.png){width=500}

### ウェブアプリケーションを実行する

実行構成のリストで**composeApp [wasmJs]** を選択し、**Run** をクリックします。

![ウェブでCompose Multiplatformアプリを実行する](compose-run-web.png){width=350}

ウェブアプリケーションはブラウザで自動的に開きます。あるいは、実行が完了したらブラウザに以下のURLを入力することもできます。

```shell
   http://localhost:8080/
```
> ポート番号は8080番ポートが利用できない場合に異なることがあります。
> 実際のポート番号はGradleビルドコンソールで確認できます。
>
{style="tip"}

![Composeウェブアプリケーション](first-compose-project-on-web.png){width=550}

## 次のステップ

チュートリアルの次のパートでは、コンポーザブル関数を実装し、各プラットフォームでアプリケーションを起動する方法を学びます。

**[次のパートに進む](compose-multiplatform-explore-composables.md)**

## ヘルプ

*   **Kotlin Slack**。[招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受けて、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin issue tracker**。[新しいイシューを報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。