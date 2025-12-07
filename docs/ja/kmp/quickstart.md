[//]: # (title: Kotlin Multiplatform クイックスタート)

<web-summary>JetBrains は IntelliJ IDEA および Android Studio の公式 Kotlin IDE サポートを提供しています。</web-summary>

このチュートリアルでは、シンプルな Kotlin Multiplatform アプリケーションをすばやく起動して実行できます。

## 環境設定

Kotlin Multiplatform (KMP) プロジェクトには特定の環境が必要ですが、
ほとんどの要件は IDE のプリフライトチェックによって明確にされます。

IDE と必要なプラグインから始めます。

1.  IDE を選択してインストールします。
    Kotlin Multiplatform は IntelliJ IDEA および Android Studio でサポートされているため、お好みの IDE を使用できます。

    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) は、IDE をインストールするための推奨ツールです。
    これにより、[早期アクセスプログラム](https://www.jetbrains.com/resources/eap/) (EAP) や Nightly リリースを含む、複数の製品やバージョンを管理できます。

    スタンドアロンインストールの場合、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) または [Android Studio](https://developer.android.com/studio) のインストーラーをダウンロードしてください。

    Kotlin Multiplatform に必要なプラグインには、少なくとも
    **IntelliJ IDEA 2025.2.2** または **Android Studio Otter 2025.2.1** が必要です。

2.  [Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)をインストールします (Kotlin Multiplatform Gradle プラグインと混同しないように)。

3.  IntelliJ IDEA 用の Kotlin Multiplatform IDE プラグインをインストールすると、まだ持っていない場合は必要なすべての依存関係もインストールされます
    (Android Studio には必要なすべてのプラグインがバンドルされています)。

4.  `ANDROID_HOME` 環境変数が設定されていない場合は、システムがそれを認識するように設定します。

    <Tabs>
    <TabItem title= "Bash または Zsh">

    以下のコマンドを `.profile` または `.zprofile` に追加します。

    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```

    </TabItem>
    <TabItem title= "Windows PowerShell または CMD">

    PowerShell の場合、以下のコマンドで永続的な環境変数を追加できます
    (詳細は [PowerShell ドキュメント](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables) を参照してください)。

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    CMD の場合、[`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) コマンドを使用します。

    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </TabItem>
    </Tabs>

5.  iOS アプリケーションを作成するには、[Xcode](https://apps.apple.com/us/app/xcode/id497799835) がインストールされた macOS ホストが必要です。
    IDE は内部で Xcode を実行し、iOS フレームワークをビルドします。

    KMP プロジェクトの作業を開始する前に、少なくとも一度は Xcode を起動し、初期設定を完了させてください。

    > Xcode が更新されるたびに手動で起動し、更新されたツールをダウンロードする必要があります。
    > Kotlin Multiplatform IDE プラグインは、Xcode が作業に適した状態でない場合に警告を発するプリフライトチェックを行います。
    >
    {style="note"}

## プロジェクトを作成

<Tabs>
<TabItem title= "IntelliJ IDEA">

IDE ウィザードを使用して新しい KMP プロジェクトを作成します。

1.  メインメニューで **File** | **New** | **Project** を選択します。
2.  左側のリストから **Kotlin Multiplatform** を選択します。
3.  必要に応じて、プロジェクトの名前、場所、その他の基本属性を設定します。
4.  プロジェクトの JDK として [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) のバージョンを選択することを推奨します。これは、特にデスクトップ KMP アプリの互換性を向上させる上で重要な修正を提供するためです。
    関連するバージョンの JBR はすべての IntelliJ IDEA ディストリビューションに含まれているため、追加の設定は必要ありません。
5.  プロジェクトの一部として含めたいプラットフォームを選択します。
    *   すべてのターゲットプラットフォームは、最初から Compose Multiplatform を使用して UI コードを共有するように設定できます
        (UI コードを持たないサーバーモジュールを除く)。
    *   iOS の場合、2つの実装のいずれかを選択できます。
        *   Compose Multiplatform を使用した共有 UI コード
        *   SwiftUI で作成され、共有ロジックを持つ Kotlin モジュールに接続された完全なネイティブ UI
    *   デスクトップターゲットには、[Compose Hot Reload](compose-hot-reload.md) 機能のベータ版が含まれており、対応するコードを変更するとすぐに UI の変更を確認できます。
        デスクトップアプリを作成する予定がない場合でも、UI コードの作成を高速化するためにデスクトップバージョンを使用することをお勧めします。

プラットフォームの選択が完了したら、**Create** ボタンをクリックし、IDE がプロジェクトを生成してインポートするのを待ちます。

![IntelliJ IDEA ウィザードのデフォルト設定で Android、iOS、デスクトップ、および Web プラットフォームが選択されている](idea-wizard-1step.png){width=600}

</TabItem>
<TabItem title= "Android Studio">

Kotlin Multiplatform IDE プラグインは K2 機能に大きく依存しており、それがなければ記載どおりに動作しません。
したがって、開始する前に K2 モードが有効になっていることを確認してください:
**Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**。

IDE ウィザードを使用して新しい KMP プロジェクトを作成します。

1.  メインメニューで **File** | **New** | **New project** を選択します。
2.  デフォルトの **Phone and Tablet** テンプレートカテゴリから **Kotlin Multiplatform** を選択します。

    ![Android Studio の新規プロジェクト作成の最初のステップ](as-wizard-1.png){width="400"}

3.  必要に応じて、プロジェクトの名前、場所、その他の基本属性を設定し、**Next** をクリックします。
4.  プロジェクトの一部として含めたいプラットフォームを選択します。
    *   すべてのターゲットプラットフォームは、最初から Compose Multiplatform を使用して UI コードを共有するように設定できます
        (UI コードを持たないサーバーモジュールを除く)。
    *   iOS の場合、2つの実装のいずれかを選択できます。
        *   Compose Multiplatform を使用した共有 UI コード
        *   SwiftUI で作成され、共有ロジックを持つ Kotlin モジュールに接続された完全なネイティブ UI
    *   デスクトップターゲットには、[Compose Hot Reload](compose-hot-reload.md) 機能のベータ版が含まれており、対応するコードを変更するとすぐに UI の変更を確認できます。
        デスクトップアプリを作成する予定がない場合でも、UI コードの作成を高速化するためにデスクトップバージョンを使用することをお勧めします。
5.  プロジェクトが生成されたら、プロジェクトの JDK として [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) のバージョンを選択することを推奨します。これは、特にデスクトップ KMP アプリの互換性を向上させる上で重要な修正を提供するためです。
    関連するバージョンの JBR はすべての IntelliJ IDEA ディストリビューションに含まれているため、追加の設定は必要ありません。

プラットフォームの選択が完了したら、**Finish** ボタンをクリックし、IDE がプロジェクトを生成してインポートするのを待ちます。

![Android、iOS、デスクトップ、および Web プラットフォームが選択された Android Studio ウィザードの最後のステップ](as-wizard-3step.png){width=600}

</TabItem>
</Tabs>

## プリフライトチェックを確認する

**Project Environment Preflight Checks** ツールウィンドウを開いて、プロジェクト設定に環境の問題がないことを確認できます。
右サイドバーまたは下部バーにあるプリフライトチェックアイコンをクリックします ![飛行機のプリフライトチェックアイコン](ide-preflight-checks.png){width="20"}

このツールウィンドウでは、これらのチェックに関連するメッセージを確認したり、再実行したり、設定を変更したりできます。

プリフライトチェックコマンドは、**Search Everywhere** ダイアログでも利用できます。
<shortcut>Shift</shortcut> を2回押して、「preflight」という単語を含むコマンドを検索します。

![「preflight」という単語が入力された Search Everywhere メニュー](double-shift-preflight-checks.png){width=600}

## サンプルアプリを実行する

IDE ウィザードによって作成されたプロジェクトには、iOS、Android、
デスクトップ、および Web アプリケーション用の生成された実行設定、
ならびにサーバーアプリを実行するための Gradle タスクが含まれています。
各プラットフォームの具体的な Gradle コマンドは以下に示します。

<Tabs>
<TabItem title="Android">

Android アプリを実行するには、**composeApp** 実行設定を開始します。

![Android 実行設定がハイライトされたドロップダウン](run-android-configuration.png){width=250}

Android 実行設定を手動で作成するには、実行設定テンプレートとして **Android App** を選択し、モジュールを **[project name].composeApp** に選択します。

デフォルトでは、利用可能な最初の仮想デバイスで実行されます。

![仮想デバイスで実行された Android アプリ](run-android-app.png){width=300}

</TabItem>
<TabItem title="iOS">

> iOS アプリをビルドするには macOS ホストが必要です。
>
{style="note"}

プロジェクトの iOS ターゲットを選択し、Xcode がインストールされた macOS マシンを設定した場合、
**iosApp** 実行設定を選択し、シミュレートされたデバイスを選択できます。

![iOS 実行設定がハイライトされたドロップダウン](run-ios-configuration.png){width=250}

iOS アプリを実行すると、内部で Xcode を使用してビルドされ、iOS シミュレーターで起動されます。
最初のビルドでは、コンパイルのためにネイティブ依存関係を収集し、その後の実行のためにビルドをウォームアップします。

![仮想デバイスで実行された iOS アプリ](run-ios-app.png){width=350}

</TabItem>
<TabItem title="デスクトップ">

デスクトップアプリのデフォルトの実行設定は、**composeApp [desktop]** として作成されます。

![デフォルトのデスクトップ実行設定がハイライトされたドロップダウン](run-desktop-configuration.png){width=250}

デスクトップ実行設定を手動で作成するには、**Gradle** 実行設定テンプレートを選択し、以下のコマンドで **[app name]:composeApp** Gradle プロジェクトを指します。

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

この設定により、JVM デスクトップアプリを実行できます。

![仮想デバイスで実行された JVM アプリ](run-desktop-app.png){width=600}

</TabItem>
<TabItem title="Web">

Web アプリのデフォルトの実行設定は、**composeApp [wasmJs]** として作成されます。

![デフォルトの Wasm 実行設定がハイライトされたドロップダウン](run-wasm-configuration.png){width=250}

Web 実行設定を手動で作成するには、**Gradle** 実行設定テンプレートを選択し、以下のコマンドで **[app name]:composeApp** Gradle プロジェクトを指します。

```shell
wasmJsBrowserDevelopmentRun
```

この設定を実行すると、IDE は Kotlin/Wasm アプリをビルドし、デフォルトのブラウザで開きます。

![仮想デバイスで実行された Web アプリ](run-wasm-app.png){width=600}

</TabItem>
</Tabs>

## トラブルシューティング

### Java および JDK

Java に関する一般的な問題:

*   一部のツールが Java バージョンを見つけられなかったり、間違ったバージョンを使用したりする場合があります。
    これを解決するには:
    *   `JAVA_HOME` 環境変数を適切な JDK がインストールされているディレクトリに設定します。

        > クラス再定義をサポートする OpenJDK フォークである [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) の使用をお勧めします。
        >
        {style="note"}

    *   `JAVA_HOME` 内の `bin` フォルダへのパスを `PATH` 変数に追加し、JDK に含まれるツールがターミナルで利用可能になるようにします。
*   Android Studio での Gradle JDK に関する問題に遭遇した場合は、正しく設定されていることを確認してください。
    **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle** を選択します。

### Android ツール

JDK と同様に、`adb` などの Android ツールを起動する際に問題がある場合は、`ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin`、および
`ANDROID_HOME/platform-tools` へのパスが `PATH` 環境変数に追加されていることを確認してください。

### Xcode

iOS 実行設定が実行する仮想デバイスがないと報告する場合、またはプリフライトチェックが失敗する場合は、Xcode を起動し、iOS シミュレーターのアップデートがないか確認してください。

### ヘルプ

*   **Kotlin Slack**。 [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) を取得し、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加してください。
*   **Kotlin Multiplatform Tooling イシュートラッカー**。 [新しい問題を報告](https://youtrack.jetbrains.com/newIssue?project=KMT) してください。

## 次にすること

KMP プロジェクトの構造と共有コードの作成について詳しく学習します。
*   共有 UI コードの使用に関するチュートリアルのシリーズ: [Create your Compose Multiplatform app](compose-multiplatform-create-first-app.md)
*   ネイティブ UI と共有コードの使用に関するチュートリアルのシリーズ: [Create your Kotlin Multiplatform app](multiplatform-create-first-app.md)
*   Kotlin Multiplatform ドキュメントを詳しく確認します。
    *   [Project configuration](multiplatform-project-configuration.md)
    *   [Working with multiplatform dependencies](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
*   Compose Multiplatform UI フレームワーク、その基本、およびプラットフォーム固有の機能について学習します。
    [Compose Multiplatform と Jetpack Compose の関係](compose-multiplatform-and-jetpack-compose.md)。

KMP 向けにすでに書かれたコードを見つける。
*   公式 JetBrains サンプルと、KMP の機能を示す厳選されたプロジェクトリストを含む [Samples](multiplatform-samples.md) ページ。
*   GitHub トピック:
    *   [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)、Kotlin Multiplatform で実装されたプロジェクト。
    *   [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)、
        KMP で書かれたサンプルプロジェクトのリスト。
*   [klibs.io](https://klibs.io) – KMP ライブラリの検索プラットフォーム。これまでに OkHttp、Ktor、Coil、Koin、SQLDelight など、2000以上のライブラリがインデックス化されています。