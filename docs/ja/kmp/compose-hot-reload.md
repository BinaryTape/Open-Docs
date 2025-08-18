[//]: # (title: Compose Hot Reload)

<primary-label ref="alpha"/>

[Compose Hot Reload](https://github.com/JetBrains/compose-hot-reload)は、Compose Multiplatformプロジェクトでの作業中にUIの変更を視覚化し、試すのに役立ちます。

現時点では、Compose Hot Reloadは、マルチプラットフォームプロジェクトにデスクトップターゲットを含めた場合にのみ利用可能です。
今後、他のターゲットに対するサポートを追加することを検討しています。その間、デスクトップアプリをサンドボックスとして使用することで、作業の流れを中断することなく共通コードでのUIの変更を素早く試すことができます。

![Compose Hot Reload](compose-hot-reload.gif){width=500}

## プロジェクトにCompose Hot Reloadを追加する

Compose Hot Reloadは、以下の2つの方法で追加できます。

*   [IntelliJ IDEAまたはAndroid Studioでプロジェクトを最初から作成する](#from-scratch)
*   [既存のプロジェクトにGradleプラグインとして追加する](#to-an-existing-project)

### 最初から

このセクションでは、IntelliJ IDEAおよびAndroid Studioでデスクトップターゲットを含むマルチプラットフォームプロジェクトを作成する手順を説明します。プロジェクトが作成されると、Compose Hot Reloadが自動的に追加されます。

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発の環境をセットアップする](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。
4.  **新規プロジェクト**ウィンドウで、**Name**、**Group**、および**Artifact**フィールドを指定します。
5.  **Desktop**ターゲットを選択し、**Create**をクリックします。
    ![Create multiplatform project with desktop target](create-desktop-project.png){width=700}

### 既存のプロジェクトに

このセクションでは、既存のマルチプラットフォームプロジェクトにCompose Hot Reloadを追加する手順を説明します。これらの手順は、[共有ロジックとUIを持つアプリを作成する](compose-multiplatform-create-first-app.md)チュートリアルのプロジェクトを参照としています。

> Compose Hot Reloadの最新バージョンについては、[Releases](https://github.com/JetBrains/compose-hot-reload/releases)を参照してください。
>
{style="tip"}

1.  プロジェクトで、バージョンカタログを更新します。`gradle/libs.versions.toml`に、以下のコードを追加します。
    ```kotlin
    composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
    ```

    > バージョンカタログを使用してプロジェクト全体の依存関係を一元的に管理する方法の詳細については、当社の[Gradleのベストプラクティス](https://kotlinlang.org/gradle-best-practices.html)を参照してください。

2.  親プロジェクトの`build.gradle.kts` (`ComposeDemo/build.gradle.kts`)で、`plugins {}`ブロックに以下のコードを追加します。
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload) apply false
    }
    ```
    これにより、Compose Hot Reloadプラグインが各サブプロジェクトで複数回ロードされることを防ぎます。

3.  マルチプラットフォームアプリケーションを含むサブプロジェクトの`build.gradle.kts` (`ComposeDemo/composeApp/build.gradle.kts`)で、`plugins {}`ブロックに以下のコードを追加します。
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload)
    }
    ```

4.  Compose Hot Reloadの全ての機能を使用するには、プロジェクトは拡張されたクラス再定義をサポートするOpenJDKのフォークである[JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR)で実行される必要があります。
    Compose Hot Reloadは、プロジェクトのために互換性のあるJBRを自動的にプロビジョニングできます。
    これを許可するには、`settings.gradle.kts`ファイルに以下のGradleプラグインを追加します。

    ```kotlin
    plugins {
        id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
    }
    ```

5.  **Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します: ![Synchronize Gradle files](gradle-sync.png){width=50}

## Compose Hot Reloadを使用する

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
    `alwaysOnTop`変数を`true`に設定することで、生成されたデスクトップアプリが全てのウィンドウの手前に表示され続け、コードを編集して変更をライブで確認しやすくなります。

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

4.  `desktopMain`ディレクトリで、`main.kt`ファイルを開き、ガターの**実行**アイコンをクリックします。
    **Run 'composeApp [desktop]' with Compose Hot Reload (Alpha)**を選択します。

    ![Run Compose Hot Reload from gutter](compose-hot-reload-gutter-run.png){width=350}

    ![First Compose Hot Reload on desktop app](compose-hot-reload-hello.png){width=500}

5.  `greet()`関数から返される文字列を更新し、その後ファイルを保存すると、デスクトップアプリが自動的に更新されるのを確認できます。

    ![Compose Hot Reload](compose-hot-reload.gif){width=500}

おめでとうございます！Compose Hot Reloadが動作しているのを確認できました。これで、変更のたびにデスクトップ実行構成を再起動することなく、テキスト、画像、書式設定、UI構造などの変更を試すことができます。

## ヘルプ

Compose Hot Reloadの使用中に何らかの問題に遭遇した場合は、[GitHub issueを作成](https://github.com/JetBrains/compose-hot-reload/issues)してお知らせください。