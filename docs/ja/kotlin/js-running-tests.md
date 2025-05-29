[//]: # (title: Kotlin/JSでテストを実行する)

Kotlin Multiplatform Gradleプラグインを使用すると、Gradle設定を介して指定できるさまざまなテストランナーでテストを実行できます。

マルチプラットフォームプロジェクトを作成する際、`commonTest`で単一の依存関係を使用することで、JavaScriptターゲットを含むすべてのソースセットにテスト依存関係を追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // これにより、テストアノテーションと機能がJSで利用可能になります
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
                implementation kotlin("test") // これにより、テストアノテーションと機能がJSで利用可能になります
            }
        }
    }
}
```

</tab>
</tabs>

Gradleビルドスクリプトの`testTask`ブロックで利用できる設定を調整することで、Kotlin/JSでのテスト実行方法を調整できます。たとえば、KarmaテストランナーをChromeのヘッドレスインスタンスおよびFirefoxのインスタンスと共に使用すると、次のようになります。

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

デフォルトでは、ブラウザはプラグインにバンドルされていないことに注意してください。これは、ターゲットシステムでブラウザが利用可能であることを確認する必要があることを意味します。

テストが正しく実行されることを確認するには、`src/jsTest/kotlin/AppTest.kt`ファイルを追加し、この内容で埋めます。

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

ブラウザでテストを実行するには、IntelliJ IDEAを介して`jsBrowserTest`タスクを実行するか、ガターアイコンを使用してすべてのテストまたは個別のテストを実行します。

![GradleのjsBrowserTestタスク](browsertest-task.png){width=700}

あるいは、コマンドラインでテストを実行したい場合は、Gradleラッパーを使用します。

```bash
./gradlew jsBrowserTest
```

IntelliJ IDEAからテストを実行すると、**Run**ツールウィンドウにテスト結果が表示されます。失敗したテストをクリックするとスタックトレースを確認でき、ダブルクリックで対応するテスト実装に移動できます。

![IntelliJ IDEAでのテスト結果](test-stacktrace-ide.png){width=700}

テストの実行方法に関わらず、各テスト実行後、Gradleの整形されたテストレポートが`build/reports/tests/jsBrowserTest/index.html`に生成されます。このファイルをブラウザで開くと、テスト結果の別の概要を確認できます。

![Gradleのテスト概要](test-summary.png){width=700}

上記のコードスニペットに示されている例のテストを使用している場合、1つのテストが合格し、1つのテストが失敗するため、結果として合計50%のテストが成功します。個々のテストケースに関する詳細情報を取得するには、提供されたハイパーリンクから移動できます。

![Gradleの概要における失敗したテストのスタックトレース](failed-test.png){width=700}