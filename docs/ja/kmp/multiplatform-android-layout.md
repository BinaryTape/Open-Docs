[//]: # (title: Androidソースセットレイアウト)

新しいAndroidソースセットレイアウトはKotlin 1.8.0で導入され、1.9.0でデフォルトになりました。このガイドに従って、非推奨のレイアウトと新しいレイアウトの主な違いを理解し、プロジェクトを移行する方法を確認してください。

> すべての提案を実装する必要はありません。ご自身のプロジェクトに適用できるもののみで構いません。
>
{style="tip"}

## 互換性を確認する

新しいレイアウトにはAndroid Gradleプラグイン7.0以降が必要であり、Android Studio 2022.3以降でサポートされています。Android Gradleプラグインのバージョンを確認し、必要であればアップグレードしてください。

## Kotlinソースセットの名前を変更する

該当する場合、プロジェクト内のソースセットの名前を、以下のパターンに従って変更してください。

| 以前のソースセットレイアウト             | 新しいソースセットレイアウト               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` は `{KotlinSourceSet.name}` に以下のようにマッピングされます。

|             | 以前のソースセットレイアウト | 新しいソースセットレイアウト          |
|-------------|----------------------------|--------------------------------|
| main        | androidMain                | androidMain                    |
| test        | androidTest                | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## ソースファイルを移動する

該当する場合、ソースファイルを新しいディレクトリに、以下のパターンに従って移動してください。

| 以前のソースセットレイアウト                            | 新しいソースセットレイアウト               |
|-------------------------------------------------------|-------------------------------------|
| レイアウトには追加の `/kotlin` SourceDirectories がありました | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` は `{SourceDirectories included}` に以下のようにマッピングされます。

|             | 以前のソースセットレイアウト                                    | 新しいソースセットレイアウト                                                                             |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## AndroidManifest.xml ファイルを移動する

`AndroidManifest.xml` ファイルがプロジェクトにある場合、それを新しいディレクトリに、以下のパターンに従って移動してください。

| 以前のソースセットレイアウト                             | 新しいソースセットレイアウト                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` は `{AndroidManifest.xml location}` に以下のようにマッピングされます。

|       | 以前のソースセットレイアウト    | 新しいソースセットレイアウト                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## Androidと共通テストの関係を確認する

新しいAndroidソースセットレイアウトは、Androidインスツルメンテッドテスト (新しいレイアウトでは `androidInstrumentedTest` に名前が変更されました) と共通テストの関係を変更します。

以前は、`androidAndroidTest` と `commonTest` 間の `dependsOn` 関係がデフォルトでした。これは次のことを意味しました：

*   `commonTest` のコードは `androidAndroidTest` で利用可能でした。
*   `commonTest` の `expect` 宣言には、`androidAndroidTest` で対応する `actual` 実装が必要でした。
*   `commonTest` で宣言されたテストは、Androidインスツルメンテッドテストとしても実行されていました。

新しいAndroidソースセットレイアウトでは、`dependsOn` 関係はデフォルトでは追加されません。以前の動作を希望する場合、`build.gradle.kts` ファイルで以下の関係を手動で宣言してください。

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

以前は、Kotlin Gradleプラグインは、`debug` および `release` ビルドタイプや `demo` や `full` のようなカスタムフレーバーを含むAndroidソースセットに対応するソースセットを積極的に作成していました。これにより、`val androidDebug by getting { ... }` のような式を使用することで、ソースセットがアクセス可能でした。

新しいAndroidソースセットレイアウトは、Androidの [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1)) を利用してソースセットを作成します。これにより、そのような式は無効になり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` のようなエラーが発生します。

これを回避するには、`build.gradle.kts` ファイルで新しい `invokeWhenCreated()` API を使用してください。

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}