[//]: # (title: マルチプラットフォームアプリのテスト − チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルでは IntelliJ IDEA を使用していますが、Android Studio でも進めることができます。どちらの IDE も、同じコア機能と Kotlin Multiplatform サポートを共有しています。</p>
</tldr>

このチュートリアルでは、Kotlin Multiplatform アプリケーションでテストを作成、構成、および実行する方法を学びます。

マルチプラットフォームプロジェクトのテストは、次の 2 つのカテゴリに分けられます。

* **共通コード（common code）のテスト**: これらのテストは、サポートされている任意のフレームワークを使用して、任意のプラットフォームで実行できます。
* **プラットフォーム固有コード（platform-specific code）のテスト**: これらは、プラットフォーム固有のロジックをテストするために不可欠です。プラットフォーム固有のフレームワークを使用し、より豊富な API や幅広いアサーションなどの追加機能を利用できます。

マルチプラットフォームプロジェクトでは、両方のカテゴリがサポートされています。このチュートリアルでは、まず、シンプルな Kotlin Multiplatform プロジェクトにおいて、共通コードのユニットテストをセットアップ、作成、および実行する方法を説明します。その後、共通コードとプラットフォーム固有コードの両方のテストを必要とする、より複雑な例を扱います。

> このチュートリアルは、以下の知識があることを前提としています。
> * Kotlin Multiplatform プロジェクトのレイアウト。そうでない場合は、開始前に[このチュートリアル](multiplatform-create-first-app.md)を完了してください。
> * [JUnit](https://junit.org/junit5/) などの一般的なユニットテストフレームワークの基本。
>
{style="tip"}

## シンプルなマルチプラットフォームプロジェクトのテスト

### プロジェクトの作成

1. [クイックスタート](quickstart.md)の指示に従って、[Kotlin Multiplatform 開発のための環境をセットアップ](quickstart.md#set-up-the-environment)してください。
2. IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
3. 左側のパネルで **Kotlin Multiplatform** を選択します。
4. **New Project** ウィンドウで以下の項目を指定します。

    * **Name**: KMP testing
    * **Project ID**: kmp.project.testing

5. **Android** ターゲットを選択します。
   Mac を使用している場合は、**iOS** も選択してください。**Do not share UI** オプションが選択されていることを確認してください。
6. **Include tests** の選択を解除し、**Create** をクリックします。

   ![シンプルなマルチプラットフォームプロジェクトの作成](create-test-multiplatform-project.png){width=800}

### コードの記述

`sharedLogic/src/commonMain/kotlin` ディレクトリに、新しい `common.example.search` パッケージを作成します。
このパッケージに、以下の関数を含む Kotlin ファイル `Grep.kt` を作成します。

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

この関数は、[UNIX の `grep` コマンド](https://en.wikipedia.org/wiki/Grep)に似せて設計されています。ここでは、この関数はテキストの各行、正規表現として使用されるパターン、および行がパターンに一致するたびに呼び出される関数を引数に取ります。

### テストの追加

次に、共通コードをテストしましょう。不可欠な部分は、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API ライブラリを依存関係として持つ、共通テスト用のソースセットです。

1. `sharedLogic/build.gradle.kts` ファイルで、`kotlin.test` ライブラリへの依存関係があることを確認します。

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2. `commonTest` ソースセットには、すべての共通テストが格納されます。プロジェクトに同じ名前のディレクトリを作成する必要があります。

    1. `sharedLogic/src` ディレクトリを右クリックし、**New | Directory** を選択します。IDE にオプションのリストが表示されます。
    2. `commonTest/kotlin` パスを入力して選択範囲を絞り込み、リストから選択します。

      ![共通テストディレクトリの作成](create-common-test-dir.png){width=350}

3. `commonTest/kotlin` ディレクトリに、新しい `common.example.search` パッケージを作成します。
4. このパッケージに `Grep.kt` ファイルを作成し、以下のユニットテストで更新します。

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

ご覧のとおり、インポートされたアノテーションやアサーションは、プラットフォームにもフレームワークにも依存していません。
後でこのテストを実行すると、プラットフォーム固有のフレームワークがテストランナーを提供します。

#### `kotlin.test` API を詳しく見る {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) ライブラリは、テストで使用するためのプラットフォームに依存しないアノテーションとアサーションを提供します。`Test` などのアノテーションは、選択したフレームワークによって提供されるアノテーション、またはそれに最も近い同等のアノテーションにマッピングされます。

アサーションは、[`Asserter` インターフェース](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)の実装を通じて実行されます。このインターフェースは、テストで一般的に実行されるさまざまなチェックを定義しています。API にはデフォルトの実装がありますが、通常はフレームワーク固有の実装を使用することになります。

たとえば、JVM では JUnit 4、JUnit 5、および TestNG フレームワークがすべてサポートされています。Android では、`assertEquals()` の呼び出しにより `asserter.assertEquals()` が呼び出され、この `asserter` オブジェクトは `JUnit4Asserter` のインスタンスになります。iOS では、`Asserter` 型のデフォルト実装が Kotlin/Native テストランナーと組み合わせて使用されます。

### テストの実行

テストは以下の方法で実行できます。

* ガターにある **Run** アイコンを使用して `shouldFindMatches()` テスト関数を実行する。
* コンテキストメニューを使用してテストファイルを実行する。
* ガターにある **Run** アイコンを使用して `GrepTest` テストクラスを実行する。

便利なショートカット <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut> もあります。
どのオプションを選択しても、テストを実行するターゲットのリストが表示されます。

![テストタスクの実行](run-test-tasks.png){width=300}

`android` オプションの場合、テストは JUnit 4 を使用して実行されます。`iosSimulatorArm64` の場合、Kotlin コンパイラがテストアノテーションを検出し、Kotlin/Native 独自のテストランナーによって実行される「テストバイナリ（test binary）」を作成します。

以下は、テスト実行が成功したときに出力される例です。

![テスト出力](run-test-results.png){width=700}

## より複雑なプロジェクトでの作業

### 共通コードのテストを記述する

すでに `grep()` 関数を使用して共通コードのテストを作成しました。今度は、`CurrentRuntime` クラスを使用した、より高度な共通コードテストを考えてみましょう。このクラスには、コードが実行されているプラットフォームの詳細が含まれています。たとえば、ローカル JVM で実行される Android ユニットテストの場合、値として "OpenJDK" と "17.0" を持つ可能性があります。

`CurrentRuntime` のインスタンスは、プラットフォームの名前とバージョンを文字列として渡して作成する必要があります（バージョンはオプション）。バージョンが存在する場合、可能であれば文字列の先頭にある数字のみが必要です。

1. `commonMain/kotlin` ディレクトリに、新しい `org.kmp.testing` パッケージを作成します。
2. このパッケージに `CurrentRuntime.kt` ファイルを作成し、以下の実装で更新します。

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

3. `commonTest/kotlin` ディレクトリに、新しい `org.kmp.testing` パッケージを作成します。
4. このパッケージに `CurrentRuntimeTest.kt` ファイルを作成し、以下のプラットフォームおよびフレームワークに依存しないテストで更新します。

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

このテストは、[IDE で利用可能](#run-tests)な任意の方法で実行できます。

### プラットフォーム固有のテストを追加する

> ここでは、簡潔さとシンプルさのために [expect および actual 宣言のメカニズム](multiplatform-connect-to-apis.md)を使用しています。より複雑なコードでは、インターフェースとファクトリ関数を使用するアプローチの方が適しています。
>
{style="note"}

共通コードのテストを記述した経験ができたので、次に Android と iOS のプラットフォーム固有のテストを記述してみましょう。

`CurrentRuntime` のインスタンスを作成するために、共通の `CurrentRuntime.kt` ファイルで次のように関数を宣言します。

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

この関数は、サポートされているプラットフォームごとに個別の実装を持つ必要があります。そうでない場合、ビルドは失敗します。各プラットフォームでこの関数を実装すると同時に、テストも提供する必要があります。Android と iOS 用に作成してみましょう。

#### Android の場合

1. `androidMain/kotlin` ディレクトリに、新しい `org.kmp.testing` パッケージを作成します。
2. このパッケージに `AndroidRuntime.kt` ファイルを作成し、期待される `determineCurrentRuntime()` 関数の実際の（actual）実装で更新します。

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3. `sharedLogic/src` ディレクトリの中に、テスト用のディレクトリを作成します。
 
   1. `sharedLogic/src` ディレクトリを右クリックし、**New | Directory** を選択します。IDE にオプションのリストが表示されます。
   2. `androidHostTest/kotlin` パスを入力して選択範囲を絞り込み、リストから選択します。

      ![Android テストディレクトリの作成](create-android-test-dir.png){width=350}

4. `androidHostTest/kotlin` ディレクトリに、新しい `org.kmp.testing` パッケージを作成します。
5. このパッケージに `AndroidRuntimeTest.kt` ファイルを作成し、以下の Android テストで更新します。テストをパスさせるために、ランタイムの実際の名前とバージョンを設定してください（ただし、テストが失敗する様子を確認するのも有用です）。

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "21.0")
        }
    }
    ```
   
Android 固有のテストがローカル JVM 上で実行されるのは、奇妙に思えるかもしれません。これは、これらのテストが現在のマシン上でローカルユニットテストとして実行されるためです。[Android Studio のドキュメント](https://developer.android.com/studio/test/test-in-android-studio)に記載されているように、これらのテストはデバイスやエミュレーターで実行されるインストゥルメンテーションテスト（instrumented tests）とは異なります。

プロジェクトには他のタイプのテストを追加することもできます。インストゥルメンテーションテストについては、この [Touchlab ガイド](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)を参照してください。

#### iOS の場合

1. `iosMain/kotlin` ディレクトリに、新しい `org.kmp.testing` ディレクトリを作成します。
2. このディレクトリに `IOSRuntime.kt` ファイルを作成し、期待される `determineCurrentRuntime()` 関数の実際の（actual）実装で更新します。

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3. `sharedLogic/src` ディレクトリに新しいディレクトリを作成します。
   
   1. `sharedLogic/src` ディレクトリを右クリックし、**New | Directory** を選択します。IDE にオプションのリストが表示されます。
   2. `iosTest/kotlin` パスを入力して選択範囲を絞り込み、リストから選択します。

4. `iosTest/kotlin` ディレクトリに、新しい `org.kmp.testing` ディレクトリを作成します。
5. このディレクトリに `IOSRuntimeTest.kt` ファイルを作成し、以下の iOS テストで更新します。

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

### 複数のテストを実行してレポートを分析する

現段階で、共通、Android、および iOS 実装のコードとそのテストが揃いました。プロジェクトのディレクトリ構造は以下のようになっているはずです。

![プロジェクト構造全体](code-and-test-structure.png){width=300}

個々のテストはコンテキストメニューやショートカットから実行できます。もう 1 つのオプションは、Gradle タスクを使用することです。たとえば、`allTests` Gradle タスクを実行すると、プロジェクト内のすべてのテストが対応するテストランナーで実行されます。

![Gradle テストタスク](gradle-alltests.png){width=700}

テストを実行すると、IDE での出力に加えて HTML レポートが生成されます。レポートは `sharedLogic/build/reports/tests` ディレクトリにあります。

![マルチプラットフォームテストの HTML レポート](shared-tests-folder-reports.png){width=300}

`allTests` タスクを実行し、生成されたレポートを確認してください。

* `allTests/index.html` ファイルには、共通テストと iOS テストの統合レポートが含まれています（iOS テストは共通テストに依存しており、共通テストの後に実行されます）。
* `testDebugUnitTest` および `testReleaseUnitTest` フォルダには、デフォルトの Android ビルドフレーバー両方のレポートが含まれています。（現在、Android のテストレポートは `allTests` レポートと自動的にマージされません。）

![マルチプラットフォームテストの HTML レポート](multiplatform-test-report.png){width=700}

## マルチプラットフォームプロジェクトでテストを使用するためのルール

これで、Kotlin Multiplatform アプリケーションでテストを作成、構成、および実行することができました。今後のプロジェクトでテストを扱う際は、以下の点に注意してください。

* 共通コードのテストを記述する際は、[kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) などのマルチプラットフォームライブラリのみを使用してください。依存関係は `commonTest` ソースセットに追加します。
* `kotlin.test` API の `Asserter` 型は、間接的にのみ使用されるべきです。`Asserter` インスタンスは可視ですが、テスト内で直接使用する必要はありません。
* 常にテスティングライブラリの API の範囲内にとどまってください。幸い、コンパイラと IDE によってフレームワーク固有の機能の使用は防止されます。
* `commonTest` のテストを実行するためにどのフレームワークを使用するかは重要ではありませんが、開発環境が正しくセットアップされていることを確認するために、使用予定の各フレームワークでテストを実行することをお勧めします。
* 物理的な違いを考慮してください。たとえば、スクロールの慣性や摩擦の値はプラットフォームやデバイスによって異なるため、同じスクロール速度を設定しても、スクロール位置が異なる場合があります。期待通りの動作を確認するために、常にターゲットプラットフォームでコンポーネントをテストしてください。
* プラットフォーム固有のコードのテストを記述する際は、アノテーションや拡張機能など、対応するフレームワークの機能を使用できます。
* テストは IDE からも Gradle タスクからも実行できます。
* テストを実行すると、HTML テストレポートが自動的に生成されます。

## 次のステップ

* [マルチプラットフォームプロジェクトの構造を理解する](multiplatform-discover-project.md)で、プロジェクトのレイアウトを確認してください。
* Kotlin エコシステムによって提供されている別のマルチプラットフォームテストフレームワークである [Kotest](https://kotest.io/) をチェックしてください。Kotest ではさまざまなスタイルでテストを記述でき、通常のテストを補完するアプローチをサポートしています。これには、[データ駆動型](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)や[プロパティベース](https://kotest.io/docs/proptest/property-based-testing.html)のテストが含まれます。