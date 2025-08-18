[//]: # (title: Kotlin Multiplatformライブラリの作成 - チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートを共有しています。</p>
</tldr>

このチュートリアルでは、IntelliJ IDEAでマルチプラットフォームライブラリを作成し、ローカルのMavenリポジトリに公開し、別のプロジェクトで依存関係として追加する方法を学びます。

このチュートリアルは、フィボナッチ数列を生成する関数を含むシンプルなライブラリである、当社の[マルチプラットフォームライブラリテンプレート](https://github.com/Kotlin/multiplatform-library-template)に基づいています。

## 環境をセットアップする

[必要なツールをすべてインストールし、最新バージョンに更新します](quickstart.md)。

## プロジェクトを作成する

1.  IntelliJ IDEAで、**File** | **New** | **Project from Version Control** を選択します。
2.  [マルチプラットフォームライブラリテンプレートプロジェクト](https://github.com/Kotlin/multiplatform-library-template)のURLを入力します。

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```

3.  **Clone** をクリックします。

## プロジェクト構造を確認する

Kotlin Multiplatformライブラリテンプレートプロジェクトは、Kotlin Multiplatformライブラリを開発するための基礎的な構造を提供します。このテンプレートは、様々なプラットフォームで動作するライブラリの作成に役立ちます。

テンプレートプロジェクトでは、`library` がコアモジュールとして機能し、Multiplatformライブラリのメインソースコードとビルドリソースを含んでいます。

![Multiplatform library project structure](multiplatform-library-template-project.png){width=350}

`library` モジュールは、共有コードとプラットフォーム固有の実装を収容するように構築されています。その主要なソースコード (`src`) の内容は次のとおりです。

*   **`commonMain`:** すべてのターゲットプラットフォームで共有されるKotlinコードが含まれています。ここでは、プラットフォーム固有のAPIに依存しないコードを配置します。
*   **`androidMain`、`iosMain`、`jvmMain`、`linuxX64Main`:** Android、iOS、JVM、Linuxプラットフォーム固有のコードが含まれています。ここでは、これらのプラットフォームに固有の機能を実装します。
*   **`commonTest`、`androidUnitTest`、`iosTest`、`jvmTest`、`linuxX64Test`:** 共有された `commonMain` コードのテストと、それぞれAndroid、iOS、JVM、Linuxプラットフォームに固有のテストが含まれています。

すべてのプラットフォームで共有される `library` コードに焦点を当てましょう。`src/commonMain/kotlin` ディレクトリ内には、フィボナッチ数列ジェネレーターを定義するKotlin Multiplatformコードを含む `CustomFibi.kt` ファイルがあります。

```kotlin
package io.github.kotlin.fibonacci

// Defines the function to generate the Fibonacci sequence
fun generateFibi() = sequence {
    var a = firstElement
    yield(a)
    
    var b = secondElement
    yield(b)
    
    while (true) {
        val c = a + b
        yield(c)
        a = b
        b = c
    }
}

// Declares the expected values for `firstElement` and `secondElement`
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` と `secondElement` プロパティは、プラットフォーム固有のコードが実装できるプレースホルダーです。
各ターゲットは、それぞれのソースセットで `actual` キーワードを使用して実際の値を提供する必要があります。

`expect` 宣言は、`actual` 実装と[マッチングされます](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)。
このメカニズムは、プラットフォーム固有の動作を必要とするクロスプラットフォームコードを作成する際に役立ちます。

このケースでは、マルチプラットフォームライブラリテンプレートには `firstElement` と `secondElement` プロパティのプラットフォーム固有の実装が含まれています。`androidMain`、`iosMain`、`jvmMain`、`linuxX64Main` ディレクトリには、これらのプロパティに値を提供する `actual` 宣言が含まれています。

例えば、`androidMain/kotlin/fibiprops.android.kt` に含まれるAndroidの実装は次のとおりです。

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

他のプラットフォームも同様のパターンに従い、`firstElement` および `secondElement` プロパティの値にバリエーションがあります。

## 新しいプラットフォームを追加する

テンプレートで共有コードとプラットフォーム固有コードがどのように機能するかを理解したところで、追加のプラットフォームのサポートを追加してプロジェクトを拡張しましょう。

[`expect`/`actual`メカニズム](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)を使用して、[Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html)プラットフォームのサポートを設定します。`firstElement`と`secondElement`プロパティのプラットフォーム固有の機能を実装できます。

### Kotlin/Wasmターゲットをプロジェクトに追加する

1.  `library/build.gradle.kts` ファイルに、Kotlin/Wasmターゲット (`wasmJs`) とソースセットを追加します。

    ```kotlin
    kotlin {
        // ...
        @OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
        wasmJs {
            browser()
            // ...
            binaries.executable()
        }
        // ...
        sourceSets {
            //...
            val wasmJsMain by getting {
                dependencies {
                    // Wasm-specific dependencies
                }
            }
        }
    }
    ```

2.  ビルドファイルに表示される**Sync Gradle Changes**アイコン (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"})をクリックしてGradleファイルを同期します。または、Gradleツールウィンドウのリフレッシュボタンをクリックします。

### Wasm用のプラットフォーム固有コードを作成する

Wasmターゲットを追加した後、`firstElement`と`secondElement`のプラットフォーム固有の実装を保持するためのWasmディレクトリが必要です。

1.  `library/src` ディレクトリを右クリックし、**New | Directory** を選択します。
2.  **Gradle Source Sets** リストから **wasmJsMain/kotlin** を選択します。

    ![Gradle source sets list](gradle-source-sets-list.png){width=450}

3.  新しく作成された `wasmJsMain/kotlin` ディレクトリを右クリックし、**New | Kotlin Class/File** を選択します。
4.  ファイル名として **fibiprops.wasm** を入力し、**File** を選択します。
5.  `fibiprops.wasm.kt` ファイルに以下のコードを追加します。

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    このコードはWasm固有の実装を設定し、`firstElement` の `actual` 値を `3` に、`secondElement` の `actual` 値を `5` に定義します。

### プロジェクトをビルドする

新しいプラットフォームでプロジェクトが正しくコンパイルされることを確認してください。

1.  **View** | **Tool Windows** | **Gradle** を選択してGradleツールウィンドウを開きます。
2.  **multiplatform-library-template** | **library** | **Tasks** | **build** の中で、**build** タスクを実行します。

    ![Gradle tool window](library-gradle-build-window-tasks.png){width=450}

    または、`multiplatform-library-template` のルートディレクトリからターミナルで以下のコマンドを実行します。

    ```bash
    ./gradlew build
    ```

**Build** ツールウィンドウで成功した出力を確認できます。

## ライブラリをローカルのMavenリポジトリに公開する

これで、マルチプラットフォームライブラリをローカルに公開し、同じマシン上の他のプロジェクトで使用する準備ができました。

ライブラリを公開するには、[`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradleプラグインを次のように使用します。

1.  `library/build.gradle.kts` ファイル内の `plugins { }` ブロックを見つけ、`maven-publish` プラグインを適用します。

    ```kotlin
       plugins {
           // ...
           // Add the following line:
           id("maven-publish")
       }
    ```

2.  `mavenPublishing { }` ブロックを見つけ、公開がローカルのみであることを示すために `signAllPublications()` メソッドをコメントアウトします。

    ```kotlin
    mavenPublishing{
        // ...
        // Comment out the following method:
        // signAllPublications()
    }
    ```

3.  ビルドファイルに表示される**Sync Gradle Changes**アイコン (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"})をクリックしてGradleファイルを同期します。または、Gradleツールウィンドウのリフレッシュボタンをクリックします。

4.  Gradleツールウィンドウで、**multiplatform-library-template** | **Tasks** | **publishing** に移動し、**publishToMavenLocal** Gradleタスクを実行します。

    ![Multiplatform library Gradle tool window](publish-maven-local-gradle-task.png){width=450}

    または、`multiplatform-library-template` のルートディレクトリからターミナルで以下のコマンドを実行します。

    ```bash
    ./gradlew publishToMavenLocal
    ```

ライブラリがローカルのMavenリポジトリに公開されました。

公開されたライブラリを見つけるには、ファイルエクスプローラーまたはターミナルを使用し、ユーザーのホームディレクトリにある `.m2\repository\io\github\kotlin\library\1.0.0\` へ移動します。

## ライブラリを別のプロジェクトの依存関係として追加する

MultiplatformライブラリをローカルのMavenリポジトリに公開した後、同じマシン上の他のKotlinプロジェクトでそれを使用できます。

コンシューマプロジェクトの `build.gradle.kts` ファイルで、公開されたライブラリへの依存関係を追加します。

```kotlin
repositories {
    // ...
    mavenLocal()
}

dependencies {
    // ...
    implementation("io.github.kotlin:library:1.0.0")
}
```

`repositories{}` ブロックは、GradleにローカルのMavenリポジトリからライブラリを解決し、共有コードで利用可能にするように指示します。

`implementation` 依存関係は、ライブラリの `build.gradle.kts` ファイルで指定されたグループとバージョンで構成されます。

別のマルチプラットフォームプロジェクトに追加する場合は、共有またはプラットフォーム固有のソースセットに追加できます。

```kotlin
kotlin {
    //...
    sourceSets {
        // For all platforms
        val commonMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
        // Or for specific platforms
        val wasmJsMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
    }
}
```

コンシューマプロジェクトを同期して、ライブラリの使用を開始しましょう！

## 次のステップ

マルチプラットフォーム開発をさらに探求することをお勧めします。

*   [ライブラリをMaven Centralに公開する](multiplatform-publish-libraries.md)
*   [ライブラリ作者向けガイドラインを確認する](https://kotlinlang.org/docs/api-guidelines-introduction.html)

コミュニティに参加する:

*   ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**: [リポジトリ](https://github.com/JetBrains/compose-multiplatform)にスターを付けて貢献する
*   ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取り、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加する
*   ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**: 「kotlin-multiplatform」[タグを購読する](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
*   ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube channel**: [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C)に関する動画を購読して視聴する