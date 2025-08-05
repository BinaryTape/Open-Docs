[//]: # (title: マルチプラットフォームアプリをテストする − チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に実行できます。どちらのIDEも同じコア機能とKotlin Multiplatformのサポートを共有しています。</p>
</tldr>

このチュートリアルでは、Kotlin Multiplatformアプリケーションでテストを作成、設定、および実行する方法を学習します。

マルチプラットフォームプロジェクトのテストは、次の2つのカテゴリに分けられます。

*   共通コードのテスト。これらのテストは、サポートされている任意のフレームワークを使用して、任意のプラットフォームで実行できます。
*   プラットフォーム固有のコードのテスト。これらはプラットフォーム固有のロジックをテストするために不可欠です。プラットフォーム固有のフレームワークを使用し、より豊富なAPIやより広範なアサーションなど、その追加機能の恩恵を受けることができます。

どちらのカテゴリもマルチプラットフォームプロジェクトでサポートされています。このチュートリアルではまず、シンプルなKotlin Multiplatformプロジェクトで共通コードの単体テストを設定、作成、および実行する方法を示します。次に、共通コードとプラットフォーム固有のコードの両方にテストを必要とする、より複雑な例に取り組みます。

> このチュートリアルは、以下の内容に精通していることを前提としています。
> *   Kotlin Multiplatformプロジェクトのレイアウト。そうでない場合は、開始する前に[このチュートリアル](multiplatform-create-first-app.md)を完了してください。
> *   [JUnit](https://junit.org/junit5/)などの一般的な単体テストフレームワークの基本。
>
{style="tip"}

## シンプルなマルチプラットフォームプロジェクトをテストする

### プロジェクトを作成する

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発の環境をセットアップする](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。
4.  **New Project**ウィンドウで、以下のフィールドを指定します。

    *   **Name**: KotlinProject
    *   **Group**: kmp.project.demo
    *   **Artifact**: kotlinproject
    *   **JDK**: Amazon Corretto version 17
        > このJDKバージョンは、後で追加するテストのいずれかを正常に実行するために必要です。
        >
        {style="note"}

5.  **Android**ターゲットを選択します。
    *   Macを使用している場合は、**iOS**も選択します。**Do not share UI**オプションが選択されていることを確認してください。
6.  **Include tests**の選択を解除し、**Create**をクリックします。

   ![Create simple multiplatform project](create-test-multiplatform-project.png){width=800}

### コードを記述する

`shared/src/commonMain/kotlin`ディレクトリ内に、新しい`common.example.search`ディレクトリを作成します。
このディレクトリ内に、以下の関数を含むKotlinファイル`Grep.kt`を作成します。

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

この関数は、[UNIXの`grep`コマンド](https://en.wikipedia.org/wiki/Grep)に似るように設計されています。ここでは、関数はテキストの行、正規表現として使用されるパターン、および行がパターンに一致するたびに呼び出される関数を受け取ります。

### テストを追加する

次に、共通コードをテストしましょう。重要な部分として、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIライブラリを依存関係として持つ共通テスト用のソースセットがあります。

1.  `shared/build.gradle.kts`ファイルで、`kotlin.test`ライブラリへの依存関係があることを確認します。

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2.  `commonTest`ソースセットにはすべての共通テストが保存されます。プロジェクトに同じ名前のディレクトリを作成する必要があります。

    1.  `shared/src`ディレクトリを右クリックし、**New | Directory**を選択します。IDEがオプションのリストを表示します。
    2.  選択肢を絞り込むために`commonTest/kotlin`パスを入力し始め、リストから選択します。

      ![Creating common test directory](create-common-test-dir.png){width=350}

3.  `commonTest/kotlin`ディレクトリ内に、新しい`common.example.search`パッケージを作成します。
4.  このパッケージ内に、`Grep.kt`ファイルを作成し、以下の単体テストで更新します。

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

ご覧のとおり、インポートされたアノテーションとアサーションは、プラットフォームにもフレームワークにも固有ではありません。
後でこのテストを実行すると、プラットフォーム固有のフレームワークがテストランナーを提供します。

#### `kotlin.test` APIを探索する {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリは、テストで使用するためのプラットフォーム非依存のアノテーションとアサーションを提供します。`Test`などのアノテーションは、選択されたフレームワークによって提供されるもの、またはそれらに最も近いものにマッピングされます。

アサーションは、[`Asserter`インターフェース](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)の実装を通じて実行されます。このインターフェースは、テストで一般的に実行されるさまざまなチェックを定義します。APIにはデフォルトの実装がありますが、通常はフレームワーク固有の実装を使用します。

たとえば、JUnit 4、JUnit 5、TestNGフレームワークはすべてJVMでサポートされています。Androidでは、`assertEquals()`への呼び出しは、`asserter`オブジェクトが`JUnit4Asserter`のインスタンスである`asserter.assertEquals()`への呼び出しになる可能性があります。iOSでは、`Asserter`型のデフォルトの実装がKotlin/Nativeテストランナーと連携して使用されます。

### テストを実行する

テストは、以下の方法で実行できます。

*   ガターの**実行**アイコンを使用して、`shouldFindMatches()`テスト関数を実行する。
*   コンテキストメニューを使用して、テストファイルを実行する。
*   ガターの**実行**アイコンを使用して、`GrepTest`テストクラスを実行する。

便利なショートカット<shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut>もあります。
どのオプションを選択しても、テストを実行するターゲットのリストが表示されます。

![Run test task](run-test-tasks.png){width=300}

`android`オプションの場合、テストはJUnit 4を使用して実行されます。`iosSimulatorArm64`の場合、Kotlinコンパイラはテストアノテーションを検出し、Kotlin/Native自身のテストランナーによって実行される「テストバイナリ」を作成します。

以下は、テストの実行が成功した場合に生成される出力の例です。

![Test output](run-test-results.png){width=700}

## より複雑なプロジェクトを操作する

### 共通コードのテストを記述する

`grep()`関数を使用して、共通コードのテストはすでに作成しました。次に、`CurrentRuntime`クラスを使用した、より高度な共通コードテストを考えてみましょう。このクラスには、コードが実行されるプラットフォームの詳細が含まれています。たとえば、ローカルJVMで実行されるAndroid単体テストの場合、「OpenJDK」と「17.0」という値を持つことがあります。

`CurrentRuntime`のインスタンスは、プラットフォームの名前とバージョンを文字列として作成する必要があります。バージョンはオプションです。バージョンが存在する場合、利用可能であれば、文字列の先頭の数値のみが必要です。

1.  `commonMain/kotlin`ディレクトリ内に、新しい`org.kmp.testing`ディレクトリを作成します。
2.  このディレクトリ内に、`CurrentRuntime.kt`ファイルを作成し、以下の実装で更新します。

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

3.  `commonTest/kotlin`ディレクトリ内に、新しい`org.kmp.testing`パッケージを作成します。
4.  このパッケージ内に、`CurrentRuntimeTest.kt`ファイルを作成し、以下のプラットフォームおよびフレームワークに依存しないテストで更新します。

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

> ここでは、簡潔さとシンプルさのために、[expectedおよびactual宣言のメカニズム](multiplatform-connect-to-apis.md)が使用されています。より複雑なコードでは、インターフェースとファクトリ関数を使用する方が良いアプローチです。
>
{style="note"}

共通コードのテストを記述する経験を積んだので、AndroidとiOS用のプラットフォーム固有のテストを記述する方法を見ていきましょう。

`CurrentRuntime`のインスタンスを作成するには、共通の`CurrentRuntime.kt`ファイルで次のように関数を宣言します。

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

この関数は、サポートされているプラットフォームごとに個別の実装を持つ必要があります。そうしないと、ビルドが失敗します。
各プラットフォームでこの関数を実装するだけでなく、テストも提供する必要があります。AndroidとiOS用に作成しましょう。

#### Android用

1.  `androidMain/kotlin`ディレクトリ内に、新しい`org.kmp.testing`パッケージを作成します。
2.  このパッケージ内に、`AndroidRuntime.kt`ファイルを作成し、予想される`determineCurrentRuntime()`関数の実際の実装で更新します。

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3.  `shared/src`ディレクトリ内にテスト用のディレクトリを作成します。
 
   1.  `shared/src`ディレクトリを右クリックし、**New | Directory**を選択します。IDEがオプションのリストを表示します。
   2.  選択肢を絞り込むために`androidUnitTest/kotlin`パスを入力し始め、リストから選択します。

   ![Creating Android test directory](create-android-test-dir.png){width=350}

4.  `kotlin`ディレクトリ内に、新しい`org.kmp.testing`パッケージを作成します。
5.  このパッケージ内に、`AndroidRuntimeTest.kt`ファイルを作成し、以下のAndroidテストで更新します。

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
   
   > チュートリアルの開始時に別のJDKバージョンを選択した場合、テストを正常に実行するために`name`と`version`を変更する必要があるかもしれません。
   > 
   {style="note"}

Android固有のテストがローカルJVMで実行されるのは奇妙に思えるかもしれません。これは、これらのテストが現在のマシンでローカル単体テストとして実行されるためです。[Android Studioのドキュメント](https://developer.android.com/studio/test/test-in-android-studio)に記載されているように、これらのテストは、デバイスまたはエミュレーターで実行される計測テストとは異なります。

プロジェクトに他の種類のテストを追加することもできます。計測テストについては、この[Touchlabガイド](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)を参照してください。

#### iOS用

1.  `iosMain/kotlin`ディレクトリ内に、新しい`org.kmp.testing`ディレクトリを作成します。
2.  このディレクトリ内に、`IOSRuntime.kt`ファイルを作成し、予想される`determineCurrentRuntime()`関数の実際の実装で更新します。

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3.  `shared/src`ディレクトリ内に新しいディレクトリを作成します。
   
   1.  `shared/src`ディレクトリを右クリックし、**New | Directory**を選択します。IDEがオプションのリストを表示します。
   2.  選択肢を絞り込むために`iosTest/kotlin`パスを入力し始め、リストから選択します。

   ![Creating iOS test directory](create-ios-test-dir.png){width=350}

4.  `iosTest/kotlin`ディレクトリ内に、新しい`org.kmp.testing`ディレクトリを作成します。
5.  このディレクトリ内に、`IOSRuntimeTest.kt`ファイルを作成し、以下のiOSテストで更新します。

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

この段階で、共通コード、Android、およびiOSの実装、およびそれらのテストのコードが完成しました。
プロジェクトのディレクトリ構造は次のようになっているはずです。

![Whole project structure](code-and-test-structure.png){width=300}

個々のテストはコンテキストメニューから実行することも、ショートカットを使用することもできます。もう1つのオプションはGradleタスクを使用することです。たとえば、`allTests` Gradleタスクを実行すると、プロジェクト内のすべてのテストが対応するテストランナーで実行されます。

![Gradle test tasks](gradle-alltests.png){width=700}

テストを実行すると、IDEの出力に加えて、HTMLレポートが生成されます。これらは`shared/build/reports/tests`ディレクトリにあります。

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

`allTests`タスクを実行し、生成されたレポートを確認します。

*   `allTests/index.html`ファイルには、共通テストとiOSテストの結合されたレポートが含まれています（iOSテストは共通テストに依存しており、共通テストの後に実行されます）。
*   `testDebugUnitTest`と`testReleaseUnitTest`フォルダには、両方のデフォルトAndroidビルドフレーバーのレポートが含まれています。（現在、Androidテストレポートは`allTests`レポートに自動的にマージされません。）

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

## マルチプラットフォームプロジェクトでテストを使用するためのルール

これで、Kotlin Multiplatformアプリケーションでテストを作成、設定、および実行できるようになりました。
今後のプロジェクトでテストを扱う際には、次の点を覚えておいてください。

*   共通コードのテストを記述する際には、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)のようなマルチプラットフォームライブラリのみを使用してください。`commonTest`ソースセットに依存関係を追加します。
*   `kotlin.test` APIの`Asserter`型は間接的にのみ使用されるべきです。`Asserter`インスタンスは可視ですが、テストで直接使用する必要はありません。
*   常にテストライブラリAPIの範囲内で作業してください。幸いなことに、コンパイラとIDEは、フレームワーク固有の機能の使用を防止します。
*   `commonTest`でテストを実行するためにどのフレームワークを使用しても問題ありませんが、開発環境が正しくセットアップされていることを確認するために、使用する各フレームワークでテストを実行することをお勧めします。
*   物理的な違いを考慮してください。たとえば、スクロールの慣性や摩擦の値はプラットフォームやデバイスによって異なるため、同じスクロール速度を設定しても、スクロール位置が異なる場合があります。期待される動作を保証するために、常にターゲットプラットフォームでコンポーネントをテストしてください。
*   プラットフォーム固有のコードのテストを記述する際には、対応するフレームワークの機能（たとえば、アノテーションや拡張機能）を使用できます。
*   テストは、IDEからでもGradleタスクを使用しても実行できます。
*   テストを実行すると、HTMLテストレポートが自動的に生成されます。

## 次は何ですか？

*   [マルチプラットフォームプロジェクトの構造を理解する](multiplatform-discover-project.md)で、マルチプラットフォームプロジェクトのレイアウトを探ります。
*   Kotlinエコシステムが提供するもう1つのマルチプラットフォームテストフレームワークである[Kotest](https://kotest.io/)をチェックしてください。Kotestは、さまざまなスタイルでテストを記述でき、通常のテストへの補完的なアプローチをサポートしています。これには、[データ駆動型](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)テストと[プロパティベース](https://kotest.io/docs/proptest/property-based-testing.html)テストが含まれます。