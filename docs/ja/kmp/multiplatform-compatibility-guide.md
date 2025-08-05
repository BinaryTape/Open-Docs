[//]: # (title: Kotlin Multiplatformの互換性ガイド)

<show-structure depth="1"/>

このガイドでは、Kotlin Multiplatformプロジェクトの開発中に遭遇する可能性のある[非互換な変更](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)をまとめています。

現在のKotlinの安定版は%kotlinVersion%です。プロジェクトで使用しているKotlinのバージョンと、特定の変更の非推奨サイクルとの関係に注意してください。例：

*   Kotlin 1.7.0からKotlin 1.9.0にアップグレードする場合、[Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25)および[Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22)の両方で有効になった非互換な変更を確認してください。
*   Kotlin 1.9.0からKotlin 2.0.0にアップグレードする場合、[Kotlin 2.0.0以降](#kotlin-2-0-0-and-later)および[Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25)の両方で有効になった非互換な変更を確認してください。

## バージョンの互換性

プロジェクトを設定する際、使用しているKotlin Multiplatform Gradleプラグイン（プロジェクトのKotlinバージョンと同じ）のGradle、Xcode、およびAndroid Gradleプラグインのバージョンとの互換性を確認してください。

| Kotlin Multiplatform plugin version | Gradle                                | Android Gradle plugin                               | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0                               | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21およびKotlin 2.1.0–2.1.10は、Gradle 8.6まで完全に互換性があります。
> Gradleバージョン8.7–8.10もサポートされていますが、1つの例外があります。Kotlin Multiplatform Gradleプラグインを使用している場合、JVMターゲットで`withJava()`関数を呼び出すマルチプラットフォームプロジェクトで非推奨の警告が表示されることがあります。
> 詳細については、「[Javaソースセットがデフォルトで作成されるようになりました](#java-source-sets-created-by-default)」を参照してください。
>
{style="warning"}

## Kotlin 2.0.0以降

このセクションでは、非推奨サイクルが終了し、Kotlin 2.0.0〜%kotlinVersion%で有効になる非互換な変更について説明します。

### 非推奨となったビットコード埋め込み

**変更点**

ビットコード埋め込みは、Xcode 14で非推奨となり、Xcode 15で全てのAppleターゲットから削除されました。これに伴い、フレームワーク設定の`embedBitcode`パラメーター、および`-Xembed-bitcode`と`-Xembed-bitcode-marker`コマンドライン引数がKotlinで非推奨となりました。

**現在のベストプラクティス**

以前のバージョンのXcodeをまだ使用しているが、Kotlin 2.0.20以降にアップグレードしたい場合は、Xcodeプロジェクトでビットコード埋め込みを無効にしてください。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   2.0.20: Kotlin/Nativeコンパイラはビットコード埋め込みをサポートしなくなります。
*   2.1.0: Kotlin Multiplatform Gradleプラグインで`embedBitcode` DSLが警告とともに非推奨となります。
*   2.2.0: 警告がエラーに昇格します。
*   2.3.0: `embedBitcode` DSLが削除されます。

<anchor name="java-source-set-created-by-default"/>
### Javaソースセットがデフォルトで作成されるようになりました

**変更点**

Kotlin Multiplatformを今後のGradleの変更に合わせるため、`withJava()`関数の段階的廃止を進めています。`withJava()`関数は、必要なJavaソースセットを作成することでGradleのJavaプラグインとの統合を可能にしていました。Kotlin 2.1.20以降、これらのJavaソースセットはデフォルトで作成されるようになりました。

**現在のベストプラクティス**

以前は、`src/jvmMain/java`および`src/jvmTest/java`ソースセットを作成するために`withJava()`関数を明示的に使用する必要がありました。

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

Kotlin 2.1.20以降、ビルドスクリプトから`withJava()`関数を削除できます。

さらに、GradleはJavaソースが存在する場合にのみJavaコンパイルタスクを実行するようになり、以前は実行されなかったJVM検証診断がトリガーされます。この診断は、`KotlinJvmCompile`タスクまたは`compilerOptions`内で互換性のないJVMターゲットを明示的に設定している場合に失敗します。JVMターゲットの互換性を確保する方法については、「[関連するコンパイルタスクのJVMターゲット互換性を確認する](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)」を参照してください。

プロジェクトがGradleバージョン8.7より高く、[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、[Application](https://docs.gradle.org/current/userguide/application_plugin.html)などのGradle Javaプラグイン、またはGradle Javaプラグインに依存するサードパーティのGradleプラグインを使用していない場合、`withJava()`関数を削除できます。

プロジェクトが[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Javaプラグインを使用している場合、[新しい実験的なDSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)への移行を推奨します。Gradle 8.7以降、ApplicationプラグインはKotlin Multiplatform Gradleプラグインでは機能しなくなります。

Kotlin Multiplatform Gradleプラグインと、マルチプラットフォームプロジェクト内でJava用の他のGradleプラグインの両方を使用したい場合は、「[Kotlin Multiplatform GradleプラグインとJavaプラグインとの互換性に関する非推奨について](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)」を参照してください。

Kotlin 2.1.20とGradleバージョン8.7より高い環境で[Javaテストフィクスチャ](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)Gradleプラグインを使用している場合、プラグインは機能しません。代わりに、この問題が解決されている[Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details)にアップグレードしてください。

何か問題が発生した場合は、[イシュートラッカー](https://kotl.in/issue)に報告するか、[公式Slackチャンネル](https://kotlinlang.slack.com/archives/C19FD9681)で助けを求めてください。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   Gradle >8.6: `withJava()`関数を使用するマルチプラットフォームプロジェクトの以前のバージョンのKotlinに対して非推奨警告を導入します。
*   Gradle 9.0: この警告をエラーに昇格します。
*   2.1.20: どのバージョンのGradleでも`withJava()`関数を使用する際に非推奨警告を導入します。

<anchor name="android-target-rename"/>
### `android`ターゲットから`androidTarget`への名称変更

**変更点**

Kotlin Multiplatformをより安定させるための取り組みを続けています。この方向における重要なステップは、Androidターゲットに対するファーストクラスサポートを提供することです。将来的には、このサポートはGoogleのAndroidチームが開発する別のプラグインを通じて提供される予定です。

新しいソリューションへの道を開くため、現在のKotlin DSLで`android`ブロックを`androidTarget`に名前変更しています。これは、Googleからの今後のDSLのために短い`android`名を解放するために必要な一時的な変更です。

**現在のベストプラクティス**

`android`ブロックのすべての出現箇所を`androidTarget`に名前変更してください。Androidターゲットサポートのための新しいプラグインが利用可能になったら、GoogleからのDSLに移行してください。これがKotlin MultiplatformプロジェクトでAndroidを扱う際の推奨オプションとなります。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.0: Kotlin Multiplatformプロジェクトで`android`名が使用された場合に非推奨警告を導入します。
*   2.1.0: この警告をエラーに昇格します。
*   2.2.0: Kotlin Multiplatform Gradleプラグインから`android`ターゲットDSLを削除します。

<anchor name="declaring-multiple-targets"/>
### 類似したターゲットを複数宣言する

**変更点**

単一のGradleプロジェクト内で類似したターゲットを複数宣言することは推奨されません。例：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 推奨されず、非推奨警告が表示されます
}
```

一般的なケースとして、2つの関連するコードを一緒に持つことがあります。例えば、`:shared` GradleプロジェクトでKtorまたはOkHttpライブラリを使用してネットワーク処理を実装するために、`jvm("jvmKtor")`と`jvm("jvmOkHttp")`を使用したいとします。

```kotlin
// shared/build.gradle.kts:
kotlin {
    jvm("jvmKtor") {
        attributes.attribute(/* ... */)
    }
    jvm("jvmOkHttp") {
        attributes.attribute(/* ... */)
    }

    sourceSets {
        val commonMain by getting
        val commonJvmMain by sourceSets.creating {
            dependsOn(commonMain)
            dependencies {
                // Shared dependencies
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor dependencies
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp dependencies
            }
        }
    }
}
```

この実装には、単純ではない設定の複雑さが伴います。

*   `:shared`側と各コンシューマー側でGradle属性を設定する必要があります。そうしないと、Gradleは追加情報なしでは、コンシューマーがKtorベースの実装を受け取るべきか、OkHttpベースの実装を受け取るべきか不明なため、そのようなプロジェクトでの依存関係を解決できません。
*   `commonJvmMain`ソースセットを手動で設定する必要があります。
*   この設定には、多数の低レベルのGradleおよびKotlin Gradleプラグインの抽象化とAPIが含まれます。

**現在のベストプラクティス**

この設定が複雑なのは、KtorベースとOkHttpベースの実装が**同じGradleプロジェクト内にある**ためです。多くの場合、それらの部分を個別のGradleプロジェクトに抽出することが可能です。以下に、そのようなリファクタリングの一般的な概要を示します。

1.  元のプロジェクトから重複する2つのターゲットを単一のターゲットに置き換えます。これらのターゲット間で共有ソースセットがあった場合、そのソースと設定を新しく作成されたターゲットのデフォルトソースセットに移動します。

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // ここにjvmCommonMainの設定をコピーします
            }
        }
    }
    ```

2.  通常、`settings.gradle.kts`ファイルで`include`を呼び出すことで、2つの新しいGradleプロジェクトを追加します。例：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  各新しいGradleプロジェクトを設定します。

    *   これらのプロジェクトは単一のターゲットにのみコンパイルされるため、`kotlin("multiplatform")`プラグインを適用する必要はないでしょう。この例では、`kotlin("jvm")`を適用できます。
    *   元のターゲット固有のソースセットの内容を、それぞれのプロジェクトに移動します。例えば、`jvmKtorMain`から`ktor-impl/src`へ。
    *   ソースセットの設定（依存関係、コンパイラオプションなど）をコピーします。
    *   新しいGradleプロジェクトから元のプロジェクトへの依存関係を追加します。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 元のプロジェクトへの依存関係を追加します
        // ここにjvmKtorMainの依存関係をコピーします
    }
    
    kotlin {
        compilerOptions {
            // ここにjvmKtorMainのコンパイラオプションをコピーします
        }
    }
    ```

このアプローチは、初期設定においてより多くの作業を必要としますが、GradleおよびKotlin Gradleプラグインの低レベルエンティティを使用しないため、結果として得られるビルドの使用と保守が容易になります。

> 残念ながら、各ケースの詳細な移行手順を提供することはできません。上記の手順が機能しない場合は、この[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-59316)であなたのユースケースを説明してください。
>
{style="tip"}

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.20: Kotlin Multiplatformプロジェクトで複数の類似したターゲットが使用された場合に非推奨警告を導入します。
*   2.1.0: Kotlin/JSターゲットを除き、そのような場合にエラーを報告します。この例外の詳細については、[YouTrackのissue](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)を参照してください。

<anchor name="deprecate-pre-hmpp-dependencies"/>
### レガシーモードで公開されたマルチプラットフォームライブラリのサポート非推奨化

**変更点**

以前、Kotlin Multiplatformプロジェクトにおける[レガシーモードを非推奨化し](#deprecated-gradle-properties-for-hierarchical-structure-support)、"レガシー"バイナリの公開を停止し、プロジェクトを[階層構造](multiplatform-hierarchy.md)に移行することを奨励しました。

エコシステムから"レガシー"バイナリを段階的に廃止し続けるため、Kotlin 1.9.0以降、レガシーライブラリの使用も推奨されません。プロジェクトがレガシーライブラリに依存している場合、次の警告が表示されます。

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**現在のベストプラクティス**

*マルチプラットフォームライブラリを使用している場合*、それらのほとんどはすでに「階層構造」モードに移行しているため、ライブラリのバージョンを更新するだけで済みます。詳細については、各ライブラリのドキュメントを参照してください。

ライブラリがまだ非レガシーバイナリをサポートしていない場合は、メンテナーに連絡して、この互換性の問題について伝えることができます。

*ライブラリの作成者である場合*、Kotlin Gradleプラグインを最新バージョンに更新し、[非推奨のGradleプロパティ](#deprecated-gradle-properties-for-hierarchical-structure-support)を修正していることを確認してください。

Kotlinチームはエコシステムの移行を積極的に支援しています。何か問題に直面した場合は、遠慮なく[YouTrackにissue](https://kotl.in/issue)を作成してください。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.0: レガシーライブラリへの依存関係に対して非推奨警告を導入します。
*   2.0.0: レガシーライブラリへの依存関係に対する警告をエラーに昇格します。
*   2.0.0以降: レガシーライブラリへの依存関係のサポートを削除します。そのような依存関係を使用すると、ビルドが失敗する可能性があります。

<anchor name="deprecate-hmpp-properties"/>
### 階層構造サポートのための非推奨Gradleプロパティ

**変更点**

Kotlinは、その進化の過程で、マルチプラットフォームプロジェクトにおける[階層構造](multiplatform-hierarchy.md)のサポートを段階的に導入してきました。これは、共通ソースセット`commonMain`と任意のプラットフォーム固有のソースセット（例：`jvmMain`）の間に中間ソースセットを持つ機能です。

ツールチェーンが十分に安定していなかった移行期間中、きめ細やかなオプトインとオプトアウトを可能にするために、いくつかのGradleプロパティが導入されました。

Kotlin 1.6.20以降、階層プロジェクト構造のサポートはデフォルトで有効になっています。しかし、ブロッキング問題が発生した場合のオプトアウトのために、これらのプロパティは保持されていました。すべてのフィードバックを処理した後、これらのプロパティを完全に段階的に廃止し始めています。

以下のプロパティが非推奨になりました。

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**現在のベストプラクティス**

*   これらのプロパティを`gradle.properties`ファイルと`local.properties`ファイルから削除してください。
*   GradleビルドスクリプトやGradleプラグインで、プログラム的に設定することを避けてください。
*   ビルドで使用されているサードパーティのGradleプラグインによって非推奨のプロパティが設定されている場合は、プラグインのメンテナーにこれらのプロパティを設定しないよう依頼してください。

Kotlin 1.6.20以降、Kotlinツールチェーンのデフォルトの動作にはこれらのプロパティが含まれていないため、重大な影響はないと予想されます。ほとんどの影響は、プロジェクトを再ビルドした直後に現れるでしょう。

ライブラリの作成者で、特に安全を期したい場合は、コンシューマーがあなたのライブラリで動作することを確認してください。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.8.20: 非推奨のGradleプロパティが使用された場合に警告を報告します。
*   1.9.20: この警告をエラーに昇格します。
*   2.0.0: 非推奨のプロパティを削除します。Kotlin Gradleプラグインはそれらの使用を無視します。

これらのプロパティを削除した後に問題が発生する万が一の場合には、[YouTrackにissue](https://kotl.in/issue)を作成してください。

<anchor name="target-presets-deprecation"/>
### 非推奨となったターゲットプリセットAPI

**変更点**

ごく初期の開発段階で、Kotlin Multiplatformは、いわゆる_ターゲットプリセット_を扱うためのAPIを導入しました。各ターゲットプリセットは本質的にKotlin Multiplatformターゲットのファクトリとして機能していました。このAPIは、`jvm()`や`iosSimulatorArm64()`のようなDSL関数がより直接的で簡潔な同じユースケースをカバーするため、大部分が冗長であることが判明しました。

混乱を減らし、より明確なガイドラインを提供するために、すべてのプリセット関連APIがKotlin Gradleプラグインの公開APIで非推奨となりました。これには以下が含まれます。

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`内の`presets`プロパティ
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset`インターフェースおよびそのすべての継承者
*   `fromPreset`のオーバーロード

**現在のベストプラクティス**

代わりに、対応する[Kotlinターゲット](multiplatform-dsl-reference.md#targets)を使用してください。例：

<table>
    <tr>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        fromPreset(presets.iosArm64, 'ios')
    }
}
```

</td>
<td>

```kotlin
kotlin {
    iosArm64()
}
```

</td>
</tr>
</table>

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.20: プリセット関連APIの使用に対して警告を報告します。
*   2.0.0: この警告をエラーに昇格します。
*   2.2.0: Kotlin Gradleプラグインの公開APIからプリセット関連APIを削除します。それでも使用しているソースは「未解決の参照」エラーで失敗し、バイナリ（例：Gradleプラグイン）は、最新バージョンのKotlin Gradleプラグインに対して再コンパイルされない限り、リンクエラーで失敗する可能性があります。

<anchor name="target-shortcuts-deprecation"/>
### 非推奨となったAppleターゲットショートカット

**変更点**

Kotlin Multiplatform DSLの`ios()`、`watchos()`、`tvos()`ターゲットショートカットを非推奨にします。これらはAppleターゲットのソースセット階層を部分的に作成するために設計されましたが、拡張が困難で、時には混乱を招くことが判明しました。

例えば、`ios()`ショートカットは`iosArm64`と`iosX64`の両方のターゲットを作成しましたが、Apple Mチップを搭載したホストで作業する際に必要となる`iosSimulatorArm64`ターゲットは含まれていませんでした。しかし、このショートカットを変更することは実装が難しく、既存のユーザープロジェクトで問題を引き起こす可能性がありました。

**現在のベストプラクティス**

Kotlin Gradleプラグインは、組み込みの階層テンプレートを提供するようになりました。Kotlin 1.9.20以降、これはデフォルトで有効になっており、一般的なユースケース向けに事前定義された中間ソースセットが含まれています。

ショートカットの代わりに、ターゲットのリストを指定すると、プラグインはこのリストに基づいて自動的に中間ソースセットを設定します。

例えば、プロジェクトに`iosArm64`と`iosSimulatorArm64`ターゲットがある場合、プラグインは自動的に`iosMain`と`iosTest`の中間ソースセットを作成します。`iosArm64`と`macosArm64`ターゲットがある場合、`appleMain`と`appleTest`ソースセットが作成されます。

詳細については、「[階層プロジェクト構造](multiplatform-hierarchy.md)」を参照してください。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.20: `ios()`、`watchos()`、および`tvos()`ターゲットショートカットが使用された場合に警告を報告します。代わりに、デフォルトの階層テンプレートがデフォルトで有効になります。
*   2.1.0: ターゲットショートカットが使用された場合にエラーを報告します。
*   2.2.0: Kotlin Multiplatform GradleプラグインからターゲットショートカットDSLを削除します。

### Kotlinアップグレード後のiOSフレームワークのバージョン不正

**問題点**

ダイレクト統合を使用している場合、Kotlinコードの変更がXcodeのiOSアプリに反映されないことがあります。ダイレクト統合は`embedAndSignAppleFrameworkForXcode`タスクで設定され、マルチプラットフォームプロジェクトのiOSフレームワークをXcodeのiOSアプリに接続します。

これは、マルチプラットフォームプロジェクトでKotlinのバージョンを1.9.2xから2.0.0にアップグレードした後（または2.0.0から1.9.2xにダウングレードした後）、Kotlinファイルに変更を加え、アプリをビルドしようとすると、Xcodeが以前のバージョンのiOSフレームワークを誤って使用する可能性がある場合に発生します。そのため、変更がXcodeのiOSアプリに表示されません。

**回避策**

1.  Xcodeで、**Product** | **Clean Build Folder**を使用してビルドディレクトリをクリーンします。
2.  ターミナルで、次のコマンドを実行します。

    ```none
    ./gradlew clean
    ```

3.  iOSフレームワークの新しいバージョンが使用されていることを確認するために、アプリを再度ビルドします。

**問題が修正される時期**

この問題はKotlin 2.0.10で修正される予定です。[Kotlin早期アクセスプレビューに参加する](https://kotlinlang.org/docs/eap.html)セクションで、Kotlin 2.0.10のプレビューバージョンが利用可能かどうかを確認できます。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-68257)を参照してください。

## Kotlin 1.9.0−1.9.25

このセクションでは、非推奨サイクルが終了し、Kotlin 1.9.0〜1.9.25で有効になる非互換な変更について説明します。

<anchor name="compilation-source-deprecation"/>
### Kotlinコンパイルに直接Kotlinソースセットを追加するためのAPIの非推奨化 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

`KotlinCompilation.source`へのアクセスが非推奨となりました。次のようなコードは非推奨警告を生成します。

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()
    
    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        targets["jvm"].compilations["main"].source(myCustomIntermediateSourceSet)
    }
}
```

**現在のベストプラクティス**

`KotlinCompilation.source(someSourceSet)`を置き換えるには、`KotlinCompilation`のデフォルトソースセットから`someSourceSet`への`dependsOn`関連を追加します。`by getting`を使用してソースを直接参照することを推奨します。これはより短く、読みやすいです。ただし、すべての場合に適用できる`KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`を使用することもできます。

上記のコードは、次のいずれかの方法で変更できます。

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        // オプション #1. 短くて読みやすい。可能な場合はこれを使用してください。
        // 通常、デフォルトソースセットの名前は、
        // ターゲット名とコンパイル名を単純に連結したものです。
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // オプション #2. 汎用的な解決策。ビルドスクリプトでより高度なアプローチが必要な場合に使用してください。
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.0: `KotlinComplation.source`が使用された場合に非推奨警告を導入します。
*   1.9.20: この警告をエラーに昇格します。
*   2.2.0: Kotlin Gradleプラグインから`KotlinComplation.source`を削除します。ビルドスクリプトのコンパイル時に、これを使用しようとすると「未解決の参照」エラーが発生します。

<anchor name="kotlin-js-plugin-deprecation"/>
### `kotlin-js` Gradleプラグインから`kotlin-multiplatform` Gradleプラグインへの移行 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlin 1.9.0以降、`kotlin-js` Gradleプラグインは非推奨となりました。基本的には、`js()`ターゲットを持つ`kotlin-multiplatform`プラグインの機能を複製しており、内部では同じ実装を共有していました。このような重複は混乱を生み、Kotlinチームのメンテナンス負荷を増大させました。代わりに、`js()`ターゲットを持つ`kotlin-multiplatform` Gradleプラグインへの移行を推奨します。

**現在のベストプラクティス**

1.  `pluginManagement {}`ブロックを使用している場合、プロジェクトから`kotlin-js` Gradleプラグインを削除し、`settings.gradle.kts`ファイルで`kotlin-multiplatform`を適用します。

    <tabs>
    <tab title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 次の行を削除してください:
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 代わりに次の行を追加してください:
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </tab>
    </tabs>

    プラグインを適用する別の方法を使用している場合は、移行手順について[Gradleドキュメント](https://docs.gradle.org/current/userguide/plugins.html)を参照してください。

2.  ソースファイルを`main`および`test`フォルダーから、同じディレクトリ内の`jsMain`および`jsTest`フォルダーに移動します。
3.  依存関係の宣言を調整します。

    *   `sourceSets {}`ブロックを使用し、プロダクション依存関係には`jsMain {}`、テスト依存関係には`jsTest {}`というように、各ソースセットの依存関係を設定することを推奨します。詳細については、「[依存関係の追加](multiplatform-add-dependencies.md)」を参照してください。
    *   ただし、トップレベルのブロックで依存関係を宣言したい場合は、宣言を`api("group:artifact:1.0")`から`add("jsMainApi", "group:artifact:1.0")`などに変更します。

        > この場合、トップレベルの`dependencies {}`ブロックが`kotlin {}`ブロックの**後に**来るようにしてください。そうしないと、「Configuration not found」というエラーが発生します。
        >
        {style="note"}

    `build.gradle.kts`ファイルのコードは、次のいずれかの方法で変更できます。

    <tabs>
    <tab title="kotlin-js">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("js") version "1.9.0"
    }
    
    dependencies {
        testImplementation(kotlin("test"))
        implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
    }
    
    kotlin {
        js {
            // ...
        }
    }
    ```

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // オプション #1. sourceSets {}ブロックで依存関係を宣言する:
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // ここにjsプレフィックスは不要です。トップレベルブロックからコピー＆ペーストできます
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // オプション #2. 依存関係宣言にjsプレフィックスを追加する:
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </tab>
    </tabs>

4.  `kotlin {}`ブロック内でKotlin Gradleプラグインによって提供されるDSLは、ほとんどの場合変更されません。ただし、タスクやコンフィギュレーションなどの低レベルのGradleエンティティを名前で参照していた場合は、通常`js`プレフィックスを追加して調整する必要があります。例えば、`browserTest`タスクは`jsBrowserTest`という名前で見つけることができます。

**変更が有効になる時期**

1.9.0では、`kotlin-js` Gradleプラグインの使用は非推奨警告を生成します。

<anchor name="jvmWithJava-preset-deprecation"/>
### 非推奨となった`jvmWithJava`プリセット {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

`targetPresets.jvmWithJava`は非推奨となり、その使用は推奨されません。

**現在のベストプラクティス**

代わりに`jvm { withJava() }`ターゲットを使用してください。`jvm { withJava() }`に切り替えた後、`.java`ソースへのパスを調整する必要があることに注意してください。

例えば、デフォルト名「jvm」の`jvm`ターゲットを使用している場合：

| Before          | Now                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.3.40: `targetPresets.jvmWithJava`が使用された場合に警告を導入します。
*   1.9.20: この警告をエラーに昇格します。
*   1.9.20以降: `targetPresets.jvmWithJava` APIを削除します。これを使用しようとすると、ビルドスクリプトのコンパイルが失敗します。

> `targetPresets`API全体が非推奨となっていますが、`jvmWithJava`プリセットは異なる非推奨スケジュールを持っています。
>
{style="note"}

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 非推奨となったレガシーAndroidソースセットレイアウト {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

[新しいAndroidソースセットレイアウト](multiplatform-android-layout.md)はKotlin 1.9.0からデフォルトで使用されます。レガシーレイアウトのサポートは非推奨となり、`kotlin.mpp.androidSourceSetLayoutVersion` Gradleプロパティの使用は非推奨診断をトリガーするようになりました。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.0以前: `kotlin.mpp.androidSourceSetLayoutVersion=1`が使用された場合に警告を報告します。この警告は`kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradleプロパティで抑制できます。
*   1.9.20: この警告をエラーに昇格します。このエラーは**抑制できません**。
*   1.9.20以降: `kotlin.mpp.androidSourceSetLayoutVersion=1`のサポートを削除します。Kotlin Gradleプラグインはこのプロパティを無視します。

<anchor name="common-sourceset-with-dependson-deprecation"/>
### カスタム`dependsOn`を持つ`commonMain`および`commonTest`の非推奨化 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

`commonMain`と`commonTest`ソースセットは通常、それぞれ`main`および`test`ソースセット階層のルートを表します。しかし、これらのソースセットの`dependsOn`関連を手動で設定することで、これをオーバーライドすることが可能でした。

このような設定を維持するには、マルチプラットフォームビルドの内部に関する追加の労力と知識が必要です。さらに、`commonMain`が`main`ソースセット階層のルートであるかどうかを確認するために、特定のビルドスクリプトを読み取る必要があるため、コードの読みやすさと再利用性が低下します。

したがって、`commonMain`および`commonTest`での`dependsOn`へのアクセスは非推奨となりました。

**現在のベストプラクティス**

`commonMain.dependsOn(customCommonMain)`を使用する`customCommonMain`ソースセットを1.9.20に移行する必要があるとします。ほとんどの場合、`customCommonMain`は`commonMain`と同じコンパイルに参加しているため、`customCommonMain`を`commonMain`にマージできます。

1.  `customCommonMain`のソースを`commonMain`にコピーします。
2.  `customCommonMain`のすべての依存関係を`commonMain`に追加します。
3.  `customCommonMain`のすべてのコンパイラオプション設定を`commonMain`に追加します。

まれに、`customCommonMain`が`commonMain`よりも多くのコンパイルに参加している場合があります。このような設定には、ビルドスクリプトの追加の低レベル設定が必要です。それがあなたのユースケースであるかどうかわからない場合、おそらくそうではありません。

もしそれがあなたのユースケースである場合は、`customCommonMain`のソースと設定を`commonMain`に移動し、その逆を行うことで、これら2つのソースセットを「スワップ」してください。

**変更が有効になる時期**

以下に計画されている非推奨サイクルを示します。

*   1.9.0: `commonMain`で`dependsOn`が使用された場合に警告を報告します。
*   1.9.20以降: `commonMain`または`commonTest`で`dependsOn`が使用された場合にエラーを報告します。

### フォワード宣言への新しいアプローチ {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

JetBrainsチームは、フォワード宣言の動作をより予測可能にするために、アプローチを刷新しました。

*   `cnames`または`objcnames`パッケージを使用してのみフォワード宣言をインポートできます。
*   対応するCおよびObjective-Cフォワード宣言との間で明示的なキャストを行う必要があります。

**現在のベストプラクティス**

*   `library.package`に`cstructName`フォワード宣言を宣言するCライブラリを考えます。以前は、`import library.package.cstructName`でライブラリから直接インポートすることが可能でした。現在は、特別なフォワード宣言パッケージを使用することしかできません。`import cnames.structs.cstructName`。`objcnames`についても同様です。

*   2つのobjcinteropライブラリを考えます。一方は`objcnames.protocols.ForwardDeclaredProtocolProtocol`を使用し、もう一方は実際の定義を持っています。

    ```ObjC
    // First objcinterop library
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // Second objcinterop library
    // Header:
    #import <Foundation/Foundation.h;>
    @protocol ForwardDeclaredProtocol
    @end
    // Implementation:
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    以前は、オブジェクトをシームレスに転送することが可能でした。現在は、フォワード宣言には明示的な`as`キャストが必要です。

    ```kotlin
    // Kotlin code:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > `objcnames.protocols.ForwardDeclaredProtocolProtocol`にキャストできるのは、対応する実際のクラスからのみです。そうしないと、エラーが発生します。
    >
    {style="note"}

**変更が有効になる時期**

Kotlin 1.9.20以降、対応するCおよびObjective-Cフォワード宣言との間で明示的なキャストを行う必要があります。また、特別なパッケージを使用することでしかフォワード宣言をインポートできなくなりました。

## Kotlin 1.7.0−1.8.22

このセクションでは、非推奨サイクルが終了し、Kotlin 1.7.0〜1.8.22で有効になる非互換な変更について説明します。

<anchor name="deprecated-compatibility-with-kmp-gradle-plugin-and-gradle-java-plugins"/>
### Kotlin Multiplatform GradleプラグインとGradle Javaプラグインとの互換性に関する非推奨について {initial-collapse-state="collapsed" collapsible="true"}

**問題点**

Kotlin Multiplatform GradleプラグインとGradleの[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、[Application](https://docs.gradle.org/current/userguide/application_plugin.html)プラグインとの互換性問題により、これらのプラグインを同じプロジェクトに適用すると非推奨警告が表示されるようになりました。この警告は、マルチプラットフォームプロジェクト内の別のGradleプラグインがGradle Javaプラグインを適用している場合にも表示されます。例えば、[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html)はApplicationプラグインを自動的に適用します。

この非推奨警告は、Kotlin MultiplatformのプロジェクトモデルとGradleのJavaエコシステムプラグインとの間の根本的な互換性問題のために追加されました。GradleのJavaエコシステムプラグインは現在、他のプラグインが次のことを考慮していません。

*   Javaエコシステムプラグインとは異なる方法でJVMターゲットを公開またはコンパイルすること。
*   同じプロジェクト内にJVMとAndroidという2つの異なるJVMターゲットを持つこと。
*   潜在的に複数の非JVMターゲットを持つ複雑なマルチプラットフォームプロジェクト構造を持つこと。

残念ながら、Gradleは現在、これらの問題に対処するためのAPIを提供していません。

以前、Kotlin Multiplatformでは、Javaエコシステムプラグインの統合を支援するためにいくつかの回避策を使用していました。しかし、これらの回避策は互換性の問題を真に解決することはなく、Gradle 8.8のリリース以降、これらの回避策はもはや不可能になりました。詳細については、[YouTrackのissue](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)を参照してください。

この互換性問題をどのように解決するかはまだ不明ですが、Kotlin MultiplatformプロジェクトでのJavaソースコンパイルの何らかの形式のサポートを継続することをお約束します。最低限、JavaソースのコンパイルとGradleの[`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html)プラグインをマルチプラットフォームプロジェクト内で使用することをサポートします。

**現在のベストプラクティス**

マルチプラットフォームプロジェクトでこの非推奨警告が表示される場合、次のことを推奨します。
1.  プロジェクトで実際にGradle Javaプラグインが必要かどうかを判断します。必要ない場合は、削除を検討してください。
2.  Gradle Javaプラグインが単一のタスクにのみ使用されているかどうかを確認します。その場合、大きな労力なしにプラグインを削除できる可能性があります。例えば、タスクがJavadoc JARファイルを作成するためにGradle Javaプラグインを使用している場合、代わりにJavadocタスクを手動で定義できます。

それ以外の場合、Kotlin Multiplatform Gradleプラグインと、マルチプラットフォームプロジェクト内でJava用のこれらのGradleプラグインの両方を使用したい場合は、次のことを推奨します。

1.  Gradleプロジェクト内に個別のサブプロジェクトを作成します。
2.  個別のサブプロジェクトで、Java用のGradleプラグインを適用します。
3.  個別のサブプロジェクトで、親のマルチプラットフォームプロジェクトへの依存関係を追加します。

> 個別のサブプロジェクトはマルチプラットフォームプロジェクトであってはならず、マルチプラットフォームプロジェクトへの依存関係を設定するためにのみ使用する必要があります。
>
{style="warning"}

例えば、`my-main-project`というマルチプラットフォームプロジェクトがあり、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradleプラグインを使用したいとします。

サブプロジェクト（仮に`subproject-A`とします）を作成したら、親プロジェクトの構造は次のようになります。

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

サブプロジェクトの`build.gradle.kts`ファイルで、`plugins {}`ブロックにJava Libraryプラグインを適用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</tab>
</tabs>

サブプロジェクトの`build.gradle.kts`ファイルで、親のマルチプラットフォームプロジェクトへの依存関係を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 親のマルチプラットフォームプロジェクトの名前
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 親のマルチプラットフォームプロジェクトの名前
}
```

</tab>
</tabs>

これで、親プロジェクトは両方のプラグインで動作するように設定されました。

### 自動生成されたターゲットへの新しいアプローチ {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Gradleによって自動生成されるターゲットアクセサーは、`kotlin.targets {}`ブロック内では利用できなくなりました。代わりに、`findByName("targetName")`メソッドを使用してください。

なお、`kotlin.targets {}`のケースでは、例えば`kotlin.targets.linuxX64`のようなアクセサーは引き続き利用可能です。

**現在のベストプラクティス**

<table>
    <tr>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

</td>
    </tr>
</table>

**変更が有効になる時期**

Kotlin 1.7.20では、`kotlin.targets {}`ブロック内でターゲットアクセサーを使用するとエラーが発生するようになりました。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-47047)を参照してください。

### Gradleの入力および出力コンパイルタスクの変更 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlinコンパイルタスクは、`sourceCompatibility`および`targetCompatibility`入力を持つGradleの`AbstractCompile`タスクを継承しなくなりました。これにより、Kotlinユーザーのスクリプトでこれらが利用できなくなります。

コンパイルタスクにおけるその他の破壊的変更：

**現在のベストプラクティス**

| Before                                                              | Now                                                                                                            |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources`入力は利用できなくなりました。           | 代わりに`sources`入力を使用してください。また、`setSource()`メソッドは引き続き利用可能です。                   |
| `sourceFilesExtensions`入力は削除されました。                     | コンパイルタスクは引き続き`PatternFilterable`インターフェースを実装しています。Kotlinソースのフィルタリングにはそのメソッドを使用してください。 |
| `Gradle destinationDir: File`出力は非推奨となりました。         | 代わりに`destinationDirectory: DirectoryProperty`出力を使用してください。                                      |
| `KotlinCompile`タスクの`classpath`プロパティは非推奨です。        | すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストに対して`libraries`入力を使用するようになりました。        |

**変更が有効になる時期**

Kotlin 1.7.20では、入力が利用できなくなり、出力が置き換えられ、`classpath`プロパティが非推奨となりました。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-32805)を参照してください。

### コンパイルへの依存関係の新しい設定名 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlin Multiplatform Gradleプラグインによって作成されるコンパイル設定に新しい名前が付けられました。

Kotlin Multiplatformプロジェクトのターゲットには、`main`と`test`という2つのデフォルトコンパイルがあります。これらの各コンパイルには、`jvmMain`や`jvmTest`などの独自のデフォルトソースセットがあります。以前は、テストコンパイルとそのデフォルトソースセットの設定名が同じであったため、名前の衝突が発生し、プラットフォーム固有の属性でマークされた設定が別の設定に含まれる場合に問題を引き起こす可能性がありました。

現在、コンパイル設定には`Compilation`という追加の接尾辞が付加されており、古いハードコードされた設定名を使用するプロジェクトやプラグインはコンパイルされなくなります。

対応するソースセットへの依存関係の設定名は変更されません。

**現在のベストプラクティス**

<table>
    <tr>
        <td></td>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
        <td rowspan="2"><code>jvmMain</code>コンパイルの依存関係</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td><code>jvmMain</code>ソースセットの依存関係</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code>コンパイルの依存関係</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code>ソースセットの依存関係</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

利用可能なスコープは`Api`、`Implementation`、`CompileOnly`、`RuntimeOnly`です。

**変更が有効になる時期**

Kotlin 1.8.0では、ハードコードされた文字列で古い設定名を使用するとエラーが発生するようになりました。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-35916/)を参照してください。