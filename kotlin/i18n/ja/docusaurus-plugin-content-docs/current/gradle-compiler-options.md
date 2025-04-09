---
title: "Kotlin Gradle プラグインのコンパイラオプション"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlinの各リリースには、サポートされているターゲット向けのコンパイラーが含まれています。
JVM、JavaScript、および[サポートされているプラットフォーム](native-overview#target-platforms)向けのネイティブバイナリです。

これらのコンパイラーは、以下で使用されます。
* Kotlinプロジェクトで__Compile__または__Run__ボタンをクリックしたときのIDE。
* コンソールまたはIDEで`gradle build`を実行したときのGradle。
* コンソールまたはIDEで`mvn compile`または`mvn test-compile`を実行したときのMaven。

[コマンドラインコンパイラーの操作](command-line)のチュートリアルで説明されているように、コマンドラインからKotlinコンパイラーを手動で実行することもできます。

## オプションの定義方法

Kotlinコンパイラーには、コンパイルプロセスを調整するための多くのオプションがあります。

Gradle DSLを使用すると、コンパイラーオプションを包括的に構成できます。[Kotlin Multiplatform](multiplatform-dsl-reference)および[JVM/Android](#target-the-jvm)プロジェクトで使用できます。

Gradle DSLを使用すると、ビルドスクリプト内で3つのレベルでコンパイラーオプションを構成できます。
* **[拡張機能レベル](#extension-level)**：すべてのターゲットおよび共有ソースセットの`kotlin {}`ブロック内。
* **[ターゲットレベル](#target-level)**：特定のターゲットのブロック内。
* **[コンパイルユニットレベル](#compilation-unit-level)**：通常は特定のコンパイルタスク内。

<img src="/img/compiler-options-levels.svg" alt="Kotlin compiler options levels" width="700" style={{verticalAlign: 'middle'}}/>

上位レベルの設定は、下位レベルの規約（デフォルト）として使用されます。

* 拡張機能レベルで設定されたコンパイラーオプションは、`commonMain`、`nativeMain`、`commonTest`などの共有ソースセットを含む、ターゲットレベルオプションのデフォルトです。
* ターゲットレベルで設定されたコンパイラーオプションは、`compileKotlinJvm`や`compileTestKotlinJvm`タスクなど、コンパイルユニット（タスク）レベルのオプションのデフォルトです。

次に、下位レベルで行われた構成は、上位レベルの関連設定をオーバーライドします。

* タスクレベルのコンパイラーオプションは、ターゲットまたは拡張機能レベルの関連構成をオーバーライドします。
* ターゲットレベルのコンパイラーオプションは、拡張機能レベルの関連構成をオーバーライドします。

コンパイルに適用されるコンパイラー引数のレベルを確認するには、Gradleの[ロギング](https://docs.gradle.org/current/userguide/logging.html)の`DEBUG`レベルを使用します。
JVMおよびJS/WASMタスクの場合は、ログ内で`"Kotlin compiler args:"`文字列を検索します。Nativeタスクの場合は、`"Arguments ="`文字列を検索します。

:::tip
サードパーティのプラグインを作成している場合は、オーバーライドの問題を回避するために、プロジェクトレベルで構成を適用するのが最適です。このためには、新しい[Kotlin plugin DSL extension types](whatsnew21#new-api-for-kotlin-gradle-plugin-extensions)を使用できます。この構成については、ご自身の側で明示的にドキュメント化することをお勧めします。

:::

### 拡張機能レベル

すべてのターゲットおよび共有ソースセットの共通コンパイラーオプションは、最上位レベルの`compilerOptions {}`ブロックで構成できます。

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### ターゲットレベル

JVM/Androidターゲットのコンパイラーオプションは、`target {}`ブロック内の`compilerOptions {}`ブロックで構成できます。

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

Kotlin Multiplatformプロジェクトでは、特定のターゲット内でコンパイラーオプションを構成できます。たとえば、`jvm { compilerOptions {}}`です。詳細については、[Multiplatform Gradle DSL reference](multiplatform-dsl-reference)を参照してください。

### コンパイルユニットレベル

特定のコンパイルユニットまたはタスクのコンパイラーオプションは、タスク構成内の`compilerOptions {}`ブロックで構成できます。

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

`KotlinCompilation`を介してコンパイルユニットレベルでコンパイラーオプションにアクセスして構成することもできます。

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {

                }
            }
        }
    }
}
```

JVM/Androidおよび[Kotlin Multiplatform](multiplatform-dsl-reference)とは異なるターゲットのプラグインを構成する場合は、対応するKotlinコンパイルタスクの`compilerOptions {}`プロパティを使用します。次の例は、KotlinとGroovy DSLの両方でこの構成を設定する方法を示しています。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
</Tabs>

## JVMをターゲットにする

[前述のとおり](#how-to-define-options)、JVM/Androidプロジェクトのコンパイラーオプションは、拡張機能、ターゲット、およびコンパイルユニットレベル（タスク）で定義できます。

デフォルトのJVMコンパイルタスクは、プロダクションコードの場合は`compileKotlin`、テストコードの場合は`compileTestKotlin`と呼ばれます。カスタムソースセットのタスクは、`compile<Name>Kotlin`パターンに従って命名されます。

ターミナルで`gradlew tasks --all`コマンドを実行し、`Other tasks`グループで`compile*Kotlin`タスク名を検索すると、Androidコンパイルタスクのリストを確認できます。

注意すべき重要な詳細をいくつか示します。

* `android.kotlinOptions`および`kotlin.compilerOptions`構成ブロックは、互いにオーバーライドします。最後の（最も低い）ブロックが有効になります。
* `kotlin.compilerOptions`は、プロジェクト内のすべてのKotlinコンパイルタスクを構成します。
* `kotlin.compilerOptions`DSLによって適用される構成は、`tasks.named<KotlinJvmCompile>("compileKotlin") { }`（または`tasks.withType<KotlinJvmCompile>().configureEach { }`）アプローチを使用してオーバーライドできます。

## JavaScriptをターゲットにする

JavaScriptコンパイルタスクは、プロダクションコードの場合は`compileKotlinJs`、テストコードの場合は`compileTestKotlinJs`、カスタムソースセットの場合は`compile<Name>KotlinJs`と呼ばれます。

単一のタスクを構成するには、その名前を使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</TabItem>
</Tabs>

Gradle Kotlin DSLを使用する場合は、最初にプロジェクトの`tasks`からタスクを取得する必要があることに注意してください。

JSおよび共通ターゲットには、それぞれ`Kotlin2JsCompile`および`KotlinCompileCommon`型を使用します。

ターミナルで`gradlew tasks --all`コマンドを実行し、`Other tasks`グループで`compile*KotlinJS`タスク名を検索すると、JavaScriptコンパイルタスクのリストを確認できます。

## すべてのKotlinコンパイルタスク

プロジェクト内のすべてのKotlinコンパイルタスクを構成することもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</TabItem>
</Tabs>

## すべてのコンパイラーオプション

Gradleコンパイラーのオプションの完全なリストを次に示します。

### 共通属性

| Name              | Description                                                                                                                              | Possible values           | Default value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | [オプトインコンパイラー引数](opt-in-requirements)のリストを構成するためのプロパティ                                                  | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | [プログレッシブコンパイラーモード](whatsnew13#progressive-mode)を有効にします                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | `true`の場合、警告を発する[追加の宣言、式、および型のコンパイラーチェック](whatsnew21#extra-compiler-checks)を有効にします | `true`, `false`           | `false`       |

### JVMに固有の属性

| Name                      | Description                                                                                                                                                                                                                                   | Possible values                                                                                         | Default value               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | メソッドパラメーターに関するJava 1.8リフレクションのメタデータを生成します                                                                                                                                                 |                                                                                                         | false                       |
| `jvmTarget`               | 生成されたJVMバイトコードのターゲットバージョン                                                                                                                                                                                                  | "1.8", "9", "10", ...,  "22", "23"。また、[コンパイラーオプションの型](#types-for-compiler-options)を参照してください。 | "1.8" |
| `noJdk`                   | Javaランタイムをクラスパスに自動的に含めません                                                                                                                                                                               |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>KotlinとJava間の[JVMターゲット互換性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)の検証</li><li>`KotlinCompile`型のタスクのプロパティ。</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                              | `ERROR`                     |

### JVMとJavaScriptに共通の属性

| Name | Description | Possible values                                                |Default value |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 警告がある場合にエラーを報告します |                                                                | false |
| `suppressWarnings` | 警告を生成しません |                                                                | false |
| `verbose` | 詳細なロギング出力を有効にします。[Gradleデバッグログレベルが有効になっている](https://docs.gradle.org/current/userguide/logging.html)場合にのみ機能します |                                                                | false |
| `freeCompilerArgs` | 追加のコンパイラー引数のリスト。ここでは実験的な`-X`引数も使用できます。[例](#example-of-additional-arguments-usage-via-freecompilerargs)を参照してください |                                                                | [] |
| `apiVersion`      | バンドルされたライブラリの指定されたバージョンからの宣言の使用を制限します | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |               |
| `languageVersion` | 指定されたバージョンのKotlinとのソース互換性を提供します                         | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)  |               |
:::tip
今後のリリースでは、属性`freeCompilerArgs`は非推奨になる予定です。Kotlin Gradle DSLに不足しているオプションがある場合は、[課題を提出](https://youtrack.jetbrains.com/newissue?project=kt)してください。

#### freeCompilerArgsを使用した追加の引数の使用例

`freeCompilerArgs`属性を使用して、追加の（実験的なものを含む）コンパイラー引数を指定します。
この属性に単一の引数または引数のリストを追加できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.KOTLIN_2_1)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")

        // Single additional argument
        freeCompilerArgs.add("-Xno-param-assertions")

        // List of arguments
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.KOTLIN_2_1
        jvmTarget = JvmTarget.JVM_1_8
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")
        
        // Single additional argument, can be a key-value pair
        freeCompilerArgs.add("-Xno-param-assertions")
        
        // List of arguments
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</TabItem>
</Tabs>

`freeCompilerArgs`属性は、[拡張機能](#extension-level)、[ターゲット](#target-level)、および[コンパイルユニット（タスク）](#compilation-unit-level)レベルで使用できます。

::: 

#### languageVersionの設定例

言語バージョンを設定するには、次の構文を使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
    }
}
```

</TabItem>
</Tabs>

また、[コンパイラーオプションの型](#types-for-compiler-options)を参照してください。

### JavaScriptに固有の属性

| Name | Description                                                                                                                                                                                                                              | Possible values                                                                                                                                                            | Default value                      |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 内部宣言のエクスポートを無効にします                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `main` | 実行時に`main`関数を呼び出すかどうかを指定します                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | コンパイラーによって生成されるJSモジュールの種類                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | ソースマップを生成します                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `sourceMapEmbedSources` | ソースファイルをソースマップに埋め込みます                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | Kotlinコードで宣言した変数と関数名をソースマップに追加します。動作の詳細については、[コンパイラーリファレンス](compiler-reference#source-map-names-policy-simple-names-fully-qualified-names-no)を参照してください | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | ソースマップ内のパスに指定されたプレフィックスを追加します                                                                                                                                                                                      |                                                                                                                                                                            | `null`                               |
| `target` | 特定のECMAバージョン用のJSファイルを生成します                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 生成されたJavaScriptコードでES2015クラスを使用できるようにします。ES2015ターゲットの使用の場合はデフォルトで有効になります                                                                                                                                                                                              |                                                                                                                                                                            | `null`                               |

### コンパイラーオプションの型

`compilerOptions`の一部は、`String`型の代わりに新しい型を使用します。

| Option                             | Type                                                                                                                                                                                                              | Example                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.KOTLIN_2_1)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 次は何ですか？

以下について詳しく学んでください。
* [Kotlin Multiplatform DSL reference](multiplatform-dsl-reference)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、およびKotlinデーモン](gradle-compilation-and-caches)。
* [Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradleプラグインバリアントのサポート](gradle-plugin-variants)。