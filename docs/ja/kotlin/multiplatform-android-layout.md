---
title: Androidソースセットレイアウト
---
新しい Android ソースセットのレイアウトは Kotlin 1.8.0 で導入され、1.9.0 でデフォルトになりました。このガイドに従って、非推奨のレイアウトと新しいレイアウトの主な違いを理解し、プロジェクトを移行する方法を理解してください。

:::tip
すべての提案を実装する必要はなく、特定のプロジェクトに適用できるものだけを実装してください。

:::

## 互換性の確認

新しいレイアウトには Android Gradle plugin 7.0 以降が必要で、Android Studio 2022.3 以降でサポートされています。Android Gradle plugin のバージョンを確認し、必要に応じてアップグレードしてください。

## Kotlin ソースセットの名前を変更する

該当する場合は、プロジェクト内のソースセットの名前を、次のパターンに従って変更します。

| 以前のソースセットのレイアウト             | 新しいソースセットのレイアウト               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` は、次のように `{KotlinSourceSet.name}` にマップされます。

|             | 以前のソースセットのレイアウト | 新しいソースセットのレイアウト          |
|-------------|----------------------------|--------------------------------|
| main        | androidMain                | androidMain                    |
| test        | androidTest                | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## ソースファイルを移動する

該当する場合は、ソースファイルを次のパターンに従って新しいディレクトリに移動します。

| 以前のソースセットのレイアウト                            | 新しいソースセットのレイアウト               |
|-------------------------------------------------------|-------------------------------------|
| レイアウトには追加の `/kotlin` SourceDirectories があった | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` は、次のように `{SourceDirectories included}` にマップされます。

|             | 以前のソースセットのレイアウト                                    | 新しいソースセットのレイアウト                                                                             |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## AndroidManifest.xml ファイルを移動する

プロジェクトに `AndroidManifest.xml` ファイルがある場合は、次のパターンに従って新しいディレクトリに移動します。

| 以前のソースセットのレイアウト                             | 新しいソースセットのレイアウト                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` は、次のように `{AndroidManifest.xml location}` にマップされます。

|       | 以前のソースセットのレイアウト    | 新しいソースセットのレイアウト                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## Android テストと共通テストの関係を確認する

新しい Android ソースセットのレイアウトは、Android インストルメント化テスト（新しいレイアウトでは `androidInstrumentedTest` に名前が変更されました）と共通テストの関係を変更します。

以前は、`androidAndroidTest` と `commonTest` の間の `dependsOn` 関係がデフォルトでした。これは次のことを意味していました。

* `commonTest` のコードは `androidAndroidTest` で使用できました。
* `commonTest` の `expect` 宣言には、`androidAndroidTest` に対応する `actual` 実装が必要でした。
* `commonTest` で宣言されたテストは、Android インストルメント化テストとしても実行されていました。

新しい Android ソースセットのレイアウトでは、`dependsOn` 関係はデフォルトでは追加されません。以前の動作を優先する場合は、`build.gradle.kts` ファイルで次の関係を手動で宣言してください。

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

## Android フレーバーの実装を調整する

以前は、Kotlin Gradle plugin は、`debug` および `release` ビルドタイプ、または `demo` や `full` などのカスタムフレーバーを含む Android ソースセットに対応するソースセットをすぐに作成していました。これにより、`val androidDebug by getting { ... }` のような式を使用してソースセットにアクセスできるようになりました。

新しい Android ソースセットのレイアウトは、Android の [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1)) を使用してソースセットを作成します。これにより、このような式は無効になり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` のようなエラーが発生します。

これを回避するには、`build.gradle.kts` ファイルで新しい `invokeWhenCreated()` API を使用します。

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}
```