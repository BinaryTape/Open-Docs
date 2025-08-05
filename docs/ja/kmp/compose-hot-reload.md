[//]: # (title: Compose ホットリロード)

<primary-label ref="alpha"/>

[Compose ホットリロード](https://github.com/JetBrains/compose-hot-reload)は、Compose Multiplatformプロジェクトで作業中にUIの変更を視覚化し、試すのに役立ちます。

現時点では、Compose ホットリロードは、Multiplatformプロジェクトにデスクトップターゲットを含める場合にのみ利用可能です。
将来的には他のターゲットのサポートも検討しています。それまでの間、デスクトップアプリをサンドボックスとして使用することで、開発フローを中断することなく、共通コードでのUI変更を迅速に試すことができます。

![Compose ホットリロード](compose-hot-reload.gif){width=500}

## プロジェクトにCompose ホットリロードを追加する

Compose ホットリロードは、次の2つの方法で追加できます。

*   [IntelliJ IDEAまたはAndroid Studioでプロジェクトをゼロから作成する](#from-scratch)
*   [既存プロジェクトにGradleプラグインとして追加する](#to-an-existing-project)

### ゼロから作成する

このセクションでは、IntelliJ IDEAとAndroid Studioでデスクトップターゲットを含むMultiplatformプロジェクトを作成する手順を説明します。プロジェクトが作成されると、Compose ホットリロードが自動的に追加されます。

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発用の環境をセットアップする](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。
4.  **New Project**ウィンドウで、**Name**、**Group**、**Artifact**フィールドを指定します。
5.  **Desktop**ターゲットを選択し、**Create**をクリックします。
    ![デスクトップターゲットを含むMultiplatformプロジェクトを作成する](create-desktop-project.png){width=700}

### 既存プロジェクトに追加する

このセクションでは、既存のMultiplatformプロジェクトにCompose ホットリロードを追加する手順を説明します。この手順は、[共有ロジックとUIを持つアプリを作成する](compose-multiplatform-create-first-app.md)チュートリアルのプロジェクトを参照としています。

> Compose ホットリロードの最新バージョンを見つけるには、[リリース](https://github.com/JetBrains/compose-hot-reload/releases)を参照してください。
>
{style="tip"}

1.  プロジェクトでバージョンカタログを更新します。`gradle/libs.versions.toml`に、以下のコードを追加します。
    ```kotlin
    composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
    ```

    > バージョンカタログを使用してプロジェクト全体の依存関係を一元管理する方法について詳しくは、[Gradleのベストプラクティス](https://kotlinlang.org/gradle-best-practices.html)を参照してください。

2.  親プロジェクトの`build.gradle.kts` (`ComposeDemo/build.gradle.kts`)に、`plugins {}`ブロックに以下のコードを追加します。
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload) apply false
    }
    ```
    これにより、Compose ホットリロードプラグインが各サブプロジェクトで複数回ロードされるのを防ぎます。

3.  Multiplatformアプリケーションを含むサブプロジェクトの`build.gradle.kts` (`ComposeDemo/composeApp/build.gradle.kts`)に、`plugins {}`ブロックに以下のコードを追加します。
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload)
    }
    ```

4.  Compose ホットリロードの全機能を使用するには、プロジェクトは[JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR)上で実行される必要があります。JBRは、強化されたクラス再定義をサポートするOpenJDKのフォークです。
    Compose ホットリロードは、プロジェクト用の互換性のあるJBRを自動的にプロビジョニングできます。
    これを許可するには、`settings.gradle.kts`ファイルに以下のGradleプラグインを追加します。

    ```kotlin
    plugins {
        id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
    }
    ```

5.  **Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します。 ![Gradleファイルを同期する](gradle-sync.png){width=50}

## Compose ホットリロードを使用する

1.  `desktopMain`ディレクトリで、`main.kt`ファイルを開き、`main()`関数を更新します。
    ```kotlin
    fun main() = application {
        Window(
            onCloseRequest = ::exitApplication,
            alwaysOnTop = true,
            title = "composedemo",
        ) {
            App()
        }
    }
    ```
    `alwaysOnTop`変数を`true`に設定することで、生成されたデスクトップアプリがすべてのウィンドウの上に表示され、コードを編集して変更をライブで確認しやすくなります。

2.  `commonMain`ディレクトリで、`App.kt`ファイルを開き、`Button`コンポーザブルを更新します。
    ```kotlin
    Button(onClick = { showContent = !showContent }) {
        Column {
            Text(Greeting().greet())
        }
    }
    ```
    これで、ボタンのテキストは`greet()`関数によって制御されます。

3.  `commonMain`ディレクトリで、`Greeting.kt`ファイルを開き、`greet()`関数を更新します。
    ```kotlin
     fun greet(): String {
         return "Hello!"
     }
    ```

4.  `desktopMain`ディレクトリで、`main.kt`ファイルを開き、ガターにある**Run**アイコンをクリックします。
    **Run 'composeApp [desktop]' with Compose Hot Reload (Alpha)**を選択します。

    ![ガターからCompose ホットリロードを実行](compose-hot-reload-gutter-run.png){width=350}

    ![デスクトップアプリでの最初のCompose ホットリロード](compose-hot-reload-hello.png){width=500}

5.  `greet()`関数から返される文字列を更新し、ファイルを保存すると、デスクトップアプリが自動的に更新されます。

    ![Compose ホットリロード](compose-hot-reload.gif){width=500}

おめでとうございます！Compose ホットリロードが動作しているのを確認できました。これで、変更のたびにデスクトップ実行構成を再起動する必要なく、テキスト、画像、フォーマット、UI構造などを変更して試すことができます。

## ヘルプ

Compose ホットリロードの使用中に問題が発生した場合は、[GitHub Issueを作成](https://github.com/JetBrains/compose-hot-reload/issues)してお知らせください。