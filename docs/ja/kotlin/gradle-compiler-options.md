[//]: # (title: Kotlin Gradleプラグインのコンパイラーオプション)

Kotlinの各リリースには、サポートされているターゲット用のコンパイラーが含まれています。
JVM、JavaScript、そして[サポートされているプラットフォーム](native-overview.md#target-platforms)用のネイティブバイナリです。

これらのコンパイラーは、以下の場合に使用されます。
* IDEでKotlinプロジェクトの**Compile**または**Run**ボタンをクリックした場合。
* コンソールまたはIDEで`gradle build`を呼び出した場合、Gradleによって使用されます。
* コンソールまたはIDEで`mvn compile`または`mvn test-compile`を呼び出した場合、Mavenによって使用されます。

また、[コマンドラインコンパイラーの使用](command-line.md)チュートリアルで説明されているように、Kotlinコンパイラーを手動でコマンドラインから実行することもできます。

## オプションの定義方法

Kotlinコンパイラーには、コンパイルプロセスを調整するための多数のオプションがあります。

Gradle DSLは、コンパイラーオプションの包括的な
設定を可能にします。[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options)と[JVM/Android](#target-the-jvm)プロジェクトで利用できます。

Gradle DSLを使用すると、ビルドスクリプト内で3つのレベルでコンパイラーオプションを設定できます。
* **[拡張レベル](#extension-level)**: `kotlin {}`ブロック内でのすべてのターゲットと共有ソースセットに対する設定。
* **[ターゲットレベル](#target-level)**: 特定のターゲットのブロック内での設定。
* **[コンパイル単位レベル](#compilation-unit-level)**: 通常は特定のコンパイルタスク内での設定。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

上位レベルでの設定は、下位レベルの規約（デフォルト）として使用されます。

* 拡張レベルで設定されたコンパイラーオプションは、`commonMain`、`nativeMain`、`commonTest`などの共有ソースセットを含むターゲットレベルのオプションのデフォルトになります。
* ターゲットレベルで設定されたコンパイラーオプションは、`compileKotlinJvm`や`compileTestKotlinJvm`タスクなどのコンパイル単位（タスク）レベルのオプションのデフォルトになります。

一方、下位レベルで行われた設定は、上位レベルの関連する設定を上書きします。

* タスクレベルのコンパイラーオプションは、ターゲットまたは拡張レベルの関連する設定を上書きします。
* ターゲットレベルのコンパイラーオプションは、拡張レベルの関連する設定を上書きします。

コンパイルにどのレベルのコンパイラー引数が適用されているかを確認するには、Gradleの[ロギング](https://docs.gradle.org/current/userguide/logging.html)の`DEBUG`レベルを使用してください。
JVMおよびJS/WASMタスクの場合、ログ内で`"Kotlin compiler args:"`文字列を検索してください。Nativeタスクの場合、`"Arguments ="`文字列を検索してください。

> サードパーティのプラグイン作成者の場合、オーバーライドの問題を避けるために、プロジェクトレベルで設定を適用するのが最善です。
> そのためには、新しい[KotlinプラグインDSL拡張型](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions)を使用できます。この設定については、
> ご自身の側で明示的に文書化することをお勧めします。
>
{style="tip"}

### 拡張レベル

すべてのターゲットと共有ソースセットの共通コンパイラーオプションは、トップレベルの`compilerOptions {}`ブロックで設定できます。

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### ターゲットレベル

JVM/Androidターゲットのコンパイラーオプションは、`target {}`ブロック内の`compilerOptions {}`ブロックで設定できます。

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

Kotlin Multiplatformプロジェクトでは、特定のターゲット内でコンパイラーオプションを設定できます。たとえば、`jvm { compilerOptions {}}`です。詳細については、[Multiplatform Gradle DSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)を参照してください。

### コンパイル単位レベル

特定のコンパイル単位またはタスクのコンパイラーオプションは、タスク設定内の`compilerOptions {}`ブロックで設定できます。

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

`KotlinCompilation`を介して、コンパイル単位レベルでコンパイラーオプションにアクセスして設定することもできます。

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    optIn.add("kotlin.RequiresOptIn")
                }
            }
        }
    }
}
```

JVM/Androidおよび[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)とは異なるターゲットのプラグインを設定したい場合は、対応するKotlinコンパイルタスクの`compilerOptions {}`プロパティを使用してください。以下の例は、この設定をKotlinおよびGroovy DSLの両方でセットアップする方法を示しています。

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

### `kotlinOptions {}`から`compilerOptions {}`への移行 {initial-collapse-state="collapsed" collapsible="true"}

Kotlin 2.2.0より前は、`kotlinOptions {}`ブロックを使用してコンパイラーオプションを設定できました。`kotlinOptions {}`ブロックはKotlin 2.0.0から非推奨になっているため、このセクションではビルドスクリプトを`compilerOptions {}`ブロックを使用するように移行するためのガイダンスと推奨事項を提供します。

* [コンパイラーオプションを一元化し、型を使用する](#centralize-compiler-options-and-use-types)
* [`android.kotlinOptions`からの移行](#migrate-away-from-android-kotlinoptions)
* [`freeCompilerArgs`の移行](#migrate-freecompilerargs)

#### コンパイラーオプションを一元化し、型を使用する

可能な限り、コンパイラーオプションは[拡張レベル](#extension-level)で設定し、特定のタスクについては[コンパイル単位レベル](#compilation-unit-level)で上書きしてください。

`compilerOptions {}`ブロックでは生の文字列を使用できないため、それらを型付きの値に変換してください。たとえば、以下のようなコードがある場合：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

tasks.withType<KotlinCompile>().configureEach {
    kotlinOptions {
        jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
        languageVersion = "%languageVersion%"
        apiVersion = "%apiVersion%"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

tasks.withType(KotlinCompile).configureEach {
    kotlinOptions {
        jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
        languageVersion = '%languageVersion%'
        apiVersion = '%apiVersion%'
    }
}
```

</tab>
</tabs>

移行後は次のようになります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

kotlin {
    // Extension level
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        languageVersion = KotlinVersion.fromVersion("%languageVersion%")
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}

// Example of overriding at compilation unit level
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

kotlin {
  // Extension level
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        languageVersion = KotlinVersion.fromVersion("%languageVersion%")
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}

// Example of overriding at compilation unit level
tasks.named("compileKotlin", KotlinJvmCompile).configure {
    compilerOptions {
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}
```

</tab>
</tabs>

#### `android.kotlinOptions`からの移行

ビルドスクリプトで以前`android.kotlinOptions`を使用していた場合、代わりに`kotlin.compilerOptions`に移行してください。これは拡張レベルまたはターゲットレベルで行います。

たとえば、Androidプロジェクトがある場合：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    kotlinOptions {
        jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    kotlinOptions {
        jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
    }
}
```
</tab>
</tabs>

これを次のように更新します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
  id("com.android.application")
  kotlin("android")
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
    }
}
```

</tab>
</tabs>

そして、たとえばAndroidターゲットを持つKotlin Multiplatformプロジェクトがある場合：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.android.application")
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions.jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.multiplatform'
    id 'com.android.application'
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
            }
        }
    }
}
```

</tab>
</tabs>

これを次のように更新します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.android.application")
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.multiplatform'
    id 'com.android.application'
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        }
    }
}
```

</tab>
</tabs>

#### `freeCompilerArgs`の移行

* すべての`+=`演算を`add()`または`addAll()`関数に置き換えます。
* `-opt-in`コンパイラーオプションを使用している場合は、[KGP APIリファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/)に専用のDSLがすでに利用可能かどうかを確認し、それを使用してください。
* `-progressive`コンパイラーオプションの使用は、専用のDSLである`progressiveMode.set(true)`に移行してください。
* `-Xjvm-default`コンパイラーオプションの使用は、[専用のDSL](gradle-compiler-options.md#attributes-specific-to-jvm)である`jvmDefault.set()`に移行してください。オプションについては、以下のマッピングを使用してください。

  | 移行前                            | 移行後                                             |
  |-----------------------------------|---------------------------------------------------|
  | `-Xjvm-default=all-compatibility` | `jvmDefault.set(JvmDefaultMode.ENABLE)`           |
  | `-Xjvm-default=all`               | `jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)` |
  | `-Xjvm-default=disable`           | `jvmDefault.set(JvmDefaultMode.DISABLE)`          |

たとえば、次のようなコードがある場合：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinOptions {
    freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
    freeCompilerArgs += listOf("-Xcontext-receivers", "-Xinline-classes", "-progressive", "-Xjvm-default=all")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlinOptions {
    freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
    freeCompilerArgs += ["-Xcontext-receivers", "-Xinline-classes", "-progressive", "-Xjvm-default=all"]
}
```

</tab>
</tabs>

次のように移行します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
        freeCompilerArgs.addAll(listOf("-Xcontext-receivers", "-Xinline-classes"))
        progressiveMode.set(true)
        jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
        freeCompilerArgs.addAll(["-Xcontext-receivers", "-Xinline-classes"])
        progressiveMode.set(true)
        jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
    }
}
```

</tab>
</tabs>

## JVMターゲット

[前述](#how-to-define-options)のとおり、JVM/Androidプロジェクトのコンパイラーオプションは、拡張、ターゲット、コンパイル単位（タスク）の各レベルで定義できます。

デフォルトのJVMコンパイルタスクは、プロダクションコード用が`compileKotlin`、テストコード用が`compileTestKotlin`です。
カスタムソースセット用のタスクは、その`compile<Name>Kotlin`パターンに従って命名されます。

`gradlew tasks --all`コマンドをターミナルで実行し、`Other tasks`グループで`compile*Kotlin`というタスク名を検索することで、Androidコンパイルタスクのリストを確認できます。

注意すべきいくつかの重要な詳細：

* `kotlin.compilerOptions`は、プロジェクト内のすべてのKotlinコンパイルタスクを設定します。
* `kotlin.compilerOptions` DSLによって適用される設定は、`tasks.named<KotlinJvmCompile>("compileKotlin") { }`
  （または`tasks.withType<KotlinJvmCompile>().configureEach { }`）アプローチを使用してオーバーライドできます。

## JavaScriptターゲット

JavaScriptコンパイルタスクは、プロダクションコード用が`compileKotlinJs`、テストコード用が`compileTestKotlinJs`、カスタムソースセット用が`compile<Name>KotlinJs`です。

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

Gradle Kotlin DSLでは、最初にプロジェクトの`tasks`からタスクを取得する必要があることに注意してください。

JSおよび共通ターゲットには、それぞれ`Kotlin2JsCompile`および`KotlinCompileCommon`型を使用します。

`gradlew tasks --all`コマンドをターミナルで実行し、`Other tasks`グループで`compile*KotlinJS`というタスク名を検索することで、JavaScriptコンパイルタスクのリストを確認できます。

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

## すべてのコンパイラーオプション

Gradleコンパイラーのオプションの全リストを以下に示します。

### 共通の属性

| 名前              | 説明                                                                                                                              | 設定可能な値              | デフォルト値  |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | [オプトインコンパイラー引数](opt-in-requirements.md)のリストを設定するためのプロパティです。                                                 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | [プログレッシブコンパイラーモード](whatsnew13.md#progressive-mode)を有効にします。                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | `true`の場合、[追加の宣言、式、および型コンパイラーチェック](whatsnew21.md#extra-compiler-checks)を有効にし、警告を発します。 | `true`, `false`           | `false`       |

### JVM固有の属性

| 名前                      | 説明                                                                                                                                                                                                                                  | 設定可能な値                                                                                         | デフォルト値               |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | メソッドパラメータに対するJava 1.8リフレクションのメタデータを生成します。                                                                                                                                                                               |                                                                                                         | `false`                     |
| `jvmTarget`               | 生成されるJVMバイトコードのターゲットバージョンです。                                                                                                                                                                                                 | "1.8", "9", "10", ...,  "23", "24"。また、[コンパイラーオプションの型](#types-for-compiler-options)も参照してください。 | "%defaultJvmTargetVersion%" |
| `noJdk`                   | Javaランタイムをクラスパスに自動的に含めません。                                                                                                                                                                              |                                                                                                         | `false`                     |
| `jvmTargetValidationMode` | <list><li>KotlinとJava間の[JVMターゲット互換性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)の検証。</li><li>`KotlinCompile`タイプのタスクのプロパティ。</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                            | `ERROR`                     |
| `jvmDefault`              | インターフェースで宣言された関数がJVM上のデフォルトメソッドにどのようにコンパイルされるかを制御します。                                                                                                                                                      | `ENABLE`, `NO_COMPATIBILITY`, `DISABLE`                                                                 | `ENABLE`                    |

### JVMとJavaScriptに共通の属性

| 名前                  | 説明                                                                                                                                  | 設定可能な値                                                              | デフォルト値 |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 警告がある場合にエラーを報告します。                                                                                                                    |                                                                           | `false`      |
| `suppressWarnings`    | 警告を生成しません。                                                                                                                            |                                                                           | `false`      |
| `verbose`             | 詳細なロギング出力を有効にします。[Gradleデバッグログレベルが有効](https://docs.gradle.org/current/userguide/logging.html)の場合のみ機能します。 |                                                                           | `false`      |
| `freeCompilerArgs`    | 追加のコンパイラー引数のリストです。実験的な`-X`引数もここで使用できます。[追加引数の使用例](#example-of-additional-arguments-usage-via-freecompilerargs)を参照してください。 |                                                                           | `[]`         |
| `apiVersion`          | バンドルされたライブラリの指定されたバージョンからの宣言の使用を制限します。                                              | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)                          |              |
| `languageVersion`     | 指定されたKotlinバージョンとのソース互換性を提供します。                                                          | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)                          |              |

> 今後のリリースで`freeCompilerArgs`属性は非推奨になる予定です。Kotlin Gradle DSLで何らかのオプションが不足している場合は、
> [イシューを登録してください](https://youtrack.jetbrains.com/newissue?project=kt)。
>
{style="warning"}

#### `freeCompilerArgs`を使用した追加引数の使用例 {initial-collapse-state="collapsed" collapsible="true"}

`freeCompilerArgs`属性を使用して、追加の（実験的なものを含む）コンパイラー引数を指定します。
この属性には、単一の引数または引数のリストを追加できます。

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

> `freeCompilerArgs`属性は、[拡張](#extension-level)、[ターゲット](#target-level)、[コンパイル単位（タスク）](#compilation-unit-level)の各レベルで利用可能です。
>
{style="tip"}

#### `languageVersion`の設定例 {initial-collapse-state="collapsed" collapsible="true"}

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

また、[コンパイラーオプションの型](#types-for-compiler-options)も参照してください。

### JavaScript固有の属性

| 名前                      | 説明                                                                                                                                                                                                                              | 設定可能な値                                                                                                                                                            | デフォルト値                      |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| `friendModulesDisabled`       | 内部宣言のエクスポートを無効にします。                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                           |
| `main`                        | `main`関数が実行時に呼び出されるべきかどうかを指定します。                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL`|
| `moduleKind`                  | コンパイラーによって生成されるJSモジュールの種類です。                                                                                                                                                                           | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                            |
| `sourceMap`                   | ソースマップを生成します。                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                           |
| `sourceMapEmbedSources`       | ソースファイルをソースマップに埋め込みます。                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                            |
| `sourceMapNamesPolicy`        | Kotlinコードで宣言した変数名と関数名をソースマップに追加します。動作の詳細については、[コンパイラーリファレンス](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no)を参照してください。 | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                            |
| `sourceMapPrefix`             | ソースマップ内のパスに指定されたプレフィックスを追加します。                                                                                                                                                                                      |                                                                                                                                                                            | `null`                            |
| `target`                      | 特定のECMAバージョンのJSファイルを生成します。                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                           |
| `useEsClasses`                | 生成されたJavaScriptコードにES2015クラスを使用させます。ES2015ターゲットを使用する場合、デフォルトで有効になります。                                                                                                                                                               |                                                                                                                                                                            | `null`                            |

### コンパイラーオプションの型

`compilerOptions`の一部は、`String`型ではなく新しい型を使用します。

| オプション                         | 型                                                                                                                                                                                                              | 例                                                                                                   |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 次に何をしますか？

詳細はこちらをご覧ください。
* [Kotlin Multiplatform DSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、Kotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradleプラグインバリアントのサポート](gradle-plugin-variants.md)。