[//]: # (title: Kotlin/JS でテストを実行する)

Kotlin Multiplatform Gradle プラグインを使用すると、Gradle 設定を介して指定できるさまざまなテストランナーを使用してテストを実行できます。

マルチプラットフォームプロジェクトを作成する際、`commonTest` に単一の依存関係を使用することで、JavaScript ターゲットを含むすべてのソースセットにテストの依存関係を追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // これにより、JS でテストアノテーションと機能が利用可能になります
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
                implementation kotlin("test") // これにより、JS でテストアノテーションと機能が利用可能になります
            }
        }
    }
}
```

</tab>
</tabs>

Gradle ビルドスクリプトの `testTask` ブロックにある設定を調整することで、Kotlin/JS でのテスト実行方法を微調整できます。例えば、Karma テストランナーを Chrome のヘッドレスインスタンスおよび Firefox のインスタンスと一緒に使用する場合は、次のようになります。

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

利用可能な機能の詳細については、[テストタスクの設定](js-project-setup.md#test-task)に関する Kotlin/JS リファレンスを確認してください。

デフォルトではプラグインにブラウザは同梱されていないことに注意してください。つまり、ターゲットシステムでブラウザが利用可能であることを確認する必要があります。

テストが正しく実行されるか確認するには、`src/jsTest/kotlin/AppTest.kt` ファイルを追加し、以下の内容を記述します。

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

ブラウザでテストを実行するには、IntelliJ IDEA を介して `jsBrowserTest` タスクを実行するか、ガター（gutter）アイコンを使用してすべてまたは個別のテストを実行します。

![Gradle browserTest タスク](browsertest-task.png){width=700}

あるいは、コマンドラインからテストを実行したい場合は、Gradle ラッパーを使用します。

```bash
./gradlew jsBrowserTest
```

IntelliJ IDEA からテストを実行すると、**実行（Run）**ツールウィンドウにテスト結果が表示されます。失敗したテストをクリックするとスタックトレースを表示でき、ダブルクリックで対応するテストの実装に移動できます。

![IntelliJ IDEA でのテスト結果](test-stacktrace-ide.png){width=700}

各テスト実行後、テストの実行方法に関わらず、Gradle による適切にフォーマットされたテストレポートが `build/reports/tests/jsBrowserTest/index.html` に生成されます。このファイルをブラウザで開くと、テスト結果の概要を別の形で確認できます。

![Gradle テストサマリー](test-summary.png){width=700}

上記のスニペットに示されているサンプルのテストセットを使用している場合、1 つのテストが成功し、1 つのテストが失敗するため、最終的にテストの成功率は 50% になります。個々のテストケースに関する詳細情報を取得するには、提供されているハイパーリンクを介して移動できます。

![Gradle サマリー内での失敗したテストのスタックトレース](failed-test.png){width=700}