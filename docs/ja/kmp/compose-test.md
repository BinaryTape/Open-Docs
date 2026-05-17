[//]: # (title: Compose Multiplatform UI のテスト)

Compose Multiplatform における UI テストは、Jetpack Compose のテスト API と同じファインダー (finders)、アサーション (assertions)、アクション (actions)、マッチャー (matchers) を使用して実装されます。これらに馴染みがない場合は、この記事を読み進める前に [Jetpack Compose のガイド](https://developer.android.com/jetpack/compose/testing) をお読みください。

> この API は [試験的 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) です。
> 将来変更される可能性があります。
>
{style="warning"}

## Compose Multiplatform のテストと Jetpack Compose の違い

Compose Multiplatform の共通テスト API は、JUnit の `TestRule` クラスに依存しません。代わりに、`runComposeUiTest` 関数を呼び出し、`ComposeUiTest` レシーバー上でテスト関数を呼び出します。

ただし、JUnit ベースの API は [デスクトップターゲット](compose-desktop-ui-testing.md) で利用可能です。

## Compose Multiplatform でのテストの記述と実行

まず、テスト用のソースセットと必要な依存関係をモジュールに追加します。次に、サンプルテストを記述して実行し、それをカスタマイズしてみましょう。

### テストソースセットの作成と依存関係へのテストライブラリの追加

具体的な例を示すため、このページの指示は [Kotlin Multiplatform ウィザード](https://kmp.jetbrains.com/) によって生成されたプロジェクト構造に従います。既存のプロジェクトにテストを追加する場合は、パスやコマンド内の `shared` をテスト対象のモジュール名に置き換える必要がある場合があります。

Kotlin Multiplatform ウィザードで **Include tests** オプションをチェックすると、`*Test` ソースセットを含むテスト用の基本構造が生成されます。

UI テストライブラリをセットアップします。
`shared/build.gradle.kts` ファイルで、`commonTest` ソースセットの依存関係に UI テストライブラリを追加します。

```kotlin
kotlin {
    //...
    sourceSets {
        // 共通テストの依存関係を追加
        commonTest.dependencies {
            //...
            implementation("org.jetbrains.compose.ui:ui-test:%org.jetbrains.compose%")
        }

        // デスクトップテストの依存関係を追加
        jvmTest.dependencies { 
            implementation(compose.desktop.currentOs)
        }
    }
}
```

Android 用のインストルメンテッド（エミュレーター）テストを実行する必要がある場合は、Gradle 設定を次のように修正します。
   
1. `shared/build.gradle.kts` ファイルで、`androidLibrary {}` ブロックに以下のコードを追加し、インストルメンテッドテストのソースセットが共通テストソースセットに依存するように設定します。

   ```kotlin
   kotlin {
       //...
       androidLibrary {
           withDeviceTestBuilder { 
               sourceSetTreeName = "test"
           }
       } 
   }
   ```
   
2. `androidApp/build.gradle.kts` ファイルで、`android.defaultConfig {}` ブロックに以下のコードを追加し、Android テストインストルメンテーションランナーを設定します。

   ```kotlin
   android {
       //...
       defaultConfig {
           //...
           testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
       }
   }
   ```

3. `androidApp/build.gradle.kts` ファイルで、ルートの `dependencies {}` ブロックに必要な依存関係を追加します。

    ```kotlin
    dependencies { 
        androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
        debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
    }
    ```
4. メインメニューから **Build | Sync Project with Gradle Files** を選択するか、ビルドスクリタエディタの Gradle リフレッシュボタンをクリックします。

5. インストルメンテッドテスト用に `shared/src/androidDeviceTest` ソースセットを作成することを忘れないでください。
   テストの大部分が `commonTest` にある場合でも、`androidDeviceTest` ディレクトリには、テストが使用する汎用的なアクティビティを指す `AndroidManifest.xml` ファイルが少なくとも必要です。

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        <application>
            <activity
                    android:name="androidx.activity.ComponentActivity"
                    android:exported="true">
                <intent-filter>
                    undefined
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>
            </activity>
        </application>
    </manifest>
    ```
    {collapsible="true" collapsed-title-line-number="5"}

これで、Compose Multiplatform UI の共通テストを記述して実行する準備が整いました。

### 共通テストの記述と実行

`shared/src/commonTest/kotlin/<package>` ディレクトリに `ExampleTest.kt` という名前のファイルを作成し、以下のコードをコピーします。

```kotlin
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertTextEquals
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.v2.runComposeUiTest
import kotlin.test.Test

class ExampleTest {

    @OptIn(ExperimentalTestApi::class)
    @Test
    fun myTest() = runComposeUiTest {
        // API コールをデモンストレーションするためのモック UI を宣言します
        //
        // 実際のプロジェクトのコードをテストするには、独自の宣言に置き換えてください
        setContent {
            var text by remember { mutableStateOf("Hello") }
            Text(
                text = text,
                modifier = Modifier.testTag("text")
            )
            Button(
                onClick = { text = "Compose" },
                modifier = Modifier.testTag("button")
            ) {
                Text("Click me")
            }
        }

        // Compose Multiplatform テスト API のアサーションとアクションを使用して、宣言された UI をテストします
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

テストを実行するには：

<Tabs>
<TabItem title="iOS シミュレーター">

2 つのオプションがあります。
* IntelliJ IDEA で、`myTest()` 関数の横にあるガターの緑色の実行アイコンをクリックし、**Run | ExampleTest.myTest** を選択してから、テスト対象の iOS ターゲットを選択します。
* ターミナルで以下のコマンドを実行します。

   ```shell
   ./gradlew :shared:iosSimulatorArm64Test
   ```

</TabItem>
<TabItem title="Android エミュレーター">

ターミナルで以下のコマンドを実行します。

```shell
./gradlew :shared:connectedAndroidTest
```

現在、`android (local)` テスト構成を使用して共通の Compose Multiplatform テストを実行することはできません。そのため、例えば Android Studio のガターアイコンなどは利用できません。

</TabItem>
<TabItem title="デスクトップ">

2 つのオプションがあります。
* `myTest()` 関数の横にあるガターの緑色の実行アイコンをクリックし、**Run | ExampleTest.myTest** を選択してから、JVM ターゲットを選択します。
* ターミナルで以下のコマンドを実行します。

   ```shell
   ./gradlew :shared:jvmTest
   ```

</TabItem>
<TabItem title="Wasm (ヘッドレスブラウザ)">

ターミナルで以下のコマンドを実行します。

```shell
./gradlew :shared:wasmJsTest
```

</TabItem>
</Tabs>

## 次のステップ

Compose Multiplatform の UI テストの基本を理解したところで、さらにテスト関連のリソースを確認してみましょう。
* Kotlin Multiplatform プロジェクトにおけるテストの概要については、[基本的なプロジェクト構造を理解する](multiplatform-discover-project.md#integration-with-tests) および [マルチプラットフォームアプリをテストする](multiplatform-run-tests.md) チュートリアルをご覧ください。
* デスクトップターゲット向けの JUnit ベースのテストの設定と実行の詳細については、[JUnit を使用した Compose Multiplatform UI のテスト](compose-desktop-ui-testing.md) をご覧ください。
* ローカライズのテストについては、[異なるプラットフォームでのロケールのテスト](compose-localization-tests.md#testing-locales-on-different-platforms) をご覧ください。
* 自動化を含む Android Studio でのより高度なテストについては、Android Studio ドキュメントの [アプリをテストする](https://developer.android.com/studio/test) の記事で説明されています。