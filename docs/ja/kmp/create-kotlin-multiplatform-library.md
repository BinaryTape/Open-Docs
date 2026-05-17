[//]: # (title: Kotlinマルチプラットフォームライブラリの作成 – チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも進めることができます。両方のIDEは共通のコア機能とKotlinマルチプラットフォームのサポートを共有しています。</p>
</tldr>

このチュートリアルでは、IntelliJ IDEAでマルチプラットフォームライブラリを作成し、そのライブラリをローカルのMavenリポジトリに公開して、別のプロジェクトで依存関係として追加する方法を学びます。

このチュートリアルは、フィボナッチ数列を生成する関数を含むシンプルなライブラリである [multiplatform library template](https://github.com/Kotlin/multiplatform-library-template) に基づいています。

## 環境のセットアップ 

[必要なツールをすべてインストールし、最新バージョンにアップデートしてください](quickstart.md)。

## プロジェクトの作成

1. IntelliJ IDEAで、**File** | **New** | **Project from Version Control** を選択します。
2. [multiplatform library template project](https://github.com/Kotlin/multiplatform-library-template) のURLを入力します：

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```
   
3. **Clone** をクリックします。

## プロジェクト構造の確認

Kotlin Multiplatform library templateプロジェクトは、Kotlinマルチプラットフォームライブラリを開発するための基礎となる構造を提供します。このテンプレートは、さまざまなプラットフォームで動作可能なライブラリの作成を支援します。

テンプレートプロジェクトにおいて、`library`はコアモジュールとして機能し、マルチプラットフォームライブラリのメインソースコードとビルドリソースが含まれています。

![Multiplatform library project structure](multiplatform-library-template-project.png){width=350}

`library`モジュールは、共有コードとプラットフォーム固有の実装を収容できるように構成されています。以下は、ソースコードの内訳です。

* **`commonMain`:** すべてのターゲットプラットフォームで共有されるKotlinコードが含まれます。プラットフォーム固有のAPIに依存しないコードはここに配置します。
* **`androidMain`, `iosMain`, `jvmMain`, `linuxX64Main`:** Android、iOS、JVM、Linuxプラットフォーム固有のコードが含まれます。これらのプラットフォームに固有の機能をここに実装します。
* **`commonTest`, `androidUnitTest`, `iosTest`, `jvmTest`, `linuxX64Test`:** それぞれ、共有コードである`commonMain`のテスト、およびAndroid、iOS、JVM、Linuxの各プラットフォーム固有のテストが含まれます。

すべてのプラットフォームで共有される`library`コードに注目してみましょう。`src/commonMain/kotlin`ディレクトリの中に、フィボナッチ数列ジェネレーターを定義するKotlinマルチプラットフォームコードを含む`CustomFibi.kt`ファイルがあります。

```kotlin
package io.github.kotlin.fibonacci

// フィボナッチ数列を生成する関数を定義
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

// `firstElement` と `secondElement` の期待される値を宣言
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement`と`secondElement`プロパティは、プラットフォーム固有のコードで実装されるプレースホルダーです。各ターゲットは、それぞれのソースセットで`actual`キーワードを使用して実際の値を提供する必要があります。

`expect`宣言は、`actual`実装と[対応（マッチ）](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)します。このメカニズムは、プラットフォーム固有の動作を必要とするクロスプラットフォームコードを記述する際に便利です。

このケースでは、マルチプラットフォームライブラリテンプレートには`firstElement`と`secondElement`プロパティのプラットフォーム固有の実装が含まれています。`androidMain`、`iosMain`、`jvmMain`、`linuxX64Main`ディレクトリには、これらのプロパティに値を提供する`actual`宣言が含まれています。

例えば、`androidMain/kotlin/fibiprops.android.kt`に含まれるAndroidの実装は以下の通りです。

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

他のプラットフォームも同じパターンに従い、`firstElement`と`secondElement`プロパティの値がそれぞれ異なります。

## 新しいプラットフォームの追加

テンプレートでの共有コードとプラットフォーム固有コードの仕組みを理解したところで、追加のプラットフォームのサポートを追加してプロジェクトを拡張してみましょう。

[`expect`/`actual`メカニズム](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)を使用して、[Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html)プラットフォームのサポートを構成し、`firstElement`と`secondElement`プロパティに対してプラットフォーム固有の機能を実装します。

### プロジェクトにKotlin/Wasmターゲットを追加する

1. `library/build.gradle.kts`ファイルに、Kotlin/Wasmターゲット（`wasmJs`）とソースセットを追加します。

    ```kotlin
    kotlin {
        // ...
        @OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
        wasmJs {
            browser()
            binaries.executable()
        }
        // ...
        sourceSets {
            //...
            wasmJsMain.dependencies {
                // Wasm固有の依存関係
            }
        }
    }
    ```

2. ビルドファイルに表示される**Sync Gradle Changes**アイコン（![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}）をクリックして、Gradleファイルを同期します。あるいは、Gradleツールウィンドウのリフレッシュボタンをクリックします。

### Wasm用のプラットフォーム固有コードを作成する

Wasmターゲットを追加した後は、`firstElement`と`secondElement`のプラットフォーム固有の実装を保持するためのWasmディレクトリが必要です。

1. `library/src`ディレクトリを右クリックし、**New | Directory**を選択します。
2. **Gradle Source Sets**リストから**wasmJsMain/kotlin**を選択します。

   ![Gradle source sets list](gradle-source-sets-list.png){width=450}

3. 新しく作成された`wasmJsMain/kotlin`ディレクトリを右クリックし、**New | Kotlin Class/File**を選択します。
4. ファイル名として**fibiprops.wasm**を入力し、**File**を選択します。
5. `fibiprops.wasm.kt`ファイルに以下のコードを追加します。

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    このコードは、Wasm固有の実装を設定し、`firstElement`を`3`、`secondElement`を`5`として`actual`値を定義します。

### プロジェクトのビルド

新しいプラットフォームでプロジェクトが正しくコンパイルされることを確認します。

1. **View** | **Tool Windows** | **Gradle** を選択して、Gradleツールウィンドウを開きます。
2. **multiplatform-library-template** | **library** | **Tasks** | **build** の中で、**build**タスクを実行します。

   ![Gradle tool window](library-gradle-build-window-tasks.png){width=450}

   あるいは、`multiplatform-library-template`のルートディレクトリからターミナルで次のコマンドを実行します。

   ```bash
   ./gradlew build
   ```

**Build**ツールウィンドウで成功の出力を確認できます。

## ローカルMavenリポジトリへのライブラリの公開

マルチプラットフォームライブラリをローカルに公開する準備が整いました。これにより、同じマシン上の他のプロジェクトでそのライブラリを使用できるようになります。

ライブラリを公開するには、次のように[`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradleプラグインを使用します。

1. `library/build.gradle.kts`ファイルで、`plugins { }`ブロックを見つけ、`maven-publish`プラグインを適用します。

   ```kotlin
      plugins {
          // ...
          // 次の行を追加します:
          id("maven-publish")
      }
   ```

2. `mavenPublishing { }`ブロックを見つけ、公開がローカルのみであることを示すために`signAllPublications()`の呼び出しをコメントアウトします。

    ```kotlin
    mavenPublishing {
        // ...
        // 次の呼び出しをコメントアウトします:
        // signAllPublications()
    }
    ```

3. ビルドファイルに表示される**Sync Gradle Changes**アイコン（![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}）をクリックして、Gradleファイルを同期します。あるいは、Gradleツールウィンドウのリフレッシュボタンをクリックします。

4. Gradleツールウィンドウで、**multiplatform-library-template** | **Tasks** | **publishing** に移動し、**publishToMavenLocal** Gradleタスクを実行します。

   ![Multiplatform library Gradle tool window](publish-maven-local-gradle-task.png){width=450}

   あるいは、`multiplatform-library-template`のルートディレクトリからターミナルで次のコマンドを実行します。

   ```bash
   ./gradlew publishToMavenLocal
   ```

ライブラリがローカルのMavenリポジトリに公開されました。

公開されたアーティファクトを確認するには、ファイルエクスプローラーまたはターミナルを使用して、`~\.m2\repository\io\github\kotlin\library\1.0.0\` ディレクトリに移動します。

## 別のプロジェクトに依存関係としてライブラリを追加する

マルチプラットフォームライブラリをローカルのMavenリポジトリに公開した後、同じマシン上の他のKotlinプロジェクトで使用できます。

コンシューマープロジェクト（利用側プロジェクト）の`settings.gradle.kts`ファイルに、ローカルリポジトリでパッケージを探すためのオプションを追加します。

```kotlin
dependencyResolutionManagement {
    repositories {
        // ...
        mavenLocal()
    }
}
```

モジュールの`build.gradle.kts`ファイルで、公開されたライブラリへの依存関係を追加します。別のマルチプラットフォームプロジェクトに追加する場合は、共有またはプラットフォーム固有のソースセットに追加できます。

```kotlin
kotlin {
    //...
    sourceSets {
        // すべてのプラットフォーム用
        commonMain.dependencies {
                implementation("io.github.kotlin:library:1.0.0")
        }
        // または特定のプラットフォーム用
        wasmJsMain.dependencies {
            implementation("io.github.kotlin:library:1.0.0")
        }
    }
}
```

`implementation()`の呼び出しには、ライブラリの`build.gradle.kts`ファイルで指定されたグループ、名前、バージョンを指定します。

コンシューマープロジェクトを同期して、ライブラリの使用を開始しましょう。例えば以下のようになります：

```kotlin
import io.github.kotlin.fibonacci.generateFibi

val seq = generateFibi()
println(seq.elementAt(3))
```

## 次のステップ

マルチプラットフォーム開発をさらに深く探究することをお勧めします：

* [Maven Centralへのライブラリの公開](multiplatform-publish-libraries-to-maven.md)
* [ライブラリ作成者のためのガイドラインを確認する](https://kotlinlang.org/docs/api-guidelines-introduction.html)

コミュニティに参加する：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**: [リポジトリ](https://github.com/JetBrains/compose-multiplatform)をスターして貢献する
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受けて、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加する
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**: ["kotlin-multiplatform" タグ](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)を購読する
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube チャンネル**: 購読して [Kotlinマルチプラットフォーム](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C)に関するビデオを視聴する