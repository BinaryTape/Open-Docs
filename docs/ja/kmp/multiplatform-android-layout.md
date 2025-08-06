[//]: # (title: Androidソースセットレイアウト)

新しいAndroidソースセットレイアウトはKotlin 1.8.0で導入され、1.9.0でデフォルトになりました。このガイドに従って、非推奨のレイアウトと新しいレイアウトの主な違い、およびプロジェクトの移行方法を理解してください。

> すべての提案を実装する必要はありません。自身のプロジェクトに適用可能なもののみで十分です。
>
{style="tip"}

## 互換性の確認

新しいレイアウトにはAndroid Gradle プラグイン 7.0 以降が必要です。また、Android Studio 2022.3 以降でサポートされています。Android Gradle プラグインのバージョンを確認し、必要に応じてアップグレードしてください。

## Kotlinソースセットの名前変更

適用可能な場合は、このパターンに従ってプロジェクトのソースセットの名前を変更してください。

| 以前のソースセットレイアウト           | 新しいソースセットレイアウト        |
|------------------------------------|---------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}`は次のように`{KotlinSourceSet.name}`にマッピングされます。

|             | 以前のソースセットレイアウト | 新しいソースセットレイアウト           |
|-------------|--------------------------|------------------------------------|
| main        | androidMain              | androidMain                        |
| test        | androidTest              | android**Unit**Test                |
| androidTest | android**Android**Test   | android**Instrumented**Test        |

## ソースファイルの移動

適用可能な場合は、このパターンに従ってソースファイルを新しいディレクトリに移動してください。

| 以前のソースセットレイアウト                            | 新しいソースセットレイアウト        |
|-------------------------------------------------------|---------------------------------|
| レイアウトには追加の`/kotlin` SourceDirectoriesがありました | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}`は次のように`{SourceDirectories included}`にマッピングされます。

|             | 以前のソースセットレイアウト                                  | 新しいソースセットレイアウト                                                                         |
|-------------|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                     |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android**Unit**Test/kotlin<br/>src/test/kotlin<br/>src/test/java                            |
| androidTest | src/android**Android**Test/kotlin<br/>src/androidTest/java | src/android**Instrumented**Test/kotlin<br/>src/androidTest/java, **src/androidTest/kotlin** |

## AndroidManifest.xml ファイルの移動

プロジェクトに`AndroidManifest.xml`ファイルがある場合は、このパターンに従って新しいディレクトリに移動してください。

| 以前のソースセットレイアウト                            | 新しいソースセットレイアウト                    |
|---------------------------------------------------|---------------------------------------------|
| src/{**Android**SourceSet.name}/AndroidManifest.xml | src/{**Kotlin**SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}`は次のように`{AndroidManifest.xml location}`にマッピングされます。

|       | 以前のソースセットレイアウト  | 新しいソースセットレイアウト              |
|-------|---------------------------|-----------------------------------|
| main  | src/main/AndroidManifest.xml  | src/**android**Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/**android**Debug/AndroidManifest.xml |

## Androidと共通テストの関係を確認する

新しいAndroidソースセットレイアウトは、Androidインストゥルメンテッドテスト（新しいレイアウトでは`androidInstrumentedTest`に改名）と共通テストの関係を変更します。

以前は、`androidAndroidTest`と`commonTest`間の`dependsOn`関係がデフォルトでした。これは以下を意味しました。

*   `commonTest`内のコードは`androidAndroidTest`で利用可能でした。
*   `commonTest`の`expect`宣言は、`androidAndroidTest`に対応する`actual`実装を持つ必要がありました。
*   `commonTest`で宣言されたテストは、Androidインストゥルメンテッドテストとしても実行されていました。

新しいAndroidソースセットレイアウトでは、`dependsOn`関係はデフォルトでは追加されません。以前の動作を希望する場合は、`build.gradle.kts`ファイルで以下の関係を手動で宣言してください。

```kotlin
kotlin {
// ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

## Androidフレーバーの実装を調整する

以前は、Kotlin Gradle プラグインは、`debug`および`release`ビルドタイプや`demo`や`full`のようなカスタムフレーバーを含むAndroidソースセットに対応するソースセットを積極的に作成していました。これにより、`val androidDebug by getting { ... }`のような式を使用してソースセットにアクセスできるようになっていました。

新しいAndroidソースセットレイアウトは、ソースセットを作成するためにAndroidの[`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1))を利用します。これにより、そのような式は無効になり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`のようなエラーが発生します。

これを回避するには、`build.gradle.kts`ファイルで新しい`invokeWhenCreated()` APIを使用してください。

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}