[//]: # (title: マルチプラットフォームアプリをテストする − チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に学習を進められます。両方のIDEは同じコア機能とKotlin Multiplatformサポートを共有しています。</p>
</tldr>

このチュートリアルでは、Kotlin Multiplatformアプリケーションでテストを作成、構成、実行する方法を学習します。

マルチプラットフォームプロジェクトのテストは、次の2つのカテゴリに分類できます。

*   共通コードのテスト。これらのテストは、サポートされている任意のフレームワークを使用して、任意のプラットフォームで実行できます。
*   プラットフォーム固有のコードのテスト。これらは、プラットフォーム固有のロジックをテストするために不可欠です。これらはプラットフォーム固有のフレームワークを使用し、より豊富なAPIや幅広いアサーションなど、その追加機能の恩恵を受けることができます。

どちらのカテゴリもマルチプラットフォームプロジェクトでサポートされています。このチュートリアルでは、まずシンプルなKotlin Multiplatformプロジェクトで共通コードの単体テストのセットアップ、作成、実行方法を示します。次に、共通コードとプラットフォーム固有コードの両方にテストが必要な、より複雑な例を扱います。

> このチュートリアルは、以下に精通していることを前提としています。
> *   Kotlin Multiplatformプロジェクトのレイアウト。そうでない場合は、開始する前に[このチュートリアル](multiplatform-create-first-app.md)を完了してください。
> *   [JUnit](https://junit.org/junit5/)などの一般的な単体テストフレームワークの基本。
>
{style="tip"}

## シンプルなマルチプラットフォームプロジェクトをテストする

### プロジェクトの作成

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発環境のセットアップ](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。
4.  **New Project**ウィンドウで以下のフィールドを指定します。

    *   **Name**: KotlinProject
    *   **Group**: kmp.project.demo
    *   **Artifact**: kotlinproject
    *   **JDK**: Amazon Corretto version 17
        > このJDKバージョンは、後で追加するテストの1つを正常に実行するために必要です。
        >
        {style="note"}

5.  **Android**ターゲットを選択します。
    *   Macを使用している場合は、**iOS**も選択します。**UIを共有しない**オプションが選択されていることを確認してください。
6.  **Include tests**の選択を解除し、**Create**をクリックします。

   ![シンプルなマルチプラットフォームプロジェクトの作成](create-test-multiplatform-project.png){width=800}

### コードの記述

`shared/src/commonMain/kotlin`ディレクトリに、新しい`common.example.search`ディレクトリを作成します。
このディレクトリに、次の関数を含むKotlinファイル`Grep.kt`を作成します。

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

この関数は、[UNIXの`grep`コマンド](https://en.wikipedia.org/wiki/Grep)に似せて設計されています。ここでは、テキストの行、正規表現として使用されるパターン、および行がパターンに一致するたびに呼び出される関数を受け取ります。

### テストの追加

次に、共通コードをテストしましょう。重要な部分となるのは、共通テスト用のソースセットです。これには[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIライブラリが依存関係として含まれています。

1.  `shared/build.gradle.kts`ファイルで、`kotlin.test`ライブラリへの依存関係があることを確認します。

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2.  `commonTest`ソースセットは、すべての共通テストを格納します。プロジェクト内に同じ名前のディレクトリを作成する必要があります。

    1.  `shared/src`ディレクトリを右クリックし、**New | Directory**を選択します。IDEにオプションのリストが表示されます。
    2.  `commonTest/kotlin`パスの入力を開始して選択肢を絞り込み、リストから選択します。

      ![共通テストディレクトリの作成](create-common-test-dir.png){width=350}

3.  `commonTest/kotlin`ディレクトリに、新しい`common.example.search`パッケージを作成します。
4.  このパッケージに、`Grep.kt`ファイルを作成し、次の単体テストで更新します。

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class GrepTest {
        companion object {
            val sampleData = listOf(
                "123 abc",
                "abc 123",
                "123 ABC",
                "ABC 123"
            )
        }
    
        @Test
        fun shouldFindMatches() {
            val results = mutableListOf<String>()
            grep(sampleData, "[a-z]+") {
                results.add(it)
            }
    
            assertEquals(2, results.size)
            for (result in results) {
                assertContains(result, "abc")
            }
        }
    }
    ```

ご覧のとおり、インポートされたアノテーションとアサーションは、プラットフォーム固有でもフレームワーク固有でもありません。このテストを後で実行すると、プラットフォーム固有のフレームワークがテストランナーを提供します。

#### `kotlin.test` APIを調べる {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリは、テストで使用できるプラットフォームに依存しないアノテーションとアサーションを提供します。`Test`などのアノテーションは、選択したフレームワークによって提供されるもの、またはそれらに最も近い同等のものにマッピングされます。

アサーションは、[`Asserter`インターフェース](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)の実装を通じて実行されます。このインターフェースは、テストで一般的に行われるさまざまなチェックを定義します。APIにはデフォルトの実装がありますが、通常はフレームワーク固有の実装を使用します。

たとえば、JUnit 4、JUnit 5、TestNGフレームワークはすべてJVMでサポートされています。Androidでは、`assertEquals()`の呼び出しが、`asserter`オブジェクトが`JUnit4Asserter`のインスタンスである`asserter.assertEquals()`の呼び出しにつながる可能性があります。iOSでは、`Asserter`型のデフォルト実装がKotlin/Nativeテストランナーと組み合わせて使用されます。

### テストの実行

テストは次の方法で実行できます。

*   ガターの**Run**アイコンを使用して`shouldFindMatches()`テスト関数を実行する。
*   コンテキストメニューを使用してテストファイルを実行する。
*   ガターの**Run**アイコンを使用して`GrepTest`テストクラスを実行する。

便利な<shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut>ショートカットもあります。
どのオプションを選択しても、テストを実行するターゲットのリストが表示されます。

![テストタスクの実行](run-test-tasks.png){width=300}

`android`オプションの場合、テストはJUnit 4を使用して実行されます。`iosSimulatorArm64`の場合、Kotlinコンパイラはテストアノテーションを検出し、Kotlin/Native独自のテストランナーによって実行される_テストバイナリ_を作成します。

テストが正常に実行された場合の出力例を以下に示します。

![テスト出力](run-test-results.png){width=700}

## より複雑なプロジェクトを扱う

### 共通コードのテストを記述する

`grep()`関数を使用して、共通コードのテストをすでに作成しました。次に、`CurrentRuntime`クラスを使った、より高度な共通コードテストを考えてみましょう。このクラスには、コードが実行されるプラットフォームの詳細が含まれています。
たとえば、ローカルJVMで実行されるAndroid単体テストの場合、"OpenJDK"と"17.0"の値を持つことがあります。

`CurrentRuntime`のインスタンスは、プラットフォームの名前とバージョンを文字列として作成する必要があります。バージョンはオプションです。バージョンが存在する場合、文字列の先頭にある数字のみが必要です（利用可能な場合）。

1.  `commonMain/kotlin`ディレクトリに、新しい`org.kmp.testing`ディレクトリを作成します。
2.  このディレクトリに、`CurrentRuntime.kt`ファイルを作成し、次の実装で更新します。

    ```kotlin
    class CurrentRuntime(val name: String, rawVersion: String?) {
        companion object {
            val versionRegex = Regex("^[0-9]+(\\.[0-9]+)?")
        }
    
        val version = parseVersion(rawVersion)
    
        override fun toString() = "$name version $version"
    
        private fun parseVersion(rawVersion: String?): String {
            val result = rawVersion?.let { versionRegex.find(it) }
            return result?.value ?: "unknown"
        }
    }
    ```

3.  `commonTest/kotlin`ディレクトリに、新しい`org.kmp.testing`パッケージを作成します。
4.  このパッケージに、`CurrentRuntimeTest.kt`ファイルを作成し、以下のプラットフォームとフレームワークに依存しないテストで更新します。

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals

    class CurrentRuntimeTest {
        @Test
        fun shouldDisplayDetails() {
            val runtime = CurrentRuntime("MyRuntime", "1.1")
            assertEquals("MyRuntime version 1.1", runtime.toString())
        }
    
        @Test
        fun shouldHandleNullVersion() {
            val runtime = CurrentRuntime("MyRuntime", null)
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    
        @Test
        fun shouldParseNumberFromVersionString() {
            val runtime = CurrentRuntime("MyRuntime", "1.2 Alpha Experimental")
            assertEquals("MyRuntime version 1.2", runtime.toString())
        }
    
        @Test
        fun shouldHandleMissingVersion() {
            val runtime = CurrentRuntime("MyRuntime", "Alpha Experimental")
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    }
    ```

このテストは、[IDEで利用可能な](#run-tests)いずれかの方法で実行できます。

### プラットフォーム固有のテストを追加する

> ここでは、簡潔さとシンプルさのために[expectedおよびactual宣言のメカニズム](multiplatform-connect-to-apis.md)が使用されています。より複雑なコードでは、インターフェースとファクトリ関数を使用する方が良いアプローチです。
>
{style="note"}

共通コードのテストを作成する経験を積んだところで、AndroidとiOS用のプラットフォーム固有のテストを作成することを探ってみましょう。

`CurrentRuntime`のインスタンスを作成するには、共通の`CurrentRuntime.kt`ファイルで次のように関数を宣言します。

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

この関数は、サポートされている各プラットフォームに個別の実装を持つ必要があります。そうしないと、ビルドが失敗します。
各プラットフォームでこの関数を実装するだけでなく、テストも提供する必要があります。AndroidとiOS用に作成しましょう。

#### Androidの場合

1.  `androidMain/kotlin`ディレクトリに、新しい`org.kmp.testing`パッケージを作成します。
2.  このパッケージに、`AndroidRuntime.kt`ファイルを作成し、expected `determineCurrentRuntime()`関数の実際の（actual）実装で更新します。

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3.  `shared/src`ディレクトリ内にテスト用のディレクトリを作成します。
 
   1.  `shared/src`ディレクトリを右クリックし、**New | Directory**を選択します。IDEにオプションのリストが表示されます。
   2.  `androidUnitTest/kotlin`パスの入力を開始して選択肢を絞り込み、リストから選択します。

   ![Androidテストディレクトリの作成](create-android-test-dir.png){width=350}

4.  `kotlin`ディレクトリに、新しい`org.kmp.testing`パッケージを作成します。
5.  このパッケージに、`AndroidRuntimeTest.kt`ファイルを作成し、次のAndroidテストで更新します。

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "17.0")
        }
    }
    ```
   
   > チュートリアルの最初に異なるJDKバージョンを選択した場合、テストを正常に実行するために`name`と`version`を変更する必要があるかもしれません。
   > 
   {style="note"}

Android固有のテストがローカルJVMで実行されるのは奇妙に思えるかもしれません。これは、これらのテストが現在のマシンでローカル単体テストとして実行されるためです。[Android Studioのドキュメント](https://developer.android.com/studio/test/test-in-android-studio)に記載されているように、これらのテストはデバイスやエミュレーターで実行されるインスツルメンテッドテストとは異なります。

プロジェクトに他の種類のテストを追加できます。インスツルメンテッドテストについて学ぶには、[Touchlabのこのガイド](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)を参照してください。

#### iOSの場合

1.  `iosMain/kotlin`ディレクトリに、新しい`org.kmp.testing`ディレクトリを作成します。
2.  このディレクトリに、`IOSRuntime.kt`ファイルを作成し、expected `determineCurrentRuntime()`関数の実際の（actual）実装で更新します。

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3.  `shared/src`ディレクトリに新しいディレクトリを作成します。
   
   1.  `shared/src`ディレクトリを右クリックし、**New | Directory**を選択します。IDEにオプションのリストが表示されます。
   2.  `iosTest/kotlin`パスの入力を開始して選択肢を絞り込み、リストから選択します。

   ![iOSテストディレクトリの作成](create-ios-test-dir.png){width=350}

4.  `iosTest/kotlin`ディレクトリに、新しい`org.kmp.testing`ディレクトリを作成します。
5.  このディレクトリに、`IOSRuntimeTest.kt`ファイルを作成し、次のiOSテストで更新します。

    ```kotlin 
    import kotlin.test.Test
    import kotlin.test.assertEquals
    
    class IOSRuntimeTest {
        @Test
        fun shouldDetectOS() {
            val runtime = determineCurrentRuntime()
            assertEquals(runtime.name, "ios")
            assertEquals(runtime.version, "unknown")
        }
    }
    ```

### 複数のテストを実行し、レポートを分析する

この段階で、共通、Android、iOSの実装コードと、それらのテストが用意できました。
プロジェクトのディレクトリ構造は次のようになります。

![プロジェクト全体の構造](code-and-test-structure.png){width=300}

個々のテストはコンテキストメニューから実行することも、ショートカットを使用することもできます。もう1つのオプションは、Gradleタスクを使用することです。たとえば、`allTests` Gradleタスクを実行すると、プロジェクト内のすべてのテストが対応するテストランナーで実行されます。

![Gradleテストタスク](gradle-alltests.png){width=700}

テストを実行すると、IDEの出力に加えて、HTMLレポートが生成されます。これらは`shared/build/reports/tests`ディレクトリにあります。

![マルチプラットフォームテストのHTMLレポート](shared-tests-folder-reports.png){width=300}

`allTests`タスクを実行し、生成されたレポートを調べます。

*   `allTests/index.html`ファイルには、共通テストとiOSテストの結合レポートが含まれています（iOSテストは共通テストに依存しており、それらの後に実行されます）。
*   `testDebugUnitTest`と`testReleaseUnitTest`フォルダには、両方のデフォルトAndroidビルドフレーバーのレポートが含まれています。（現在、Androidテストレポートは`allTests`レポートと自動的にマージされません。）

![マルチプラットフォームテストのHTMLレポート](multiplatform-test-report.png){width=700}

## マルチプラットフォームプロジェクトでテストを使用するためのルール

これで、Kotlin Multiplatformアプリケーションでテストを作成、構成、実行できるようになりました。
今後のプロジェクトでテストを扱う際には、次の点を覚えておいてください。

*   共通コードのテストを記述する際は、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)のようなマルチプラットフォームライブラリのみを使用してください。`commonTest`ソースセットに依存関係を追加します。
*   `kotlin.test` APIの`Asserter`型は、間接的にのみ使用する必要があります。`Asserter`インスタンスは表示されますが、テストでそれを使用する必要はありません。
*   常にテストライブラリのAPI内で作業してください。幸いなことに、コンパイラとIDEは、フレームワーク固有の機能の使用を防ぎます。
*   `commonTest`でテストを実行するためにどのフレームワークを使用してもかまいませんが、開発環境が正しくセットアップされていることを確認するために、使用する予定の各フレームワークでテストを実行することをお勧めします。
*   物理的な違いを考慮してください。たとえば、スクロールの慣性や摩擦の値はプラットフォームやデバイスによって異なるため、同じスクロール速度を設定しても、異なるスクロール位置になる可能性があります。予期される動作を保証するために、常にターゲットプラットフォームでコンポーネントをテストしてください。
*   プラットフォーム固有のコードのテストを記述する際は、対応するフレームワークの機能（例: アノテーションや拡張機能）を使用できます。
*   テストはIDEからでもGradleタスクを使用しても実行できます。
*   テストを実行すると、HTMLテストレポートが自動的に生成されます。

## 次のステップ

*   [マルチプラットフォームプロジェクトの構造を理解する](multiplatform-discover-project.md)で、マルチプラットフォームプロジェクトのレイアウトを調べてください。
*   Kotlinエコシステムが提供する別のマルチプラットフォームテストフレームワーク、[Kotest](https://kotest.io/)をチェックしてください。Kotestはさまざまなスタイルのテスト記述を可能にし、通常のテストを補完するアプローチをサポートしています。これには、[データ駆動型](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)および[プロパティベース](https://kotest.io/docs/proptest/property-based-testing.html)のテストが含まれます。