[//]: # (title: Kotlin/JS でテストを実行する)

Kotlin Multiplatform Gradleプラグインを使用すると、Gradleの設定を通じて指定できる様々なテストランナーを使ってテストを実行できます。

マルチプラットフォームプロジェクトを作成する際、`commonTest`に単一の依存関係を使用することで、JavaScriptターゲットを含むすべてのソースセットにテスト依存関係を追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // これにより、テストのアノテーションと機能がJSで利用可能になります
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // これにより、テストのアノテーションと機能がJSで利用可能になります
            }
        }
    }
}
```

</tab>
</tabs>

Kotlin/JS でのテストの実行方法は、Gradle ビルドスクリプトの`testTask`ブロックで利用可能な設定を調整することで変更できます。例えば、Karma テストランナーをヘッドレス版のChromeインスタンスとFirefoxインスタンスと共に使用すると、次のようになります。

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

利用可能な機能の詳細については、[テストタスクの構成](js-project-setup.md#test-task)に関するKotlin/JSリファレンスを参照してください。

デフォルトでは、プラグインにはブラウザがバンドルされていないことに注意してください。これは、ターゲットシステムでそれらが利用可能であることを確認する必要があることを意味します。

テストが正しく実行されることを確認するには、`src/jsTest/kotlin/AppTest.kt`ファイルを追加し、この内容で記述してください。

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

ブラウザでテストを実行するには、IntelliJ IDEA を介して`jsBrowserTest`タスクを実行するか、ガターアイコンを使用してすべてのテストまたは個別のテストを実行します。

![Gradle の browserTest タスク](browsertest-task.png){width=700}

あるいは、コマンドラインからテストを実行したい場合は、Gradle ラッパーを使用します。

```bash
./gradlew jsBrowserTest
```

IntelliJ IDEA からテストを実行すると、**Run** ツールウィンドウにテスト結果が表示されます。失敗したテストをクリックするとそのスタックトレースを確認でき、ダブルクリックで対応するテスト実装に移動できます。

![IntelliJ IDEA のテスト結果](test-stacktrace-ide.png){width=700}

どのようにテストを実行したかに関わらず、各テスト実行後、Gradle からの適切にフォーマットされたテストレポートが`build/reports/tests/jsBrowserTest/index.html`にあります。このファイルをブラウザで開くと、テスト結果の別の概要を確認できます。

![Gradle のテスト概要](test-summary.png){width=700}

上のスニペットに示されている例のテストセットを使用している場合、1つのテストが合格し、1つのテストが失敗するため、結果として合計50%のテストが成功した状態になります。個々のテストケースに関する詳細情報を取得するには、提供されたハイパーリンクを介して移動できます。

![Gradle の概要における失敗したテストのスタックトレース](failed-test.png){width=700}