[//]: # (title: Kotlin Gradleプラグインのコンパイラオプション)

Kotlinの各リリースには、サポートされているターゲット（JVM、JavaScript、[サポートされているプラットフォーム](native-overview.md#target-platforms)向けのネイティブバイナリ）のコンパイラが含まれています。

これらのコンパイラは、以下によって使用されます。
* IDE: Kotlinプロジェクトの__Compile__または__Run__ボタンをクリックしたとき。
* Gradle: コンソールまたはIDEで`gradle build`を呼び出したとき。
* Maven: コンソールまたはIDEで`mvn compile`または`mvn test-compile`を呼び出したとき。

[コマンドラインコンパイラの操作](command-line.md)チュートリアルで説明されているように、コマンドラインからKotlinコンパイラを手動で実行することもできます。

## オプションの定義方法

Kotlinコンパイラには、コンパイルプロセスを調整するための多数のオプションがあります。

Gradle DSLでは、コンパイラオプションの包括的な設定が可能です。[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)および[JVM/Android](#target-the-jvm)プロジェクトで利用できます。

Gradle DSLを使用すると、ビルドスクリプト内でコンパイラオプションを次の3つのレベルで設定できます。
* **[拡張レベル](#extension-level)**: すべてのターゲットと共有ソースセットの`kotlin {}`ブロック内。
* **[ターゲットレベル](#target-level)**: 特定のターゲットのブロック内。
* **[コンパイルユニットレベル](#compilation-unit-level)**: 通常、特定のコンパイルタスク内。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

上位レベルの設定は、下位レベルの規約（デフォルト）として使用されます。

* 拡張レベルで設定されたコンパイラオプションは、`commonMain`、`nativeMain`、`commonTest`のような共有ソースセットを含む、ターゲットレベルのオプションのデフォルトになります。
* ターゲットレベルで設定されたコンパイラオプションは、`compileKotlinJvm`や`compileTestKotlinJvm`タスクのような、コンパイルユニット（タスク）レベルのオプションのデフォルトになります。

逆に、下位レベルで行われた設定は、上位レベルの関連する設定をオーバーライドします。

* タスクレベルのコンパイラオプションは、ターゲットまたは拡張レベルの関連する設定をオーバーライドします。
* ターゲットレベルのコンパイラオプションは、拡張レベルの関連する設定をオーバーライドします。

どのレベルのコンパイラ引数がコンパイルに適用されているかを確認するには、Gradleの[ロギング](https://docs.gradle.org/current/userguide/logging.html)の`DEBUG`レベルを使用します。
JVMおよびJS/WASMタスクの場合、ログ内で`"Kotlin compiler args:"`という文字列を検索します。Nativeタスクの場合、`"Arguments ="`という文字列を検索します。

> サードパーティ製プラグインの作者の場合、オーバーライドの問題を避けるためにプロジェクトレベルで設定を適用するのが最善です。これには新しい[KotlinプラグインDSL拡張タイプ](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions)を使用できます。この設定については、ご自身で明示的に文書化することをお勧めします。
>
{style="tip"}

### 拡張レベル

すべてのターゲットと共有ソースセットの共通コンパイラオプションは、トップレベルの`compilerOptions {}`ブロックで設定できます。

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### ターゲットレベル

JVM/Androidターゲットのコンパイラオプションは、`target {}`ブロック内の`compilerOptions {}`ブロックで設定できます。

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

Kotlin Multiplatformプロジェクトでは、特定のターゲット内でコンパイラオプションを設定できます。例えば、`jvm { compilerOptions {}}`です。詳細については、[Multiplatform Gradle DSL reference](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)を参照してください。

### コンパイルユニットレベル

特定のコンパイルユニットまたはタスクのコンパイラオプションは、タスク設定内の`compilerOptions {}`ブロックで設定できます。

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

`KotlinCompilation`を介して、コンパイルユニットレベルでコンパイラオプションにアクセスして設定することもできます。

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

JVM/Androidおよび[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)とは異なるターゲットのプラグインを設定したい場合は、対応するKotlinコンパイルタスクの`compilerOptions {}`プロパティを使用します。以下の例は、KotlinとGroovy DSLの両方でこの設定を行う方法を示しています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
</tabs>

## JVMをターゲットにする

[前述](#how-to-define-options)のとおり、JVM/Androidプロジェクトのコンパイラオプションは、拡張、ターゲット、コンパイルユニットレベル（タスク）で定義できます。

デフォルトのJVMコンパイルタスクは、プロダクションコードには`compileKotlin`、テストコードには`compileTestKotlin`と呼ばれます。カスタムソースセットのタスクは、`compile<Name>Kotlin`パターンに従って命名されます。

ターミナルで`gradlew tasks --all`コマンドを実行し、`Other tasks`グループで`compile*Kotlin`タスク名を検索することで、Androidコンパイルタスクのリストを確認できます。

留意すべきいくつかの重要な詳細点があります。

* `android.kotlinOptions`と`kotlin.compilerOptions`の設定ブロックは互いにオーバーライドします。最後の（最も低い）ブロックが適用されます。
* `kotlin.compilerOptions`は、プロジェクト内のすべてのKotlinコンパイルタスクを設定します。
* `kotlin.compilerOptions` DSLによって適用された設定は、`tasks.named<KotlinJvmCompile>("compileKotlin") { }`（または`tasks.withType<KotlinJvmCompile>().configureEach { }`）のアプローチを使用してオーバーライドできます。

## JavaScriptをターゲットにする

JavaScriptコンパイルタスクは、プロダクションコードには`compileKotlinJs`、テストコードには`compileTestKotlinJs`、カスタムソースセットには`compile<Name>KotlinJs`と呼ばれます。

単一のタスクを設定するには、その名前を使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

Gradle Kotlin DSLを使用する場合、最初にプロジェクトの`tasks`からタスクを取得する必要があることに注意してください。

JSターゲットと共通ターゲットには、それぞれ`Kotlin2JsCompile`および`KotlinCompileCommon`タイプを使用します。

ターミナルで`gradlew tasks --all`コマンドを実行し、`Other tasks`グループで`compile*KotlinJS`タスク名を検索することで、JavaScriptコンパイルタスクのリストを確認できます。

## すべてのKotlinコンパイルタスク

プロジェクト内のすべてのKotlinコンパイルタスクを設定することも可能です。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</tab>
</tabs>

## すべてのコンパイラオプション

Gradleコンパイラのオプションの完全なリストを以下に示します。

### 共通属性

| 名前              | 説明                                                                                                                              | 指定可能な値           | デフォルト値 |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | [opt-inコンパイラ引数](opt-in-requirements.md)のリストを設定するためのプロパティ                                                 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | [プログレッシブコンパイラモード](whatsnew13.md#progressive-mode)を有効にします                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | `true`の場合に警告を発する[追加の宣言、式、型に関するコンパイラチェック](whatsnew21.md#extra-compiler-checks)を有効にします | `true`, `false`           | `false`       |

### JVM固有の属性

| 名前                      | 説明                                                                                                                                                                                                                                   | 指定可能な値                                                                                         | デフォルト値               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | メソッドパラメータに対するJava 1.8リフレクション用のメタデータを生成します                                                                                                                                                                                |                                                                                                         | `false`                       |
| `jvmTarget`               | 生成されるJVMバイトコードのターゲットバージョン                                                                                                                                                                                                  | `"1.8"`, `"9"`, `"10"`, ..., `"22"`, `"23"`。また、[コンパイラオプションの型](#types-for-compiler-options)も参照 | `"%defaultJvmTargetVersion%"` |
| `noJdk`                   | Javaランタイムをクラスパスに自動的に含めない                                                                                                                                                                               |                                                                                                         | `false`                       |
| `jvmTargetValidationMode` | <list><li>KotlinとJava間の[JVMターゲット互換性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)の検証</li><li>`KotlinCompile`型のタスクのプロパティ。</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                              | `ERROR`                     |

### JVMとJavaScriptに共通の属性

| 名前 | 説明 | 指定可能な値 |デフォルト値 |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 警告がある場合にエラーとして報告します | | `false` |
| `suppressWarnings` | 警告を生成しません | | `false` |
| `verbose` | 詳細なロギング出力を有効にします。[Gradleのデバッグログレベルが有効](https://docs.gradle.org/current/userguide/logging.html)な場合にのみ機能します | | `false` |
| `freeCompilerArgs` | 追加のコンパイラ引数のリスト。実験的な`-X`引数もここで使用できます。[追加引数のfreeCompilerArgs経由での使用例](#example-of-additional-arguments-usage-via-freecompilerargs)を参照 | | `[]` |
| `apiVersion`      | 宣言の使用をバンドルされたライブラリの指定されたバージョンからのものに制限します | `"1.8"`, `"1.9"`, `"2.0"`, `"2.1"`, `"2.2"` (EXPERIMENTAL) |               |
| `languageVersion` | 指定されたKotlinバージョンとのソース互換性を提供します                         | `"1.8"`, `"1.9"`, `"2.0"`, `"2.1"`, `"2.2"` (EXPERIMENTAL)  |               |

> 将来のリリースで`freeCompilerArgs`属性を非推奨にする予定です。Kotlin Gradle DSLで不足しているオプションがある場合は、[課題を提出](https://youtrack.jetbrains.com/newissue?project=kt)してください。
>
{style="warning"}

#### freeCompilerArgsを介した追加引数の使用例 {initial-collapse-state="collapsed" collapsible="true"}

`freeCompilerArgs`属性を使用して、追加の（実験的なものを含む）コンパイラ引数を指定できます。この属性に単一の引数を追加することも、引数のリストを追加することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.%gradleLanguageVersion%)
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.%gradleLanguageVersion%
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

</tab>
</tabs>

> `freeCompilerArgs`属性は、[拡張](#extension-level)、[ターゲット](#target-level)、および[コンパイルユニット（タスク）](#compilation-unit-level)の各レベルで利用可能です。
>
{style="tip"} 

#### languageVersionの設定例 {initial-collapse-state="collapsed" collapsible="true"}

言語バージョンを設定するには、次の構文を使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
    }
```

</tab>
</tabs>

また、[コンパイラオプションの型](#types-for-compiler-options)も参照してください。

### JavaScript固有の属性

| 名前 | 説明                                                                                                                                                                                                                              | 指定可能な値                                                                                                                                                            | デフォルト値                      |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 内部宣言のエクスポートを無効にします                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `main` | `main`関数が実行時に呼び出されるべきかどうかを指定します                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | コンパイラによって生成されるJSモジュールの種類                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | ソースマップを生成します                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `sourceMapEmbedSources` | ソースファイルをソースマップに埋め込みます                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | Kotlinコードで宣言した変数名と関数名をソースマップに追加します。動作の詳細については、[コンパイラリファレンス](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no)を参照してください | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | ソースマップ内のパスに指定されたプレフィックスを追加します                                                                                                                                                                                      |                                                                                                                                                                            | `null`                               |
| `target` | 特定のECMAバージョン向けのJSファイルを生成します                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 生成されたJavaScriptコードでES2015クラスを使用できるようにします。ES2015ターゲットを使用する場合はデフォルトで有効                                                                                                                                                                                              |                                                                                                                                                                            | `null`                               |

### コンパイラオプションの型

一部の`compilerOptions`では、`String`型ではなく新しい型を使用します。

| オプション                             | 型                                                                                                                                                                                                              | 例                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion`と`languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 次のステップ

詳細については、以下を参照してください。
* [Kotlin Multiplatform DSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、Kotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradleプラグインバリアントのサポート](gradle-plugin-variants.md)。