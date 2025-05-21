---
title: "Kotlin/JS でテストを実行する"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle プラグインを使用すると、Gradle 構成で指定できるさまざまなテストランナーを通じてテストを実行できます。

マルチプラットフォームプロジェクトを作成する際、`commonTest` で単一の依存関係を使用することにより、JavaScript
ターゲットを含む、すべてのソースセットにテスト依存関係を追加できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // This makes test annotations and functionality available in JS
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This makes test annotations and functionality available in JS
            }
        }
    }
}
```

</TabItem>
</Tabs>

Gradle ビルドスクリプトの `testTask` ブロックで使用可能な設定を調整することで、Kotlin/JS でのテストの実行方法を調整できます。たとえば、Karma テストランナーを Chrome のヘッドレスインスタンスおよび Firefox のインスタンスとともに使用すると、次のようになります。

```kotlin
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                    useFirefox()
                }
            }
        }
    }
}
```

利用可能な機能の詳細については、[テストタスクの設定](js-project-setup#test-task)に関する Kotlin/JS リファレンスを確認してください。

デフォルトでは、ブラウザはプラグインにバンドルされていないことに注意してください。これは、ターゲットシステムでブラウザが利用可能であることを確認する必要があることを意味します。

テストが適切に実行されることを確認するには、`src/jsTest/kotlin/AppTest.kt` ファイルを追加し、次のコンテンツを入力します。

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class AppTest {
    @Test
    fun thingsShouldWork() {
        assertEquals(listOf(1,2,3).reversed(), listOf(3,2,1))
    }

    @Test
    fun thingsShouldBreak() {
        assertEquals(listOf(1,2,3).reversed(), listOf(1,2,3))
    }
}
```

ブラウザでテストを実行するには、IntelliJ IDEA 経由で `jsBrowserTest` タスクを実行するか、ガターアイコンを使用してすべてのテストまたは個々のテストを実行します。

<img src="/img/browsertest-task.png" alt="Gradle browserTest task" width="700" style={{verticalAlign: 'middle'}}/>

または、コマンドラインからテストを実行する場合は、Gradle ラッパーを使用します。

```bash
./gradlew jsBrowserTest
```

IntelliJ IDEA からテストを実行すると、**Run** ツールウィンドウにテスト結果が表示されます。失敗したテストをクリックすると、そのスタックトレースが表示され、ダブルクリックで対応するテスト実装に移動できます。

<img src="/img/test-stacktrace-ide.png" alt="Test results in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

テストの実行方法に関係なく、各テスト実行後、Gradle から適切にフォーマットされたテストレポートを `build/reports/tests/jsBrowserTest/index.html` で見つけることができます。このファイルをブラウザで開いて、テスト結果の別の概要を表示します。

<img src="/img/test-summary.png" alt="Gradle test summary" width="700" style={{verticalAlign: 'middle'}}/>

上記のsnippetに示されている例のテストセットを使用している場合、1つのテストが合格し、1つのテストが失敗し、その結果、合計で 50% のテストが成功します。個々のテストケースに関する詳細情報を取得するには、提供されているハイパーリンクを介して移動できます。

<img src="/img/failed-test.png" alt="Stacktrace of failed test in the Gradle summary" width="700" style={{verticalAlign: 'middle'}}/>